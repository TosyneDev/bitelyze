// Simple in-memory rate limiting (resets on cold start, but adds server-side protection)
const rateLimits = {};
const DAILY_LIMIT = 5;
const DEV_EMAILS = ["ogunlowooluwatosin28@gmail.com"];

function getRateLimitKey(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const today = new Date().toISOString().split("T")[0];
  return `${ip}_${today}`;
}

function isDevEmail(email) {
  return email && DEV_EMAILS.includes(String(email).toLowerCase());
}

function checkRateLimit(req, email) {
  if (isDevEmail(email)) return true;
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

// ── Curated nutrition fallback (per 100g) for dishes USDA misses or mismatches ──
// USDA fuzzy-matches poorly on non-Western cuisines (e.g. "tomato stew" -> "stewed
// potatoes with tomatoes"). For these, we use reasonable averages for typical
// home-cooked portions. Final calorie computation is still delegated to Opus 4.7,
// which can override based on what it actually sees in the image.
const CURATED_NUTRITION = {
  // Nigerian / West African — starches & swallows
  "jollof rice":           { calories: 160, protein: 3,   carbs: 26, fat: 4.5, fiber: 1   },
  "jollof":                { calories: 160, protein: 3,   carbs: 26, fat: 4.5, fiber: 1   },
  "fried rice":            { calories: 185, protein: 5,   carbs: 26, fat: 7,   fiber: 2   },
  "coconut rice":          { calories: 175, protein: 3,   carbs: 27, fat: 6,   fiber: 1   },
  "ofada rice":            { calories: 150, protein: 3,   carbs: 30, fat: 1.5, fiber: 2   },
  "pounded yam":           { calories: 120, protein: 2,   carbs: 28, fat: 0.2, fiber: 2   },
  "fufu":                  { calories: 120, protein: 1,   carbs: 28, fat: 0.3, fiber: 1.5 },
  "eba":                   { calories: 155, protein: 1,   carbs: 37, fat: 0.4, fiber: 2   },
  "garri":                 { calories: 155, protein: 1,   carbs: 37, fat: 0.4, fiber: 2   },
  "amala":                 { calories: 115, protein: 2,   carbs: 27, fat: 0.2, fiber: 2   },
  "semovita":              { calories: 110, protein: 2.5, carbs: 23, fat: 0.4, fiber: 1   },
  "semo":                  { calories: 110, protein: 2.5, carbs: 23, fat: 0.4, fiber: 1   },
  "tuwo shinkafa":         { calories: 125, protein: 2,   carbs: 28, fat: 0.3, fiber: 1   },
  "wheat swallow":         { calories: 130, protein: 4,   carbs: 27, fat: 0.5, fiber: 3   },

  // Nigerian — soups (oil-based, calorie-dense)
  "egusi soup":            { calories: 200, protein: 8,   carbs: 6,  fat: 16,  fiber: 3   },
  "egusi":                 { calories: 200, protein: 8,   carbs: 6,  fat: 16,  fiber: 3   },
  "efo riro":              { calories: 135, protein: 5,   carbs: 5,  fat: 10,  fiber: 2   },
  "ogbono soup":           { calories: 180, protein: 6,   carbs: 6,  fat: 14,  fiber: 3   },
  "okra soup":             { calories: 115, protein: 4,   carbs: 5,  fat: 8,   fiber: 2   },
  "okro soup":             { calories: 115, protein: 4,   carbs: 5,  fat: 8,   fiber: 2   },
  "bitter leaf soup":      { calories: 140, protein: 6,   carbs: 4,  fat: 11,  fiber: 3   },
  "onugbu soup":           { calories: 140, protein: 6,   carbs: 4,  fat: 11,  fiber: 3   },
  "afang soup":            { calories: 150, protein: 7,   carbs: 4,  fat: 12,  fiber: 3   },
  "edikaikong":            { calories: 130, protein: 6,   carbs: 4,  fat: 10,  fiber: 3   },
  "banga soup":            { calories: 210, protein: 6,   carbs: 4,  fat: 19,  fiber: 2   },
  "pepper soup":           { calories: 90,  protein: 13,  carbs: 2,  fat: 3,   fiber: 0.5 },
  "goat pepper soup":      { calories: 95,  protein: 14,  carbs: 2,  fat: 3.5, fiber: 0.5 },
  "fish pepper soup":      { calories: 75,  protein: 13,  carbs: 2,  fat: 1.5, fiber: 0.5 },
  "nkwobi":                { calories: 240, protein: 16,  carbs: 3,  fat: 18,  fiber: 1   },

  // Nigerian — stews, proteins, small chops
  "tomato stew":           { calories: 170, protein: 3,   carbs: 6,  fat: 15,  fiber: 1.5 },
  "ata din din":           { calories: 170, protein: 3,   carbs: 6,  fat: 15,  fiber: 1.5 },
  "red stew":              { calories: 170, protein: 3,   carbs: 6,  fat: 15,  fiber: 1.5 },
  "stew":                  { calories: 150, protein: 8,   carbs: 5,  fat: 11,  fiber: 1   },
  "suya":                  { calories: 240, protein: 27,  carbs: 3,  fat: 13,  fiber: 1   },
  "moi moi":               { calories: 140, protein: 9,   carbs: 14, fat: 5,   fiber: 4   },
  "moin moin":             { calories: 140, protein: 9,   carbs: 14, fat: 5,   fiber: 4   },
  "akara":                 { calories: 280, protein: 9,   carbs: 18, fat: 18,  fiber: 4   },
  "ewa agoyin":            { calories: 170, protein: 8,   carbs: 20, fat: 7,   fiber: 5   },
  "beans porridge":        { calories: 135, protein: 8,   carbs: 22, fat: 2,   fiber: 6   },
  "boli":                  { calories: 130, protein: 1,   carbs: 34, fat: 0.4, fiber: 2   },
  "dodo":                  { calories: 190, protein: 1.3, carbs: 32, fat: 7,   fiber: 2   },
  "fried plantain":        { calories: 190, protein: 1.3, carbs: 32, fat: 7,   fiber: 2   },
  "roasted plantain":      { calories: 122, protein: 1.3, carbs: 32, fat: 0.4, fiber: 2.3 },
  "puff puff":             { calories: 330, protein: 4,   carbs: 45, fat: 15,  fiber: 1.5 },
  "meat pie":              { calories: 290, protein: 7,   carbs: 28, fat: 17,  fiber: 1.5 },
  "fried yam":             { calories: 200, protein: 1.5, carbs: 30, fat: 8,   fiber: 3   },
  "boiled yam":            { calories: 118, protein: 1.5, carbs: 28, fat: 0.2, fiber: 4   },
  "roasted yam":           { calories: 130, protein: 1.5, carbs: 30, fat: 0.3, fiber: 4   },
  "asun":                  { calories: 260, protein: 24,  carbs: 4,  fat: 17,  fiber: 1   },
  "chin chin":             { calories: 430, protein: 6,   carbs: 60, fat: 18,  fiber: 1.5 },

  // Other African
  "injera":                { calories: 180, protein: 6,   carbs: 37, fat: 1,   fiber: 5   },
  "doro wat":              { calories: 160, protein: 20,  carbs: 3,  fat: 8,   fiber: 1   },
  "waakye":                { calories: 150, protein: 5,   carbs: 28, fat: 2,   fiber: 3   },
  "kelewele":              { calories: 180, protein: 1.2, carbs: 30, fat: 6,   fiber: 2   },

  // Asian (USDA often misidentifies)
  "pad thai":              { calories: 200, protein: 8,   carbs: 26, fat: 7,   fiber: 2   },
  "biryani":               { calories: 180, protein: 6,   carbs: 22, fat: 7,   fiber: 1.5 },
  "chicken biryani":       { calories: 185, protein: 10,  carbs: 22, fat: 7,   fiber: 1.5 },
  "butter chicken":        { calories: 180, protein: 12,  carbs: 5,  fat: 12,  fiber: 1   },
  "chicken tikka masala":  { calories: 160, protein: 15,  carbs: 6,  fat: 9,   fiber: 1   },
  "tikka masala":          { calories: 160, protein: 15,  carbs: 6,  fat: 9,   fiber: 1   },
  "pho":                   { calories: 75,  protein: 5,   carbs: 10, fat: 1,   fiber: 1   },
  "ramen":                 { calories: 140, protein: 5,   carbs: 20, fat: 5,   fiber: 1   },
  "sushi":                 { calories: 150, protein: 6,   carbs: 28, fat: 0.5, fiber: 0.5 },
  "fried noodles":         { calories: 200, protein: 6,   carbs: 27, fat: 8,   fiber: 2   },

  // Middle Eastern
  "shawarma":              { calories: 250, protein: 18,  carbs: 22, fat: 10,  fiber: 2   },
  "chicken shawarma":      { calories: 245, protein: 19,  carbs: 22, fat: 9,   fiber: 2   },
  "hummus":                { calories: 170, protein: 5,   carbs: 12, fat: 12,  fiber: 5   },
  "falafel":               { calories: 330, protein: 13,  carbs: 32, fat: 18,  fiber: 4   },
  "kebab":                 { calories: 230, protein: 20,  carbs: 2,  fat: 16,  fiber: 0   },
};

function lookupCurated(query) {
  const q = query.toLowerCase().trim();
  if (CURATED_NUTRITION[q]) {
    return [{ name: q, servingSize: "100g", nutrients: CURATED_NUTRITION[q] }];
  }
  // Longest substring match so "fried plantain" beats "plantain" style lookups
  let bestKey = null;
  for (const key of Object.keys(CURATED_NUTRITION)) {
    if (q.includes(key) && (!bestKey || key.length > bestKey.length)) {
      bestKey = key;
    }
  }
  if (bestKey) {
    return [{ name: bestKey, servingSize: "100g", nutrients: CURATED_NUTRITION[bestKey] }];
  }
  return null;
}

// ── Step 1: Search USDA FoodData Central for real nutrition data ──
async function searchUSDA(query) {
  const USDA_KEY = process.env.USDA_API_KEY || "DEMO_KEY";
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}&query=${encodeURIComponent(query)}&pageSize=3&dataType=Survey (FNDDS),SR Legacy`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[analyze] USDA ${res.status} for "${query}"`);
      return null;
    }
    const data = await res.json();
    if (!data.foods || data.foods.length === 0) {
      console.log(`[analyze] USDA 0 hits for "${query}"`);
      return null;
    }

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
      text: `Identify the foods in this image. Output a comma-separated list of SHORT food names.

STRICT RULES:
- Max 5 words per item (not counting the parenthesized portion)
- Use the dish's proper name: "Big Mac", "jollof rice", "pad thai", "egusi soup", "chicken tikka masala", "pounded yam"
- Portion (if visible) goes in parentheses: "jollof rice (1.5 cups)"
- NO color, container, texture, shape, or spatial descriptions
- NO hedging words: "likely", "possibly", "approximately", "appears to be"
- NO descriptive clauses with "with", "in", "on" — unless they're part of the dish name (e.g. "chicken tikka masala with naan" → just "chicken tikka masala, naan")

Output ONLY the list. Nothing else.

GOOD: "jollof rice (1.5 cups), grilled chicken thigh, fried plantains (4 slices)"
GOOD: "egusi soup (2 cups), pounded yam (1 cup)"
GOOD: "Big Mac, large fries, medium Coke"
BAD:  "Nigerian chicken curry/stew with bone-in chicken pieces in orange-red tomato sauce (approximately 3-4 pieces in clear yellow container, ~2 cups)"
BAD:  "round swallow (likely pounded yam or eba/garri) wrapped in plastic bag"`
    }];

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: identifyPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.log(`[analyze] identify failed: HTTP ${res.status} ${errText.slice(0, 200)}`);
      return null;
    }
    const data = await res.json();
    const text = data.content?.map(i => i.text || "").join("") || "";
    const trimmed = text.trim();
    console.log(`[analyze] identified: "${trimmed}"`);
    return trimmed;
  } catch (e) {
    console.log("[analyze] identify error:", e.message);
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

  const userEmail = req.body?.userEmail || req.headers["x-user-email"] || null;
  if (!checkRateLimit(req, userEmail)) {
    return res.status(429).json({ error: { message: "Daily limit reached. You get 5 free analyses per day. Try again tomorrow!" } });
  }

  try {
    const { content, foodText, userProfile } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    // ── Smart Analysis Pipeline ──
    let usdaData = null;
    let foodQuery = foodText || null;
    const isImage = Array.isArray(content) && content.some(c => c.type === "image");

    console.log(`[analyze] incoming: isImage=${isImage}, foodText="${foodText || ""}"`);

    // For images: ask Sonnet 4.6 to identify foods first, then ground in USDA data.
    // The final Opus 4.7 analysis treats USDA entries as reference only, so a wrong
    // first-pass ID can't override what Opus actually sees.
    if (isImage && !foodQuery) {
      const identified = await identifyFoodFromImage(content, apiKey);
      if (identified) foodQuery = identified;
    }

    if (foodQuery) {
      // Strip parenthesized content FIRST so commas inside parens don't break splitting,
      // then clean portion units and drop junk fragments.
      const withoutParens = foodQuery.replace(/\([^)]*\)/g, "");
      const cleanFood = (s) => s
        .replace(/\d+\s*(slices?|cups?|oz|g|ml|pieces?|tbsp|tsp)/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      const foods = withoutParens
        .split(",")
        .map(f => cleanFood(f))
        .map(f => f.split(/\s+/).slice(0, 4).join(" "))
        .filter(f => f.length >= 3 && /[a-z]/i.test(f))
        .slice(0, 5);
      const allResults = [];
      for (const food of foods) {
        // Try curated first — avoids USDA mismatches like "tomato stew" -> "stewed potatoes with tomatoes"
        const curated = lookupCurated(food);
        if (curated) {
          allResults.push({ query: food, matches: curated, source: "curated" });
          console.log(`[analyze] curated: "${food}" -> ${curated[0].name} (${curated[0].nutrients.calories}kcal/100g)`);
          continue;
        }
        const results = await searchUSDA(food);
        if (results && results.length > 0) {
          allResults.push({ query: food, matches: results, source: "usda" });
        }
      }
      if (allResults.length > 0) {
        usdaData = allResults;
      }
      const summary = allResults.map(r => {
        const top = r.matches[0];
        return `[${r.source}] ${r.query} -> ${top?.name} (${top?.nutrients?.calories ?? "?"}kcal/100g)`;
      }).join("; ");
      console.log(`[analyze] reference matched ${allResults.length}/${foods.length}: ${summary}`);
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

━━━ STEP 1: FOOD IDENTIFICATION (CRITICAL — ACCURACY STARTS HERE) ━━━
Apply this priority order:
1. RECOGNIZE BRANDS / RESTAURANT ITEMS first (Big Mac = 563 kcal, NOT "burger ~400 kcal"). Brand recognition = exact calories.
2. RECOGNIZE REGIONAL DISHES by their proper name (jollof rice, pad thai, tikka masala, fufu, ramen, biryani, paella, suya, amala, egusi soup, injera). These have known recipe profiles.
3. For generic items, identify the SPECIFIC variant (white rice vs brown rice, chicken breast vs thigh, whole milk vs skim).

Common identification mistakes to AVOID:
- "Rice" — must specify white/brown/jasmine/basmati/jollof/fried (calorie diff up to 50%)
- "Chicken" — breast vs thigh vs wing vs fried vs grilled (calorie diff up to 3x)
- "Sandwich" — must identify type (turkey club, BLT, grilled cheese)
- "Pasta" — must specify with sauce (carbonara has cream/cheese, marinara is light)
- "Salad" — dressing matters more than greens (caesar +200kcal, vinaigrette +80kcal)

If you see multiple items, list them ALL separately. Do not collapse "burger and fries" into one item.

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
Each suggestion: 15-22 WORDS. Specific, actionable, references the food.
Each needs a specific relevant emoji. No generic lightbulbs.

━━━ STEP 8: PORTION TIP ━━━
12-18 words. Direct, specific advice tied to this portion size.

━━━ TEXT LENGTH RULES ━━━
- foodName: full descriptive name, no truncation (e.g. "Grilled Chicken Caesar Salad with Croutons")
- verdict: 15-20 WORDS, one clear sentence
- portionTip: 12-18 WORDS
- confidenceNote: 10-15 WORDS, specific reason
- suggestions[].text: 15-22 WORDS each, specific and actionable
- smarterSwaps[].reason: 10-15 WORDS, explains the benefit
Be substantive but not bloated. No hedging like "you might want to consider" — say "swap X for Y to get more protein". Each sentence should add real value.

━━━ CRITICAL RULES ━━━
1. NEVER return calorie ranges. Always commit to a single best estimate.
2. NEVER say "cannot determine" — always give best estimate with low confidence flag.
3. Account for invisible ingredients in known dishes (jollof has palm oil/tomato paste, pasta carbonara has cream/cheese/bacon/egg, curry has coconut milk/oil).
4. Be honest about uncertainty via confidence field.
5. Prefer slightly HIGH estimates over low for calorie-dense foods (fried, cheese, cream).

━━━ RETURN FORMAT ━━━
Return ONLY valid JSON. No markdown, no backticks.

{
  "foodName": "Full descriptive meal name, no truncation",
  "items": [{"name": "...", "portion": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}],
  "totalCalories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0,
  "servingSize": "...", "cookingMethod": "...",
  "confidence": "high/medium/low",
  "confidenceNote": "10-15 words if not high, else empty string",
  "healthScore": 0, "healthScoreLabel": "Indulgent/Balanced/Nutritious/Exceptional",
  "verdict": "15-20 words, one clear sentence",
  "portionTip": "12-18 words, specific portion advice",
  "suggestions": [{"icon": "emoji", "text": "15-22 words, specific and actionable"}],
  "smarterSwaps": [{"from": "...", "to": "...", "reason": "10-15 words, explains benefit"}]
}

Context: Analyzing for ${profileStr}. User has eaten ${consumed}kcal of their ${dailyGoal}kcal goal so far today.`;

    const usdaReferenceNote = isImage
      ? "Nutritional reference data for foods pre-identified from this image by a quick first-pass model. Each entry is tagged [curated] (hand-curated per-100g values for dishes USDA covers poorly — trust these for the named dish) or [usda] (USDA FoodData Central fuzzy match — may have matched the wrong food). The pre-identification itself may be wrong. ONLY use these values if they match what you ACTUALLY see. If any pre-identified item isn't in the image, or if you identify the dish differently, ignore that entry and use your own vision-based estimate. Do NOT let the pre-identification override what you see. Scale values to the portion you actually see (all values per 100g unless serving size specified)."
      : "Nutritional reference data for the identified foods. [curated] entries are hand-curated per-100g values; [usda] entries are from USDA FoodData Central. Use as your primary source for calorie and macro values; scale to the estimated portion size. Values are per 100g unless serving size specified.";

    const usdaAddendum = usdaData ? `

━━━ NUTRITIONAL REFERENCE DATA ━━━
${usdaReferenceNote}
${JSON.stringify(usdaData, null, 2)}` : "";

    if (isImage) {
      // For images, prepend an explicit "look first, then analyze" instruction
      const visionPrompt = `Before anything else, describe what you ACTUALLY see in this image in one short sentence (internally — do not include in output). Then apply the full analysis below.

If you see a specific dish you recognize (Big Mac, jollof rice, pad thai, etc.), name it specifically — do NOT use generic categories. If you're unsure what the dish is, set confidence to medium or low and say so in confidenceNote.

` + PRECISION_PROMPT + usdaAddendum;
      enhancedContent = [
        ...content.filter(c => c.type === "image"),
        { type: "text", text: visionPrompt }
      ];
    } else {
      enhancedContent = `The user describes eating: "${foodText}". ` + PRECISION_PROMPT + usdaAddendum;
    }

    // Step 4: Send to Claude for final analysis
    // Use Opus 4.7 for images (best vision), Sonnet 4.6 for text (faster)
    const analysisModel = isImage ? "claude-opus-4-7" : "claude-sonnet-4-6";
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: analysisModel,
        max_tokens: 2500,
        // Opus 4.7 doesn't support temperature. Only set it for Sonnet (text path).
        ...(isImage ? {} : { temperature: 0.3 }),
        messages: [{ role: "user", content: enhancedContent }],
      }),
    });

    const data = await response.json();

    // Add metadata about data source
    if (data.content) {
      data._source = usdaData ? "usda+claude" : "claude";
    }

    if (!response.ok) {
      console.log(`[analyze] ${analysisModel} HTTP ${response.status}:`, JSON.stringify(data).slice(0, 400));
    } else {
      try {
        const raw = data.content?.map(i => i.text || "").join("") || "";
        const parsed = JSON.parse(raw);
        console.log(`[analyze] ${analysisModel} -> "${parsed.foodName}" ${parsed.totalCalories}kcal (confidence=${parsed.confidence}${parsed.confidenceNote ? `: ${parsed.confidenceNote}` : ""}) source=${data._source}`);
      } catch (e) {
        console.log(`[analyze] ${analysisModel} returned unparseable JSON:`, (data.content?.[0]?.text || "").slice(0, 200));
      }
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
