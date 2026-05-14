import type {
	TraktHistoryItem,
	TraktHistoryType,
	TraktCollectionItem,
	TraktLastActivities,
	TraktPaginatedResponse,
	TraktPlaybackItem,
	TraktRatingItem,
	TraktRatingSyncItems,
	TraktRatingType,
	TraktRequestOptions,
	TraktStatusResponse,
	TraktSyncItems,
	TraktSyncMediaType,
	TraktWatchedMovie,
	TraktWatchedShow,
	TraktWatchlistItem,
	TraktWatchlistOptions,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export class SyncEndpoint extends BaseEndpoint {
	lastActivities(request?: TraktRequestOptions): Promise<TraktLastActivities> {
		return this.get<TraktLastActivities>("/sync/last_activities", request);
	}

	playback(
		type: "movies" | "episodes",
		request?: TraktRequestOptions,
	): Promise<TraktPlaybackItem[]> {
		return this.get<TraktPlaybackItem[]>(
			appendPath("/sync/playback", type),
			request,
		);
	}

	removePlayback(id: number, request?: TraktRequestOptions): Promise<void> {
		return this.delete<void>(appendPath("/sync/playback", id), request);
	}

	watched(
		type: "movies" | "shows",
		extended?: string,
		request?: TraktRequestOptions,
	): Promise<Array<TraktWatchedMovie | TraktWatchedShow>> {
		return this.get<Array<TraktWatchedMovie | TraktWatchedShow>>(
			appendPath("/sync/watched", type),
			withQuery({ extended }, request),
		);
	}

	history(
		type?: TraktHistoryType,
		id?: string | number,
		options: { startAt?: string; endAt?: string; page?: number; limit?: number } = {},
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktHistoryItem>> {
		return this.api.paginated<TraktHistoryItem>(
			appendPath("/sync/history", type, id),
			withQuery(
				{
					start_at: options.startAt,
					end_at: options.endAt,
					page: options.page,
					limit: options.limit,
				},
				request,
			),
		);
	}

	addHistory(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/history", items, request);
	}

	removeHistory(
		items: TraktSyncItems | { ids: number[] },
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/history/remove", items, request);
	}

	collection(
		type: TraktSyncMediaType,
		extended?: string,
		request?: TraktRequestOptions,
	): Promise<TraktCollectionItem[]> {
		return this.get<TraktCollectionItem[]>(
			appendPath("/sync/collection", type),
			withQuery({ extended }, request),
		);
	}

	addCollection(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/collection", items, request);
	}

	removeCollection(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>(
			"/sync/collection/remove",
			items,
			request,
		);
	}

	watchlist(
		options: TraktWatchlistOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktWatchlistItem[]> {
		const path = options.type
			? appendPath("/sync/watchlist", options.type, options.sort ?? "rank")
			: "/sync/watchlist";

		return this.get<TraktWatchlistItem[]>(
			path,
			withQuery({ extended: options.extended }, request),
		);
	}

	addWatchlist(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/watchlist", items, request);
	}

	removeWatchlist(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>(
			"/sync/watchlist/remove",
			items,
			request,
		);
	}

	ratings(
		type?: TraktRatingType,
		rating?: number,
		request?: TraktRequestOptions,
	): Promise<TraktRatingItem[]> {
		return this.get<TraktRatingItem[]>(
			appendPath("/sync/ratings", type, rating),
			request,
		);
	}

	addRatings(
		body: TraktRatingSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/ratings", body, request);
	}

	removeRatings(
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>("/sync/ratings/remove", items, request);
	}
}
