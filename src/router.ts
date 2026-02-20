const APP_NAME = '@denovibe/app';
const VERSION = '0.1.0';

const homePage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>denovibe</title>
</head>
<body>
  <h1>🦕 denovibe</h1>
  <p>A GitHub DevOps boilerplate template built with Deno 2.</p>
  <ul>
    <li><a href="/health">Health check</a></li>
    <li><a href="/api/info">App info</a></li>
  </ul>
</body>
</html>`;

export function router(req: Request): Response {
  const url = new URL(req.url);

  if (req.method === 'GET' && url.pathname === '/') {
    return new Response(homePage, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return Response.json({ status: 'ok', version: VERSION }, { status: 200 });
  }

  if (req.method === 'GET' && url.pathname === '/api/info') {
    return Response.json(
      {
        name: APP_NAME,
        version: VERSION,
        deno: {
          version: Deno.version.deno,
          v8: Deno.version.v8,
          typescript: Deno.version.typescript,
        },
      },
      { status: 200 },
    );
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}
