/**
 * AI service wrappers.
 * All AI calls go through Supabase Edge Functions — NEVER call Gemini directly from the client.
 * The GEMINI_API_KEY lives exclusively in Supabase Edge Secrets.
 */

// TODO Phase 3: Implement typed wrappers for Edge Functions
// - importRecipeFromUrl(url: string)
// - importRecipeFromImage(base64: string)
// - importRecipeFromPdf(base64: string)
// - importRecipeFromText(text: string)
// - translateRecipe(recipeId: string, targetLanguage: 'sv' | 'en')

export {};
