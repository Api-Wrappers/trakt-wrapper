# Examples

These examples use methods exported by the current wrapper source. They focus on
the Trakt jobs most media apps need: sign in, sync, watchlists, history, ratings,
scrobbling, and low-level access for new Trakt endpoints.

## Create A Client

```ts
import { Trakt } from "@api-wrappers/trakt-wrapper";

const trakt = new Trakt({
	clientId: process.env.TRAKT_CLIENT_ID,
	clientSecret: process.env.TRAKT_CLIENT_SECRET,
	redirectUri: "urn:ietf:wg:oauth:2.0:oob",
	accessToken: process.env.TRAKT_ACCESS_TOKEN,
});
```

## OAuth Authorization URL

```ts
const authorizeUrl = trakt.auth.getAuthorizationUrl({
	state: "user-session-state",
});

console.log(authorizeUrl);

const token = await trakt.auth.exchangeCode("authorization-code");
trakt.setAccessToken(token.access_token);
```

## Device Code Flow

```ts
const code = await trakt.auth.deviceCode();

console.log(code.verification_url);
console.log(code.user_code);

const token = await trakt.auth.deviceToken(code.device_code);
trakt.setAccessToken(token.access_token);
```

## Trending Movies

```ts
const trending = await trakt.movies.trending({
	page: 1,
	limit: 10,
	extended: "full",
});

for (const item of trending.data) {
	console.log(item.watchers, item.movie.title, item.movie.year);
}
```

## User History

```ts
const history = await trakt.users.history("me", "movies", undefined, {
	page: 1,
	limit: 25,
	extended: "full",
});

for (const item of history.data) {
	console.log(item.watched_at, item.movie?.title);
}
```

## Sync History

```ts
const history = await trakt.sync.history("movies", undefined, {
	limit: 25,
});

console.log(history.pagination.itemCount);
```

## Watchlist

```ts
const watchlist = await trakt.sync.watchlist({
	type: "movies",
	sort: "rank",
	extended: "full",
});

await trakt.sync.addWatchlist({
	movies: [{ ids: { tmdb: 438631 } }],
});

await trakt.sync.removeWatchlist({
	movies: [{ ids: { tmdb: 438631 } }],
});

console.log(watchlist.length);
```

## Ratings

```ts
const ratings = await trakt.sync.ratings("movies");

await trakt.sync.addRatings({
	movies: [
		{
			rating: 8,
			ids: { tmdb: 438631 },
		},
	],
});

await trakt.sync.removeRatings({
	movies: [{ ids: { tmdb: 438631 } }],
});

console.log(ratings.length);
```

## Mark A Movie Watched

```ts
await trakt.sync.addHistory({
	movies: [{ ids: { tmdb: 438631 } }],
});
```

## Import A Simple Watch History

```ts
const importedTmdbIds = [438631, 693134, 872585];

await trakt.sync.addHistory({
	movies: importedTmdbIds.map((tmdb) => ({ ids: { tmdb } })),
});
```

## Scrobble Playback

```ts
await trakt.scrobble.start({
	progress: 3,
	movie: { ids: { tmdb: 438631 } },
});

await trakt.scrobble.pause({
	progress: 45,
	movie: { ids: { tmdb: 438631 } },
});

await trakt.scrobble.stop({
	progress: 90,
	movie: { ids: { tmdb: 438631 } },
});
```

## Calendars

```ts
const calendar = await trakt.calendars.myMovies({
	startDate: "2026-05-16",
	days: 7,
	extended: "full",
});

for (const item of calendar) {
	console.log(item.released, item.movie.title);
}
```

## Search By TMDB ID

```ts
const [match] = await trakt.search.id("tmdb", 438631, {
	type: "movie",
	extended: "full",
});

console.log(match.movie?.title);
```

## Low-Level Escape Hatch

```ts
const rawTrending = await trakt.api.get<unknown>("/movies/trending", {
	query: { limit: 5, extended: "full" },
});

const paginated = await trakt.api.paginated<unknown>("/movies/trending", {
	query: { page: 1, limit: 10 },
});

console.log(rawTrending);
console.log(paginated.pagination);
```
