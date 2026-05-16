<h1 align="center">@api-wrappers/trakt-wrapper</h1>

<p align="center">
  Type-safe TypeScript companion SDK for the <a href="https://trakt.docs.apiary.io/">Trakt API</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@api-wrappers/trakt-wrapper"><img alt="npm version" src="https://img.shields.io/npm/v/@api-wrappers/trakt-wrapper"></a>
  <a href="https://github.com/Api-Wrappers/trakt-wrapper/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/@api-wrappers/trakt-wrapper"></a>
  <a href="https://github.com/Api-Wrappers/trakt-wrapper/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/api-wrappers/trakt-wrapper"></a>
</p>

Trakt is the user activity layer for movie and TV apps. It gives your product a
portable watchlist, viewing history, ratings, playback scrobbling, calendars,
collections, and sync state that can follow a user across devices and services.

`@api-wrappers/trakt-wrapper` is built for watchlist apps, media trackers,
personal media dashboards, second-screen experiences, and sync jobs that need
Trakt data without hand-rolling request paths, headers, OAuth helpers, pagination,
or response types.

It also pairs cleanly with `@api-wrappers/tmdb-wrapper`:

- TMDB gives you rich metadata, artwork, posters, backdrops, discovery, and
  localized media details.
- Trakt gives you user activity: watchlists, history, ratings, calendars,
  scrobbling, collections, playback progress, and account sync.

Use TMDB IDs in Trakt sync bodies to connect the two systems: TMDB powers the
catalog surface, while Trakt records what the user did with that catalog.

## Install

```bash
bun add @api-wrappers/trakt-wrapper
```

```bash
npm install @api-wrappers/trakt-wrapper
```

## Quick Start

```ts
import { Trakt } from "@api-wrappers/trakt-wrapper";

const trakt = new Trakt({
	clientId: process.env.TRAKT_CLIENT_ID,
	accessToken: process.env.TRAKT_ACCESS_TOKEN,
});

const trending = await trakt.movies.trending({ limit: 10, extended: "full" });

for (const item of trending.data) {
	console.log(item.watchers, item.movie.title);
}

console.log(trending.pagination.itemCount);
```

## Why Use This Instead Of Raw Trakt Calls?

- Endpoint groups match the Trakt product areas you build with: `auth`,
  `movies`, `shows`, `users`, `sync`, `calendars`, `scrobble`, `checkin`,
  `lists`, and `search`.
- OAuth URL, authorization-code exchange, refresh, revoke, and device-code flow
  helpers keep auth code out of your request plumbing.
- Paginated endpoints return parsed pagination metadata from Trakt headers.
- The shared `@api-wrappers/api-core` runtime gives you custom `fetch`, retries,
  timeouts, transports, and plugins.
- Request and response types cover common media, user, sync, watchlist, rating,
  and scrobble shapes while preserving a low-level escape hatch for new Trakt
  endpoints.

## OAuth Authorization URL

```ts
const trakt = new Trakt({
	clientId: process.env.TRAKT_CLIENT_ID,
	clientSecret: process.env.TRAKT_CLIENT_SECRET,
	redirectUri: "urn:ietf:wg:oauth:2.0:oob",
});

const authorizeUrl = trakt.auth.getAuthorizationUrl({
	state: "csrf-or-session-state",
});

console.log(authorizeUrl);

const token = await trakt.auth.exchangeCode("authorization-code");
trakt.setAccessToken(token.access_token);
```

## Device Code Flow

```ts
const code = await trakt.auth.deviceCode();

console.log(`Open ${code.verification_url} and enter ${code.user_code}`);

const token = await trakt.auth.deviceToken(code.device_code);
trakt.setAccessToken(token.access_token);
```

## Examples

### Trending Movies

```ts
const trending = await trakt.movies.trending({
	limit: 10,
	extended: "full",
});

for (const item of trending.data) {
	console.log(item.watchers, item.movie.title, item.movie.ids.tmdb);
}
```

### User History

```ts
const history = await trakt.users.history("me", "movies", undefined, {
	limit: 25,
	extended: "full",
});

console.log(history.pagination.pageCount);
```

### Watchlist

```ts
const watchlist = await trakt.sync.watchlist({
	type: "movies",
	sort: "rank",
	extended: "full",
});

await trakt.sync.addWatchlist({
	movies: [{ ids: { tmdb: 438631 } }],
});
```

### Ratings

```ts
const tenStarMovies = await trakt.sync.ratings("movies", 10);

await trakt.sync.addRatings({
	movies: [
		{
			rating: 9,
			ids: { tmdb: 438631 },
		},
	],
});

console.log(tenStarMovies.length);
```

### Scrobble Start And Stop

```ts
await trakt.scrobble.start({
	progress: 1,
	movie: { ids: { tmdb: 438631 } },
});

await trakt.scrobble.stop({
	progress: 95,
	movie: { ids: { tmdb: 438631 } },
});
```

### Search Trakt By TMDB ID

```ts
const [result] = await trakt.search.id("tmdb", 438631, { type: "movie" });

console.log(result.movie?.title);
```

### Low-Level Escape Hatch

Use `trakt.api` when Trakt adds an endpoint before this wrapper exposes a typed
method for it.

```ts
const data = await trakt.api.get<unknown>("/movies/trending", {
	query: { limit: 5, extended: "full" },
});

const page = await trakt.api.paginated<unknown>("/movies/trending", {
	query: { page: 1, limit: 10 },
});
```

More copy-ready examples live in [`docs/examples.md`](docs/examples.md).

## Common App Flows

### Sign In With Trakt

```ts
const url = trakt.auth.getAuthorizationUrl({ state: "session-state" });
// Redirect the user to `url`, then exchange the returned code.
const token = await trakt.auth.exchangeCode("returned-code");
trakt.setAccessToken(token.access_token);
```

### Sync User Watchlist

```ts
const watchlist = await trakt.sync.watchlist({
	type: "movies",
	extended: "full",
});

const tmdbIds = watchlist
	.map((item) => item.movie?.ids.tmdb)
	.filter((id): id is number => typeof id === "number");
```

### Mark Movie Watched

```ts
await trakt.sync.addHistory({
	movies: [{ ids: { tmdb: 438631 } }],
});
```

### Import History

```ts
const importedTmdbIds = [438631, 693134, 872585];

await trakt.sync.addHistory({
	movies: importedTmdbIds.map((tmdb) => ({ ids: { tmdb } })),
});
```

### Scrobble Playback Progress

```ts
await trakt.scrobble.start({
	progress: 5,
	movie: { ids: { tmdb: 438631 } },
});

await trakt.scrobble.stop({
	progress: 90,
	movie: { ids: { tmdb: 438631 } },
});
```

## Included Endpoints

- `auth`: OAuth authorization, token exchange, refresh, device flow, revoke
- `search`: text search and ID lookup
- `movies`: trending, popular, played, watched, collected, anticipated, details,
  comments, lists, people, ratings, related, stats, watching
- `shows`: trending, popular, played, watched, collected, anticipated, details,
  seasons, comments, lists, people, ratings, related, stats, watching
- `seasons` and `episodes`: summaries, comments, lists, people, ratings, stats,
  watching
- `calendars`: all and authenticated show/movie calendars
- `users`: profile, watching, watched, history, ratings, watchlist, collection,
  lists
- `sync`: last activities, playback, watched, history, collection, watchlist,
  ratings
- `scrobble`: start, pause, stop
- `checkin`: create and remove check-ins
- `lists`: trending, popular, summary, items, create, update, delete, add/remove
  items

## Runtime

This package uses the shared `@api-wrappers/api-core` HTTP runtime, so custom
`fetch`, retry configuration, timeouts, transports, and plugins are supported.

```ts
const trakt = new Trakt({
	clientId: "client-id",
	fetch: customFetch,
	retry: { maxAttempts: 3, delayMs: 250 },
	timeoutMs: 10_000,
});
```

## Contributing

Contributions are welcome. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) for
local setup, validation, endpoint guidelines, and pull request expectations.

## Release Process

Maintainers use Changesets. Run `bun run changeset` for user-facing changes,
merge the generated version PR, and let the release workflow publish from `main`
after `bun run verify` passes. The workflow expects an `NPM_TOKEN` repository
secret and requests npm provenance during publish.

## Quality Gates

```bash
bun run verify
```

`verify` runs source typechecking, test typechecking, the unit test suite, and
the production build. `bun run validate` is kept as a compatibility alias.
