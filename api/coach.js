// AI Coach Chat — Bitelyze
// Rate-limited conversational coach using Claude with prompt caching

const coachLimits = {};
const DAILY_LIMIT = 10;
const DEV_EMAILS = ["ogunlowooluwatosin28@gmail.com"];

function getKey(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const today = new Date().toISOString().split("T")[0];
  return `${ip}_${today}`;
}

function isDevEmail(email) {
  return email && DEV_EMAILS.includes(String(email).toLowerCase());
}

function checkRateLimit(req, email) {
  if (isDevEmail(email)) return true;
  const key = getKey(req);
  const count = coachLimits[key] || 0;
  if (count >= DAILY_LIMIT) return false;
  coachLimits[key] = count + 1;
  // Cleanup old entries
  const today = new Date().toISOString().split("T")[0];
  for (const k of Object.keys(coachLimits)) {
    if (!k.endsWith(today)) delete coachLimits[k];
  }
  return true;
}

function buildSystemPrompt(ctx) {
  const { name, goal, goalSpeed, height, weight, targetWeight, dailyGoal, consumed, todayMeals, recentSummary, motivation, blockers, habits } = ctx || {};
  const goalLabels = { lose_fast: "lose weight fast", lose: "lose weight steadily", lose_slow: "lose weight gradually", maintain: "maintain weight", gain: "build muscle" };
  const motivationLabels = { confidence: "feel more confident", energy: "have more energy and better mood", clothes: "fit into clothes they love", health: "improve physical health", loved_ones: "be more present for loved ones" };

  return `You are Bitelyze — a warm, sharp, no-nonsense AI nutrition coach. You know this user's full profile and recent eating patterns. Respond like a real human coach, not a chatbot.

USER PROFILE:
- Name: ${name || "User"}
- Goal: ${goalLabels[goal] || "stay healthy"}${goalSpeed && goal !== "maintain" ? ` at ${goalSpeed} kg/week` : ""}
- Stats: ${height || "?"}cm, ${weight || "?"}kg${targetWeight ? `, target ${targetWeight}kg` : ""}
- Daily calorie target: ${dailyGoal || 2000} kcal
${motivation ? `- Why they're here: ${motivationLabels[motivation] || motivation}` : ""}
${blockers && blockers.length ? `- What holds them back: ${blockers.join(", ")}` : ""}
${habits && habits.length ? `- Habits they value: ${habits.join(", ")}` : ""}

TODAY:
- Eaten so far: ${consumed || 0} kcal (${dailyGoal ? dailyGoal - (consumed || 0) : 2000} kcal remaining)
- Meals today: ${(todayMeals || []).length === 0 ? "none yet" : todayMeals.map(m => `${m.foodName} (${m.totalCalories} kcal)`).join(", ")}

RECENT PATTERN (last 7 days):
${recentSummary || "Not enough data yet."}

COACH RULES:
1. Keep responses SHORT (2-4 sentences, rarely more). This is a chat, not a lecture.
2. ALWAYS reference the user's actual data when relevant. "You have 640 kcal left" > "You should eat responsibly."
3. If they ask "can I have X", calculate if it fits their remaining calories and tell them specifically.
4. Be warm but direct. Never preachy. Never shame food choices.
5. If they're stressed or emotional, empathize first, advise second.
6. For meal suggestions, give 2-3 specific options with approximate calories, not generic advice.
7. Use their first name occasionally — but not every message.
8. If you don't know something (no data), say so honestly.
9. Emojis sparingly — one or two per response max, only when genuinely adds warmth.
10. Never mention that you're an AI, Claude, or language model.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const userEmail = req.body?.userEmail || null;
  if (!checkRateLimit(req, userEmail)) {
    return res.status(429).json({ error: { message: "You've used all 10 free coach messages today. Come back tomorrow!" } });
  }

  try {
    const { messages, userContext } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const systemPrompt = buildSystemPrompt(userContext);

    // Build conversation history — keep last 12 messages for context
    const chatHistory = messages.slice(-12).map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.content || "").slice(0, 2000)
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        temperature: 0.7,
        // Cache the system prompt — it's long and doesn't change often per user
        system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
        messages: chatHistory,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.log("Coach API error:", err);
      return res.status(500).json({ error: "Coach is temporarily unavailable. Try again shortly." });
    }

    const data = await response.json();
    const reply = data.content?.map(c => c.text || "").join("") || "";

    return res.status(200).json({
      reply: reply.trim(),
      usage: data.usage,
    });
  } catch (err) {
    console.log("Coach handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
