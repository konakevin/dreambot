/**
 * Recipe Registry — stores recipes once, returns an ID for reference on posts.
 * Uses a fingerprint (JSON hash) to deduplicate: same user + same recipe = same row.
 */

import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/types/recipe';

function fingerprint(recipe: Recipe): string {
  // Stable JSON string for dedup — sort keys to ensure consistency
  return JSON.stringify(recipe, Object.keys(recipe).sort());
}

/**
 * Register a recipe and return its ID. If this exact recipe already exists
 * for this user, returns the existing ID (no duplicate rows).
 */
export async function registerRecipe(userId: string, recipe: Recipe): Promise<string> {
  const fp = fingerprint(recipe);

  // Try insert, on conflict return existing
  const { data, error } = await supabase
    .from('recipe_registry')
    .upsert(
      { user_id: userId, recipe, fingerprint: fp },
      { onConflict: 'user_id,fingerprint' },
    )
    .select('id')
    .single();

  if (error) throw new Error(`Recipe registry failed: ${error.message}`);
  return data.id;
}

/**
 * Fetch a recipe by its registry ID.
 */
export async function fetchRecipeById(recipeId: string): Promise<Recipe | null> {
  const { data } = await supabase
    .from('recipe_registry')
    .select('recipe')
    .eq('id', recipeId)
    .single();

  return (data?.recipe as Recipe) ?? null;
}
