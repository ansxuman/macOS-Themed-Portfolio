export default {
  async fetch(request, env) {
    try {
      const res = await fetch(
        'https://dev.to/api/articles/me/published',
        {
          headers: {
            'api-key': env.DEV_TO_API_KEY,
            'Accept': 'application/vnd.forem.api-v1+json',
            'User-Agent': 'macOS-Themed-Portfolio',
          },
        }
      );

      const data = await res.json();

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch posts' }),
        { status: 500 }
      );
    }
  },
};
