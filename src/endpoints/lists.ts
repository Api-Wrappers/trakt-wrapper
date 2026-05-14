import type {
	TraktList,
	TraktListItem,
	TraktListItemType,
	TraktPaginatedResponse,
	TraktPageOptions,
	TraktRequestOptions,
	TraktSort,
	TraktStatusResponse,
	TraktSyncItems,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export interface CreateListBody {
	name: string;
	description?: string;
	privacy?: "private" | "friends" | "public";
	display_numbers?: boolean;
	allow_comments?: boolean;
	sort_by?: string;
	sort_how?: "asc" | "desc";
}

export class ListsEndpoint extends BaseEndpoint {
	trending(
		type = "personal",
		sort: TraktSort = "popular",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath("/lists/trending", type, sort),
			withQuery(options, request),
		);
	}

	popular(
		type = "personal",
		sort: TraktSort = "popular",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath("/lists/popular", type, sort),
			withQuery(options, request),
		);
	}

	summary(listId: string | number, request?: TraktRequestOptions): Promise<TraktList> {
		return this.get<TraktList>(appendPath("/lists", listId), request);
	}

	items(
		listId: string | number,
		type?: TraktListItemType,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktListItem>> {
		return this.api.paginated<TraktListItem>(
			appendPath("/lists", listId, "items", type),
			withQuery(options, request),
		);
	}

	create(body: CreateListBody, request?: TraktRequestOptions): Promise<TraktList> {
		return this.post<TraktList>("/users/me/lists", body, request);
	}

	update(
		listId: string | number,
		body: Partial<CreateListBody>,
		request?: TraktRequestOptions,
	): Promise<TraktList> {
		return this.put<TraktList>(
			appendPath("/users/me/lists", listId),
			body,
			request,
		);
	}

	deleteList(listId: string | number, request?: TraktRequestOptions): Promise<void> {
		return this.delete<void>(appendPath("/users/me/lists", listId), request);
	}

	addItems(
		listId: string | number,
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>(
			appendPath("/users/me/lists", listId, "items"),
			items,
			request,
		);
	}

	removeItems(
		listId: string | number,
		items: TraktSyncItems,
		request?: TraktRequestOptions,
	): Promise<TraktStatusResponse> {
		return this.post<TraktStatusResponse>(
			appendPath("/users/me/lists", listId, "items", "remove"),
			items,
			request,
		);
	}
}
