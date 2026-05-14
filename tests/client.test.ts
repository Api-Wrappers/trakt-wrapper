import { describe, expect, it } from "bun:test";
import { ApiError } from "@api-wrappers/api-core";
import { Trakt, TraktApiClient } from "../src";

const json = (body: unknown, init?: ResponseInit) =>
	new Response(JSON.stringify(body), {
		...init,
		headers: {
			"content-type": "application/json",
			...init?.headers,
		},
	});

describe("TraktApiClient", () => {
	it("adds Trakt headers and bearer auth", async () => {
		let requestUrl = "";
		let requestHeaders = new Headers();

		const fetchMock = (async (input, init) => {
			requestUrl = String(input);
			requestHeaders = new Headers(init?.headers);
			return json({ title: "Inception", ids: { trakt: 1 } });
		}) as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			accessToken: "access-token",
			fetch: fetchMock,
		});

		await trakt.movies.summary("inception-2010", "full");
		await trakt.dispose();

		const url = new URL(requestUrl);
		expect(url.pathname).toBe("/movies/inception-2010");
		expect(url.searchParams.get("extended")).toBe("full");
		expect(requestHeaders.get("accept")).toBe("application/json");
		expect(requestHeaders.get("trakt-api-version")).toBe("2");
		expect(requestHeaders.get("trakt-api-key")).toBe("client-id");
		expect(requestHeaders.get("authorization")).toBe("Bearer access-token");
	});

	it("extracts Trakt pagination headers", async () => {
		const fetchMock = (async () =>
			json([{ watchers: 10, movie: { title: "Inception", ids: { trakt: 1 } } }], {
				headers: {
					"x-pagination-page": "2",
					"x-pagination-limit": "10",
					"x-pagination-page-count": "5",
					"x-pagination-item-count": "42",
				},
			})) as unknown as typeof fetch;

		const client = new TraktApiClient({
			clientId: "client-id",
			fetch: fetchMock,
		});

		const result = await client.paginated("/movies/trending", {
			query: { page: 2, limit: 10 },
		});
		await client.dispose();

		expect(result.data).toHaveLength(1);
		expect(result.pagination).toEqual({
			page: 2,
			limit: 10,
			pageCount: 5,
			itemCount: 42,
		});
	});

	it("merges endpoint query options with low-level request query", async () => {
		let requestUrl = "";

		const fetchMock = (async (input: Parameters<typeof fetch>[0]) => {
			requestUrl = String(input);
			return json([]);
		}) as unknown as typeof fetch;

		const trakt = new Trakt({
			clientId: "client-id",
			fetch: fetchMock,
		});

		await trakt.movies.trending(
			{ limit: 5, extended: "full" },
			{ query: { genres: "action" } },
		);
		await trakt.dispose();

		const url = new URL(requestUrl);
		expect(url.pathname).toBe("/movies/trending");
		expect(url.searchParams.get("genres")).toBe("action");
		expect(url.searchParams.get("limit")).toBe("5");
		expect(url.searchParams.get("extended")).toBe("full");
	});

	it("throws before fetching without a client ID", async () => {
		let called = false;
		const fetchMock = (async () => {
			called = true;
			return json({ ok: true });
		}) as unknown as typeof fetch;

		const client = new TraktApiClient({ fetch: fetchMock });

		await expect(client.get("/movies/trending")).rejects.toBeInstanceOf(
			ApiError,
		);
		expect(called).toBe(false);
	});
});
