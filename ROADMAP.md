# Roadmap

`@api-wrappers/trakt-wrapper` aims to be the practical Trakt companion SDK for
apps that already have catalog metadata and need user activity, sync, and
playback state.

## Current Focus

- Keep the core endpoint namespaces stable: `auth`, `movies`, `shows`, `users`,
  `sync`, `calendars`, `scrobble`, `checkin`, `lists`, and `search`.
- Preserve Bun compatibility and strict TypeScript output.
- Keep the wrapper useful beside `@api-wrappers/tmdb-wrapper`: TMDB for metadata
  and images, Trakt for user watchlists, history, ratings, calendars,
  scrobbling, and sync.
- Prefer typed methods for common Trakt workflows while keeping `trakt.api` as
  the escape hatch for newly released Trakt endpoints.

## Near-Term Documentation

- Add more end-to-end recipes for OAuth, device code login, watchlist sync,
  ratings sync, history imports, and playback scrobbling.
- Add examples that show TMDB ID handoff between `@api-wrappers/tmdb-wrapper`
  and Trakt sync methods.
- Document error handling, retry behavior, pagination headers, and rate-limit
  handling through `@api-wrappers/api-core`.
- Add more examples for calendars, check-ins, custom lists, and playback state.

## Endpoint And Type Coverage

- Expand tests around path construction for calendars, lists, seasons, episodes,
  check-ins, and rating filters.
- Improve request body types where Trakt supports additional sync fields,
  backed by tests and without weakening strict TypeScript.
- Add response fixtures for representative watchlist, history, ratings,
  scrobble, and calendar responses.
- Keep public API changes small and intentional, with migration notes for any
  breaking changes.

## Contributor Experience

- Keep contribution ideas scoped enough for first-time contributors.
- Keep issue templates focused on reproducible Trakt API behavior.
- Keep `bun run verify` as the expected local gate before pull requests.
- Document examples and tests together so new endpoint coverage is easy to
  review.
