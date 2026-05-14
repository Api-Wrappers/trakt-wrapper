import type {
	TraktHistoryItem,
	TraktHistoryType,
	TraktCollectionItem,
	TraktListItem,
	TraktListItemType,
	TraktList,
	TraktPaginatedResponse,
	TraktPageOptions,
	TraktRatingItem,
	TraktRatingType,
	TraktRequestOptions,
	TraktSyncMediaType,
	TraktUser,
	TraktUserWatchlistOptions,
	TraktWatchedMovie,
	TraktWatchedShow,
	TraktWatching,
	TraktWatchlistItem,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

const USERS = "/users";

export class UsersEndpoint extends BaseEndpoint {
	profile(username: string, request?: TraktRequestOptions): Promise<TraktUser> {
		return this.get<TraktUser>(appendPath(USERS, username), request);
	}

	watching(username: string, request?: TraktRequestOptions): Promise<TraktWatching> {
		return this.get<TraktWatching>(
			appendPath(USERS, username, "watching"),
			request,
		);
	}

	watched(
		username: string,
		type: "movies" | "shows",
		extended?: string,
		request?: TraktRequestOptions,
	): Promise<Array<TraktWatchedMovie | TraktWatchedShow>> {
		return this.get<Array<TraktWatchedMovie | TraktWatchedShow>>(
			appendPath(USERS, username, "watched", type),
			withQuery({ extended }, request),
		);
	}

	history(
		username: string,
		type?: TraktHistoryType,
		id?: string | number,
		options: TraktPageOptions & { startAt?: string; endAt?: string } = {},
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktHistoryItem>> {
		return this.api.paginated<TraktHistoryItem>(
			appendPath(USERS, username, "history", type, id),
			withQuery(
				{
					start_at: options.startAt,
					end_at: options.endAt,
					page: options.page,
					limit: options.limit,
					extended: options.extended,
				},
				request,
			),
		);
	}

	ratings(
		username: string,
		type?: TraktRatingType,
		rating?: number,
		request?: TraktRequestOptions,
	): Promise<TraktRatingItem[]> {
		return this.get<TraktRatingItem[]>(
			appendPath(USERS, username, "ratings", type, rating),
			request,
		);
	}

	watchlist(
		username: string,
		options: TraktUserWatchlistOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktWatchlistItem>> {
		return this.api.paginated<TraktWatchlistItem>(
			appendPath(
				USERS,
				username,
				"watchlist",
				options.type,
				options.sort ?? "rank",
			),
			withQuery(
				{
					extended: options.extended,
					page: options.page,
					limit: options.limit,
				},
				request,
			),
		);
	}

	collection(
		username: string,
		type: TraktSyncMediaType,
		extended?: string,
		request?: TraktRequestOptions,
	): Promise<TraktCollectionItem[]> {
		return this.get<TraktCollectionItem[]>(
			appendPath(USERS, username, "collection", type),
			withQuery({ extended }, request),
		);
	}

	lists(
		username: string,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath(USERS, username, "lists"),
			withQuery(options, request),
		);
	}

	listItems(
		username: string,
		listId: string | number,
		type?: TraktListItemType,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktListItem>> {
		return this.api.paginated<TraktListItem>(
			appendPath(USERS, username, "lists", listId, "items", type),
			withQuery(options, request),
		);
	}
}
