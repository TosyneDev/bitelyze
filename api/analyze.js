// Simple in-memory rate limiting (resets on cold start, but adds server-side protection)
const rateLimits = {};
const DAILY_LIMIT = 5;

function getRateLimitKey(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const today = new Date().toISOString().split("T")[0];
  return `${ip}_${today}`;
}

function checkRateLimit(req) {
  const key = getRateLimitKey(req);
  const count = rateLimits[key] || 0;
  if (count >= DAILY_LIMIT) return false;
  rateLimits[key] = count + 1;
  const today = new Date().toISOString().split("T")[0];
  for (const k of Object.keys(rateLimits)) {
    if (!k.endsWith(today)) delete rateLimits[k];
  }
  return true;
}

// ── Step 1: Search USDA FoodData Central for real nutrition data ──
async function searchUSDA(query) {
  const USDA_KEY = process.env.USDA_API_KEY || "DEMO_KEY";
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}&query=${encodeURIComponent(query)}&pageSize=3&dataType=Survey (FNDDS),SR Legacy`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.foods || data.foods.length === 0) return null;

    // Extract the top result's nutrient data
    const results = data.foods.slice(0, 3).map(food => {
      const nutrients = {};
      for (const n of (food.foodNutrients || [])) {
        const name = n.nutrientName || "";
        if (name === "Energy") nutrients.calories = Math.round(n.value || 0);
        if (name === "Protein") nutrients.protein = Math.round(n.value * 10) / 10;
        if (name === "Carbohydrate, by difference") nutrients.carbs = Math.round(n.value * 10) / 10;
        if (name === "Total lipid (fat)") nutrients.fat = Math.round(n.value * 10) / 10;
        if (name === "Fiber, total dietary") nutrients.fiber = Math.round(n.value * 10) / 10;
        if (name === "Sugars, total including NLEA") nutrients.sugar = Math.round(n.value * 10) / 10;
        if (name === "Sodium, Na") nutrients.sodium = Math.round(n.value || 0);
        if (name === "Cholesterol") nutrients.cholesterol = Math.round(n.value || 0);
      }
      return {
        name: food.description,
        servingSize: food.servingSize ? `${food.servingSize}${food.servingSizeUnit || "g"}` : "100g",
        nutrients,
      };
    });

    return results;
  } catch (e) {
    console.log("USDA search error:", e.message);
    return null;
  }
}

// ── Step 1b: For images, ask Claude to identify the food first ──
async function identifyFoodFromImage(content, apiKey) {
  try {
    const identifyPrompt = [...content.filter(c => c.type === "image"), {
      type: "text",
      text: 'What food items are in this image? Return ONLY a simple comma-separated list of food names (e.g. "grilled chicken breast, white rice, steamed broccoli"). No other text.'
    }];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{ role: "user", content: identifyPrompt }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.map(i => i.text || "").join("") || "";
    return text.trim();
  } catch (e) {
    console.log("Food identification error:", e.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: { message: "Daily limit reached. You get 5 free analyses per day. Try again tomorrow!" } });
  }

  try {
    const { content, foodText, userProfile } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    // ── Two-Step Analysis ──
    let usdaData = null;
    let foodQuery = foodText || null;

    // Step 1: Identify food (for images, use Claude to identify first)
    const isImage = Array.isArray(content) && content.some(c => c.type === "image");
    if (isImage && !foodQuery) {
      foodQuery = await identifyFoodFromImage(content, apiKey);
    }

    // Step 2: Search USDA for real nutritional data
    if (foodQuery) {
      // Search for each food item separately if comma-separated
      const foods = foodQuery.split(",").map(f => f.trim()).filter(Boolean);
      const allResults = [];
      for (const food of foods.slice(0, 5)) {
        const results = await searchUSDA(food);
        if (results && results.length > 0) {
          allResults.push({ query: food, matches: results });
        }
      }
      if (allResults.length > 0) {
        usdaData = allResults;
      }
    }

    // Step 3: Build the enhanced prompt with USDA data
    let enhancedContent;
    const profileStr = userProfile ? `a ${userProfile.age}yo ${userProfile.gender} weighing ${userProfile.weight}kg` : "the user";
    const consumed = userProfile?.consumed || 0;
    const dailyGoal = userProfile?.goal || 2000;
    const jsonFormat = `{"foodName":"...","totalCalories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"servingSize":"...","healthScore":0,"verdict":"1-2 sentence honest verdict mentioning the food by name, like a knowledgeable friend","suggestions":[{"icon":"relevant emoji","text":"specific tip referencing the food name"}],"smarterSwaps":[{"from":"ingredient in this meal","to":"better alternative","reason":"one line why"}]}

RULES FOR SUGGESTIONS (max 4):
1. One PORTION tip: if calories>700 say split into two meals, if high say eat X% less, if good say portion is right for their goal
2. One WHAT TO EAT NEXT tip: based on what macros are low, suggest a specific food for their next meal
3. One FOOD QUALITY tip specific to this meal's actual ingredients
4. One POSITIVE note if healthScore>=6 (reinforce good choices), otherwise another improvement tip
Every suggestion MUST mention the actual food name. No generic advice.

RULES FOR SMARTER SWAPS (exactly 3):
Each swap must target a SPECIFIC ingredient in this meal, not generic advice.
Example for burger with fries: "White bun" -> "Whole wheat bun", reason: "more fiber, slower digestion"

RULES FOR VERDICT:
Must mention the food name. Be honest but not harsh. Include how it fits the user's day.
User has eaten ${consumed}kcal of their ${dailyGoal}kcal goal so far today.`;

    if (usdaData) {
      const usdaStr = JSON.stringify(usdaData, null, 2);
      if (isImage) {
        // Image + USDA data: send image + USDA reference data
        enhancedContent = [
          ...content.filter(c => c.type === "image"),
          {
            type: "text",
            text: `Analyze this food image for ${profileStr}.

Here is REAL nutritional reference data from the USDA database for the identified foods:
${usdaStr}

IMPORTANT: Use the USDA data above as your primary source for calorie and macro values. Estimate the portion size from the image and scale the USDA values accordingly. The USDA values are per 100g unless a serving size is specified.

Return ONLY valid JSON, no markdown: ${jsonFormat}`
          }
        ];
      } else {
        // Text + USDA data
        enhancedContent = `Analyze "${foodText}" for ${profileStr}.

Here is REAL nutritional reference data from the USDA database:
${usdaStr}

IMPORTANT: Use the USDA data above as your primary source for calorie and macro values. Estimate a standard serving size and scale the USDA values accordingly. The USDA values are per 100g unless a serving size is specified.

Return ONLY valid JSON, no markdown: ${jsonFormat}`;
      }
    } else {
      // Fallback: no USDA data found, use original content
      enhancedContent = content;
    }

    // Step 4: Send to Claude for final analysis
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: enhancedContent }],
      }),
    });

    const data = await response.json();

    // Add metadata about data source
    if (data.content) {
      data._source = usdaData ? "usda+claude" : "claude";
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
