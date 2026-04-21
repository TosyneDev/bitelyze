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

    const PRECISION_PROMPT = `You are a professional nutritionist and food scientist with expert-level knowledge of global cuisines, including but not limited to:
- West African cuisine (Nigerian, Ghanaian, Senegalese)
- American cuisine (fast food, comfort food, southern)
- European cuisine (Italian, French, Mediterranean, British)
- Asian cuisine (Chinese, Japanese, Korean, Thai, Indian)
- Middle Eastern and North African cuisine
- Latin American cuisine

Your task is to analyze the food with MAXIMUM precision and deliver calorie and nutrition data that a user can trust to make health decisions.

━━━ STEP 1: FOOD IDENTIFICATION ━━━
- Identify EVERY individual food item
- Do NOT group items unless they are clearly one composite dish
- Name each item using its most specific common name
- If you recognize a regional dish, name it specifically

━━━ STEP 2: PORTION ESTIMATION ━━━
Estimate portion size using visual cues: plate/utensil/hand size, bowl/cup size, thickness, number of pieces, cultural context.
Express portion in the most natural unit: cups for rice/pasta, grams/oz for meat, slices for pizza/bread, ml/oz for drinks.

━━━ STEP 3: CALORIE CALCULATION ━━━
Calculate calories per item individually, sum for total. Account for cooking method precisely (fried +50-100 kcal, grilled lowest, boiled/steamed no addition, sauteed +30-60 kcal). Include visible sauces, dressings, cheese, butter, cream, oil.

━━━ STEP 4: MACRONUTRIENTS ━━━
Calculate protein, carbs, fat, fiber in grams. Never return placeholder zeros — estimate based on ingredients.

━━━ STEP 5: CONFIDENCE ASSESSMENT ━━━
Rate HIGH (clear image, identifiable, measurable portions), MEDIUM (partial obstruction, non-ideal lighting, portion assumptions needed), or LOW (blurry, hidden food, heavy overlap, unsure of key ingredient). If not HIGH, explain specifically in confidenceNote.

━━━ STEP 6: HEALTH SCORE (1-10) ━━━
Score holistically: whole foods vs processed, protein adequacy, fiber, saturated fat/sugar, veggies/fruits, calorie density.
1-3 Indulgent, 4-6 Balanced, 7-8 Nutritious, 9-10 Exceptional.

━━━ STEP 7: SUGGESTIONS ━━━
Exactly 4 suggestions referencing the actual food. Mix required:
- ONE portion control tip
- ONE food quality or swap tip
- ONE suggestion for what to eat NEXT today
- ONE positive observation if health score 6+
Each needs a specific relevant emoji. No generic lightbulbs.

━━━ STEP 8: PORTION TIP ━━━
One sentence on the specific portion size.

━━━ CRITICAL RULES ━━━
1. NEVER return calorie ranges. Always commit to a single best estimate.
2. NEVER say "cannot determine" — always give best estimate with low confidence flag.
3. Account for invisible ingredients in known dishes (jollof has palm oil/tomato paste, pasta carbonara has cream/cheese/bacon/egg, curry has coconut milk/oil).
4. Be honest about uncertainty via confidence field.
5. Prefer slightly HIGH estimates over low for calorie-dense foods (fried, cheese, cream).

━━━ RETURN FORMAT ━━━
Return ONLY valid JSON. No markdown, no backticks.

{
  "foodName": "Main dish or meal name",
  "items": [{"name": "...", "portion": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}],
  "totalCalories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0,
  "servingSize": "...", "cookingMethod": "...",
  "confidence": "high/medium/low",
  "confidenceNote": "Specific reason if not high, else empty string",
  "healthScore": 0, "healthScoreLabel": "Indulgent/Balanced/Nutritious/Exceptional",
  "verdict": "One-sentence honest verdict",
  "portionTip": "Specific advice on this portion size",
  "suggestions": [{"icon": "emoji", "text": "tailored suggestion"}],
  "smarterSwaps": [{"from": "...", "to": "...", "reason": "..."}]
}

Context: Analyzing for ${profileStr}. User has eaten ${consumed}kcal of their ${dailyGoal}kcal goal so far today.`;

    const usdaAddendum = usdaData ? `

━━━ USDA REFERENCE DATA ━━━
Here is REAL nutritional reference data from the USDA database for the identified foods. Use this as your primary source for calorie and macro values; scale to the estimated portion size. USDA values are per 100g unless serving size specified.
${JSON.stringify(usdaData, null, 2)}` : "";

    if (isImage) {
      enhancedContent = [
        ...content.filter(c => c.type === "image"),
        { type: "text", text: PRECISION_PROMPT + usdaAddendum }
      ];
    } else {
      enhancedContent = `The user describes eating: "${foodText}". ` + PRECISION_PROMPT + usdaAddendum;
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
