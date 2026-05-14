import { describe, expect, it } from "bun:test";
import { Trakt } from "../src";

const json = (body: unknown, init?: ResponseInit) =>
	new Response(JSON.stringify(body), {
		...init,
		headers: {
			"content-type": "application/json",
			...init?.headers,
		},
	});

describe("Trakt endpoints", () => {
	it("builds OAuth URLs and exchanges authorization codes", async () => {
		let requestUrl = "";
		let requestBody = "";

		const fetchMock = (async (input, init) => {
			requestUrl = String(input);
			requestBody = String(init?.body);
			return json({
				access_token: "new-token",
				token_type: "bearer",
				expires_in: 7776000,
				refresh_token: "refresh",
				scope: "public",
				created_at: 123,
			});
		}) as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			clientSecret: "client-secret",
			redirectUri: "urn:ietf:wg:oauth:2.0:oob",
			fetch: fetchMock,
		});

		const url = new URL(trakt.auth.getAuthorizationUrl({ state: "abc" }));
		expect(url.origin).toBe("https://trakt.tv");
		expect(url.pathname).toBe("/oauth/authorize");
		expect(url.searchParams.get("client_id")).toBe("client-id");
		expect(url.searchParams.get("state")).toBe("abc");

		const token = await trakt.auth.exchangeCode("code-123");
		await trakt.dispose();

		expect(requestUrl).toBe("https://api.trakt.tv/oauth/token");
		expect(JSON.parse(requestBody)).toEqual({
			code: "code-123",
			client_id: "client-id",
			client_secret: "client-secret",
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
			grant_type: "authorization_code",
		});
		expect(token.access_token).toBe("new-token");
	});

	it("routes search, sync, and scrobble requests", async () => {
		const calls: Array<{ url: string; method?: string; body?: string }> = [];

		const fetchMock = (async (input, init) => {
			calls.push({
				url: String(input),
				method: init?.method,
				body: init?.body ? String(init.body) : undefined,
			});
			return json([]);
		}) as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			accessToken: "access-token",
			fetch: fetchMock,
		});

		await trakt.search.text(["movie", "show"], "dune", {
			page: 1,
			limit: 5,
			fields: ["title"],
		});
		await trakt.sync.addWatchlist({
			movies: [{ ids: { tmdb: 438631 } }],
		});
		await trakt.scrobble.stop({
			progress: 90,
			movie: { ids: { tmdb: 438631 } },
		});
		await trakt.dispose();

		expect(calls[0].url).toBe(
			"https://api.trakt.tv/search/movie,show?query=dune&fields=title&page=1&limit=5",
		);
		expect(calls[1]).toEqual({
			url: "https://api.trakt.tv/sync/watchlist",
			method: "POST",
			body: JSON.stringify({ movies: [{ ids: { tmdb: 438631 } }] }),
		});
		expect(calls[2]).toEqual({
			url: "https://api.trakt.tv/scrobble/stop",
			method: "POST",
			body: JSON.stringify({
				progress: 90,
				movie: { ids: { tmdb: 438631 } },
			}),
		});
	});

	it("uses valid watchlist paths and keeps path params out of query strings", async () => {
		const calls: string[] = [];

		const fetchMock = (async (input) => {
			calls.push(String(input));
			return json([]);
		}) as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			accessToken: "access-token",
			fetch: fetchMock,
		});

		await trakt.sync.watchlist({ type: "movies", extended: "full" });
		await trakt.users.watchlist("me", {
			type: "shows",
			sort: "added",
			limit: 20,
			extended: "full",
		});
		await trakt.dispose();

		expect(calls[0]).toBe(
			"https://api.trakt.tv/sync/watchlist/movies/rank?extended=full",
		);
		expect(calls[1]).toBe(
			"https://api.trakt.tv/users/me/watchlist/shows/added?extended=full&limit=20",
		);
	});

	it("returns pagination metadata for sync history", async () => {
		const fetchMock = (async () =>
			json([], {
				headers: {
					"x-pagination-page": "1",
					"x-pagination-limit": "25",
					"x-pagination-page-count": "4",
					"x-pagination-item-count": "100",
				},
			})) as unknown as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			accessToken: "access-token",
			fetch: fetchMock,
		});

		const history = await trakt.sync.history("movies", undefined, {
			limit: 25,
		});
		await trakt.dispose();

		expect(history.pagination).toEqual({
			page: 1,
			limit: 25,
			pageCount: 4,
			itemCount: 100,
		});
	});
});
