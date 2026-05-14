<h1 align="center">@api-wrappers/trakt-wrapper</h1>

<p align="center">
  Modern TypeScript client for the <a href="https://trakt.docs.apiary.io/">Trakt API</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@api-wrappers/trakt-wrapper"><img alt="npm version" src="https://img.shields.io/npm/v/@api-wrappers/trakt-wrapper"></a>
  <a href="https://github.com/Api-Wrappers/trakt-wrapper/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/@api-wrappers/trakt-wrapper"></a>
  <a href="https://github.com/Api-Wrappers/trakt-wrapper/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/api-wrappers/trakt-wrapper"></a>
</p>

It is designed to pair well with `@api-wrappers/tmdb-wrapper`: TMDb covers rich
movie and TV metadata, while Trakt covers watch history, watchlists, ratings,
lists, calendars, scrobbling, and user sync.

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

## OAuth

```ts
const trakt = new Trakt({
	clientId: process.env.TRAKT_CLIENT_ID,
	clientSecret: process.env.TRAKT_CLIENT_SECRET,
	redirectUri: "urn:ietf:wg:oauth:2.0:oob",
});

const authorizeUrl = trakt.auth.getAuthorizationUrl({ state: "state-token" });
console.log(authorizeUrl);

const token = await trakt.auth.exchangeCode("authorization-code");
trakt.setAccessToken(token.access_token);
```

Device code flow is also available:

```ts
const code = await trakt.auth.deviceCode();
console.log(code.verification_url, code.user_code);

const token = await trakt.auth.deviceToken(code.device_code);
```

## Examples

Search Trakt by TMDb ID:

```ts
const [result] = await trakt.search.id("tmdb", 438631, { type: "movie" });
console.log(result.movie?.title);
```

Add a TMDb movie to the authenticated user's watchlist:

```ts
await trakt.sync.addWatchlist({
	movies: [{ ids: { tmdb: 438631 } }],
});
```

Scrobble a movie:

```ts
await trakt.scrobble.stop({
	progress: 90,
	movie: { ids: { tmdb: 438631 } },
});
```

Fetch a user's history:

```ts
const history = await trakt.users.history("me", "movies", undefined, {
	limit: 25,
});

console.log(history.pagination.pageCount);
```

Fetch the authenticated user's movie watchlist:

```ts
const watchlist = await trakt.sync.watchlist({
	type: "movies",
	sort: "rank",
	extended: "full",
});
```

Fetch another user's show watchlist with pagination:

```ts
const watchlist = await trakt.users.watchlist("sean", {
	type: "shows",
	sort: "added",
	limit: 20,
});
```

## Included Endpoints

- `auth`: OAuth authorization, token exchange, refresh, device flow, revoke
- `search`: text search and ID lookup
- `movies`: trending, popular, played, watched, collected, anticipated, details, comments, lists, people, ratings, related, stats, watching
- `shows`: trending, popular, played, watched, collected, anticipated, details, seasons, comments, lists, people, ratings, related, stats, watching
- `seasons` and `episodes`: summaries, comments, lists, people, ratings, stats, watching
- `calendars`: all and authenticated show/movie calendars
- `users`: profile, watching, watched, history, ratings, watchlist, collection, lists
- `sync`: last activities, playback, watched, history, collection, watchlist, ratings
- `scrobble`: start, pause, stop
- `checkin`: create and remove check-ins
- `lists`: trending, popular, summary, items, create, update, delete, add/remove items

## Low-Level Requests

Use `trakt.api` when Trakt adds a new endpoint before the wrapper has a typed
method for it.

```ts
const data = await trakt.api.get("/movies/trending", {
	query: { limit: 5, extended: "full" },
});

const page = await trakt.api.paginated("/movies/trending", {
	query: { page: 1, limit: 10 },
});
```

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

## Quality Gates

```bash
bun run validate
```

`validate` runs source typechecking, test typechecking, the unit test suite, and
the production build.
