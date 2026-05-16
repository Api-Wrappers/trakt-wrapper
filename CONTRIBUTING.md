# Contributing

Thanks for helping improve `@api-wrappers/trakt-wrapper`. This project is a
strict TypeScript SDK for Trakt, with Bun as the primary development runtime.

## Setup

```bash
bun install
bun run verify
```

`bun run verify` runs source typechecking, test typechecking, the Bun test
suite, and the production build. `bun run validate` is available as a
compatibility alias.

## Development Guidelines

- Check the existing source before documenting or adding an endpoint.
- Do not invent methods that are not implemented.
- Keep public API changes small and explain them in the pull request.
- Preserve Bun compatibility.
- Keep TypeScript strict.
- Do not use `any`; use `unknown` and narrow it when a value is not typed yet.
- Prefer adding tests for endpoint paths, request bodies, query parameters, and
  pagination behavior.
- Keep docs examples aligned with exported methods from `src/index.ts`.

## Adding Or Updating Endpoints

1. Confirm the Trakt path, method, query parameters, and request body shape.
2. Add the method to the relevant endpoint class in `src/endpoints`.
3. Add or update types in `src/types.ts`.
4. Add tests that prove the generated URL, method, and body are correct.
5. Update README or `docs/examples.md` if the endpoint is part of a common app
   flow.

## Documentation Changes

Documentation should make the package easier to use without overstating support.
If an example needs an endpoint that is not typed yet, either use the supported
`trakt.api` escape hatch or open a feature request first.

## Pull Requests

Before opening a PR, run:

```bash
bun run verify
```

Include the validation result in the PR description. If validation cannot run in
your environment, explain why and include the exact command you attempted.
