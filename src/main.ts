import { router } from './router.ts';

const port = Number(Deno.env.get('PORT') ?? 8000);

console.log(`denovibe listening on http://localhost:${port}`);

Deno.serve({ port }, router);
