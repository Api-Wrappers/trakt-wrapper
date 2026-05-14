import type {
	TraktComment,
	TraktExtended,
	TraktId,
	TraktList,
	TraktPaginatedResponse,
	TraktPageOptions,
	TraktPeople,
	TraktRatings,
	TraktRequestOptions,
	TraktSeason,
	TraktStats,
	TraktSort,
	TraktUser,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export class SeasonsEndpoint extends BaseEndpoint {
	summary(
		showId: TraktId,
		season: number,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktSeason> {
		return this.get<TraktSeason>(
			appendPath("/shows", showId, "seasons", season),
			withQuery({ extended }, request),
		);
	}

	comments(
		showId: TraktId,
		season: number,
		sort: TraktSort = "newest",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktComment>> {
		return this.api.paginated<TraktComment>(
			appendPath("/shows", showId, "seasons", season, "comments", sort),
			withQuery(options, request),
		);
	}

	lists(
		showId: TraktId,
		season: number,
		type = "personal",
		sort: TraktSort = "popular",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath("/shows", showId, "seasons", season, "lists", type, sort),
			withQuery(options, request),
		);
	}

	people(
		showId: TraktId,
		season: number,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktPeople> {
		return this.get<TraktPeople>(
			appendPath("/shows", showId, "seasons", season, "people"),
			withQuery({ extended }, request),
		);
	}

	ratings(
		showId: TraktId,
		season: number,
		request?: TraktRequestOptions,
	): Promise<TraktRatings> {
		return this.get<TraktRatings>(
			appendPath("/shows", showId, "seasons", season, "ratings"),
			request,
		);
	}

	stats(
		showId: TraktId,
		season: number,
		request?: TraktRequestOptions,
	): Promise<TraktStats> {
		return this.get<TraktStats>(
			appendPath("/shows", showId, "seasons", season, "stats"),
			request,
		);
	}

	watching(
		showId: TraktId,
		season: number,
		request?: TraktRequestOptions,
	): Promise<TraktUser[]> {
		return this.get<TraktUser[]>(
			appendPath("/shows", showId, "seasons", season, "watching"),
			request,
		);
	}
}
