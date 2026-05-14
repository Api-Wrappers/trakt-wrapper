import type {
	TraktComment,
	TraktExtended,
	TraktId,
	TraktList,
	TraktPaginatedResponse,
	TraktAlias,
	TraktPageOptions,
	TraktPeople,
	TraktPeriod,
	TraktRatings,
	TraktRequestOptions,
	TraktSeason,
	TraktShow,
	TraktStats,
	TraktSort,
	TraktTranslation,
	TraktTrendingShow,
	TraktUser,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

const SHOWS = "/shows";

export class ShowsEndpoint extends BaseEndpoint {
	trending(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktTrendingShow>> {
		return this.api.paginated<TraktTrendingShow>(
			`${SHOWS}/trending`,
			withQuery(options, request),
		);
	}

	popular(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			`${SHOWS}/popular`,
			withQuery(options, request),
		);
	}

	played(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			appendPath(`${SHOWS}/played`, period),
			withQuery(options, request),
		);
	}

	watched(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			appendPath(`${SHOWS}/watched`, period),
			withQuery(options, request),
		);
	}

	collected(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			appendPath(`${SHOWS}/collected`, period),
			withQuery(options, request),
		);
	}

	anticipated(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			`${SHOWS}/anticipated`,
			withQuery(options, request),
		);
	}

	updates(
		startDate: string,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			appendPath(`${SHOWS}/updates`, startDate),
			withQuery(options, request),
		);
	}

	summary(
		id: TraktId,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktShow> {
		return this.get<TraktShow>(
			appendPath(SHOWS, id),
			withQuery({ extended }, request),
		);
	}

	aliases(id: TraktId, request?: TraktRequestOptions): Promise<TraktAlias[]> {
		return this.get<TraktAlias[]>(appendPath(SHOWS, id, "aliases"), request);
	}

	translations(
		id: TraktId,
		language?: string,
		request?: TraktRequestOptions,
	): Promise<TraktTranslation[]> {
		return this.get<TraktTranslation[]>(
			appendPath(SHOWS, id, "translations", language),
			request,
		);
	}

	comments(
		id: TraktId,
		sort: TraktSort = "newest",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktComment>> {
		return this.api.paginated<TraktComment>(
			appendPath(SHOWS, id, "comments", sort),
			withQuery(options, request),
		);
	}

	lists(
		id: TraktId,
		type = "personal",
		sort: TraktSort = "popular",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath(SHOWS, id, "lists", type, sort),
			withQuery(options, request),
		);
	}

	people(
		id: TraktId,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktPeople> {
		return this.get<TraktPeople>(
			appendPath(SHOWS, id, "people"),
			withQuery({ extended }, request),
		);
	}

	ratings(id: TraktId, request?: TraktRequestOptions): Promise<TraktRatings> {
		return this.get<TraktRatings>(appendPath(SHOWS, id, "ratings"), request);
	}

	related(
		id: TraktId,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktShow>> {
		return this.api.paginated<TraktShow>(
			appendPath(SHOWS, id, "related"),
			withQuery(options, request),
		);
	}

	stats(id: TraktId, request?: TraktRequestOptions): Promise<TraktStats> {
		return this.get<TraktStats>(appendPath(SHOWS, id, "stats"), request);
	}

	watching(id: TraktId, request?: TraktRequestOptions): Promise<TraktUser[]> {
		return this.get<TraktUser[]>(appendPath(SHOWS, id, "watching"), request);
	}

	seasons(
		id: TraktId,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktSeason[]> {
		return this.get<TraktSeason[]>(
			appendPath(SHOWS, id, "seasons"),
			withQuery({ extended }, request),
		);
	}
}
