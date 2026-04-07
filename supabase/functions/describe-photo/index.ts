/**
 * describe-photo — Takes a photo URL, sends it to Haiku vision,
 * returns a detailed text description of the person/pet's appearance.
 * One-time cost at profile save time (~$0.002 per photo).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

async function describePhoto(imageUrl: string, role: string): Promise<string> {
  const systemPrompt =
    role === 'pet'
      ? 'You describe animals for an AI art generator. Be specific about species, breed (if identifiable), coloring, markings, size, fur/feather texture, eye color, and any distinctive features. Output ONLY the description, 2-3 sentences max.'
      : 'You describe people for an AI art generator that creates stylized dream art (NOT photorealistic). Describe: approximate age range, hair color/style/length, skin tone, build, any distinctive features (glasses, facial hair, freckles, etc), and what they are wearing. Do NOT name them. Output ONLY the description, 2-3 sentences max.';

  // Fetch image as base64
  const imgResponse = await fetch(imageUrl);
  const imgBuffer = await imgResponse.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(imgBuffer)));
  const mediaType = imgResponse.headers.get('content-type') ?? 'image/jpeg';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            { type: 'text', text: systemPrompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[describe-photo] Anthropic error:', res.status, err);
    throw new Error(`Vision API failed: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  console.log(`[describe-photo] ${role}:`, text.slice(0, 120));
  return text.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    // Auth check
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('authorization') ?? '';
    const supabaseUser = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const { image_url, role } = await req.json();
    if (!image_url || !role) {
      return new Response(JSON.stringify({ error: 'image_url and role required' }), {
        status: 400,
      });
    }

    const description = await describePhoto(image_url, role);

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[describe-photo] Error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
