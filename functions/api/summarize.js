export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    try {
      const { text } = await request.json();
      
      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes text in Arabic.' },
          { role: 'user', content: `لخص النص التالي:\n\n${text}` }
        ]
      });
      
      return Response.json(response);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }
}
