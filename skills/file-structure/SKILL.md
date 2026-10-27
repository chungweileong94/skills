---
name: file-structure
description: Organize JavaScript and TypeScript files when creating, extracting, sharing, or moving React components, component utilities, and server-only modules. Use for file placement decisions in React, Next.js, and other JS/TS projects.
---

# File structure

Choose file locations by ownership, reuse, and runtime. Apply these conventions to the files involved in the task; reorganize a wider area only when requested.

The ownership and reuse rules apply across frameworks. Next.js App Router paths and directives below are examples; use the project's equivalent routing, colocation, and runtime-boundary conventions.

## Establish the source root

Inspect the existing source layout, framework/router, filename conventions, and import aliases. Paths below use `src/` as an example. If the project keeps source at its root, use `components/`, `server/`, `lib/`, and `utils/` there instead. In a monorepo, use the owning application's or package's source root; sharing within an application does not require a new workspace package.

Reuse existing directories with the same role and match the project's filename casing and extensions. Create directories as needed for actual files.

## Place components by their consumers

Treat a route entry and its private support folders as one ownership scope, wherever the framework allows those files to live. Separate routes and independently owned component directories are independent scopes; physical directory differences alone do not establish sharing.

- For a component owned by one ordinary component, place its file beside that consumer. For example, keep `order-summary-row.tsx` beside `order-summary.tsx`.
- For a component owned by a page or route entry, place it in a nearby folder that the framework excludes from routing. In Next.js App Router, use `app/orders/_components/order-summary.tsx` beside `app/orders/page.tsx`.
- Multiple consumers within one ownership scope can share a component there. In Next.js, `OrderSummary` used only by `app/orders/page.tsx` and that route's `_components/order-details.tsx` stays in `app/orders/_components/`. Once consumers span independent ownership scopes, move the shared component to the application's global components folder, such as `src/components/order-summary.tsx`. Use the global folder even when those scopes belong to the same feature. Update all affected imports and remove the old copy.
- Put components intended for general use, such as buttons and inputs, in the global components folder immediately, even with only one current consumer. Reuse an existing subdivision such as `src/components/ui/` where appropriate.

Count consumers of the component itself. A private child of a globally shared component can remain beside its owning component. Promote based on actual consumers or clear general-purpose intent, rather than hypothetical reuse.

### Adapt to framework conventions

Keep framework entry files in their required locations. Check the framework's reserved filenames, route-discovery rules, and supported colocation conventions before placing supporting files. Framework requirements take precedence over the example paths in this skill.

Keep page-owned components close to their page using the framework's supported colocation or route-exclusion mechanism. The `_components` path above is one framework-specific example. Use the equivalent for the project's framework and configuration. If safe colocation is unavailable, place supporting files outside the route-discovery directory and group them by their owning page.

## Keep component utilities identifiable

When a component-specific helper needs its own file, name it after the component and place it beside that component:

```text
order-summary.tsx
order-summary.utils.ts
order-summary.utils.test.ts
```

This is useful when logic inside a component needs a focused unit test. Extract that logic into the utility module so the test can import it directly. Match the repository's test suffix and runner. Keep helpers inline when a separate file adds no value, and keep tests focused on behavior.

Move private utility and test files with their owning component. If a utility becomes independently shared, give it a name that describes its purpose and place it in the appropriate shared `lib/` or `utils/` directory. Keep component-specific logic out of generic utility files.

Apply the same ownership and reuse reasoning to non-React JS/TS modules. Use `.js` and `.jsx` equivalents in JavaScript projects.

## Separate server-only implementation

Put extracted database access, secret-bearing integrations, and other server-only implementation helpers in an application-wide server directory, such as `src/server/lib/` or `src/server/utils/`, even with only one consumer. A component-specific server helper can retain its descriptive name there, such as `src/server/utils/order-summary.utils.ts`.

Keep route-local server actions or mutation handlers with their owning route, using the framework's supported entry files and server boundaries. These handlers can import implementation helpers from `server/`. Promote reusable action modules only when consumers span independent ownership scopes.

In Next.js App Router, keep route-local Server Actions in the owning route's `_actions.ts` with a top-level `'use server'` directive. A deletion action used only by `app/orders/_components/delete-order-dialog.tsx` belongs in `app/orders/_actions.ts`. Genuinely shared Server Actions may live in `src/server/actions/`.

Put code usable in both browser and server environments outside `server/`, such as `src/lib/` or `src/utils/`, when it needs a shared location. Runtime-neutral component-specific helpers still belong beside their component. Check dependencies as well as the module's own code before treating it as usable in both environments.

Framework entry files stay where the framework requires them and can import implementations from `server/`. Where supported, keep React Server Components with their owning page or component according to the component rules above; extract their server-only implementation into `server/` when it needs a separate module.

A folder name alone does not enforce the runtime boundary. Use the framework's server-only module conventions, preserve the project's boundary checks, and keep client imports, including indirect imports through re-exports, free of server-only modules. In Next.js App Router, mark server-only implementation modules with `import 'server-only'` as described in the official [server/client guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning). Keep browser-only modules outside `server/` and out of code intended for both runtimes.

After moving files, update affected imports and exports and use the project's relevant checks to verify that imports resolve, routes retain their meaning, and runtime boundaries remain intact.
