# Cloudflare Workers + React Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ubix08/rednox-visual-flow-editor)

A production-ready full-stack template combining Cloudflare Workers (backend API with Hono) and React (frontend with Vite, Tailwind CSS, and shadcn/ui). Built for rapid development, deployment, and scaling on Cloudflare's edge network.

## ✨ Features

- **Full-Stack Ready**: React 18 frontend + Cloudflare Workers backend with Hono routing.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom design system, dark mode support.
- **Developer Experience**: TypeScript, Vite hot reload, TanStack Query, React Router, Zod validation.
- **Edge-Optimized**: Zero-config deployment to Cloudflare Workers/Pages with automatic asset bundling.
- **Production Features**: Error reporting, logging, CORS, health checks, and retry logic for dynamic imports.
- **Mobile-Responsive**: Built-in hooks for mobile detection and responsive design.
- **Extensible**: Easy sidebar layout, theme toggle, toast notifications (Sonner), and charts (Recharts).

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion
- **Backend**: Cloudflare Workers, Hono, TypeScript
- **Data/State**: TanStack Query, Zustand, React Hook Form, Zod
- **UI Utils**: clsx, tailwind-merge, class-variance-authority
- **Other**: Sonner (toasts), Recharts, Date-fns, UUID

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-update/) installed
- Cloudflare account and API token configured (`wrangler login`)

### Installation
```bash
bun install
```

### Development
```bash
# Start dev server (frontend + worker proxy)
bun dev

# In another terminal, for type generation
bun cf-typegen
```

- Frontend runs on `http://localhost:3000` (or `$PORT`)
- API routes available at `/api/*`
- Add custom routes in `worker/userRoutes.ts` (never edit `worker/index.ts`)

### Build for Production
```bash
bun build
```

## 📚 Usage

### Frontend Development
- Pages in `src/pages/`
- Components in `src/components/` (use shadcn/ui primitives)
- Layouts: `AppLayout.tsx` for sidebar (optional)
- Hooks: `useTheme`, `useMobile`
- Error handling: Built-in `ErrorBoundary` and client error reporting to `/api/client-errors`

### Backend API (Workers)
- Define routes in `worker/userRoutes.ts`
- Access via `Env` bindings (e.g., `KV`, `D1`, `R2`)
- CORS enabled for `/api/*`
- Health check: `GET /api/health`

**Example API Route** (add to `userRoutes.ts`):
```typescript
app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Cloudflare' } }));
```

### Customizing UI
- Edit `tailwind.config.js` and `src/index.css` for theming
- Add shadcn components: Follow `components.json` config
- Theme toggle included out-of-the-box

## ☁️ Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun deploy
```

Or manually:
```bash
bun build
wrangler deploy
```

- Assets served as SPA (single-page application)
- Worker handles `/api/*` routes first
- Custom domain: Update `wrangler.jsonc`

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ubix08/rednox-visual-flow-editor)

### Environment Variables
Configure in Cloudflare dashboard or `wrangler.toml`:
```
KV_NAMESPACE_ID=your-kv-id
D1_DATABASE_ID=your-d1-id
# etc.
```

## 🤝 Contributing

1. Fork the repo
2. `bun install`
3. Make changes
4. `bun lint` and `bun build`
5. Submit PR

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🚀 Getting Help

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

Built with ❤️ for the Cloudflare ecosystem.