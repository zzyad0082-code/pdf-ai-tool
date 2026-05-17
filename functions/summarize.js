export async function onRequestPost({ request, env }) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  try {
    const body = await request.json();
    const prompt = body.messages?.[0]?.content;

    if (!prompt) {
      return new Response(JSON.stringify({ error: { message: 'No prompt provided' } }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Cloudflare AI - مجاني
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: body.system || 'أنت مساعد تعليمي ممتاز. اكتب بالعربي فقط.' },
        { role: 'user', content: prompt }
      ]
    });

    // لازم نرجع نفس الشكل اللي frontend مستنيه: { content: [{ text: "..." }] }
    return new Response(JSON.stringify({
      content: [{ text: response.response || response }]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
