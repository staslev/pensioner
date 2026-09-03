# pensioner — early-retirement simulator for Israel

A fully client-side, no-persistence simulator that estimates the **earliest age you can retire** in Israel (Hebrew / RTL), or how much more you need.

## Run

Requires **Node.js 18+** (LTS recommended; a `.nvmrc` pins Node 20) and npm. No backend,
env vars, or API keys — the app is fully client-side.

```bash
git clone <repo-url> && cd pensioner
npm install      # installs pinned versions from package-lock.json
npm run dev      # start the dev server (Vite prints a localhost URL)
npm test         # run the engine unit tests
npm run build    # type-check + production build (static, deployable anywhere)
```