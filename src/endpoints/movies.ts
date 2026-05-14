import type {
	TraktComment,
	TraktExtended,
	TraktId,
	TraktList,
	TraktMovie,
	TraktAlias,
	TraktPaginatedResponse,
	TraktPageOptions,
	TraktPeople,
	TraktPeriod,
	TraktRatings,
	TraktRequestOptions,
	TraktStats,
	TraktSort,
	TraktTranslation,
	TraktTrendingMovie,
	TraktUser,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

const MOVIES = "/movies";

export class MoviesEndpoint extends BaseEndpoint {
	trending(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktTrendingMovie>> {
		return this.api.paginated<TraktTrendingMovie>(
			`${MOVIES}/trending`,
			withQuery(options, request),
		);
	}

	popular(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			`${MOVIES}/popular`,
			withQuery(options, request),
		);
	}

	played(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			appendPath(`${MOVIES}/played`, period),
			withQuery(options, request),
		);
	}

	watched(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			appendPath(`${MOVIES}/watched`, period),
			withQuery(options, request),
		);
	}

	collected(
		period: TraktPeriod = "weekly",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			appendPath(`${MOVIES}/collected`, period),
			withQuery(options, request),
		);
	}

	anticipated(
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			`${MOVIES}/anticipated`,
			withQuery(options, request),
		);
	}

	boxOffice(options?: TraktRequestOptions): Promise<Array<{ movie: TraktMovie }>> {
		return this.get<Array<{ movie: TraktMovie }>>(`${MOVIES}/boxoffice`, options);
	}

	updates(
		startDate: string,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			appendPath(`${MOVIES}/updates`, startDate),
			withQuery(options, request),
		);
	}

	summary(
		id: TraktId,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktMovie> {
		return this.get<TraktMovie>(
			appendPath(MOVIES, id),
			withQuery({ extended }, request),
		);
	}

	aliases(id: TraktId, request?: TraktRequestOptions): Promise<TraktAlias[]> {
		return this.get<TraktAlias[]>(appendPath(MOVIES, id, "aliases"), request);
	}

	translations(
		id: TraktId,
		language?: string,
		request?: TraktRequestOptions,
	): Promise<TraktTranslation[]> {
		return this.get<TraktTranslation[]>(
			appendPath(MOVIES, id, "translations", language),
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
			appendPath(MOVIES, id, "comments", sort),
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
			appendPath(MOVIES, id, "lists", type, sort),
			withQuery(options, request),
		);
	}

	people(
		id: TraktId,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktPeople> {
		return this.get<TraktPeople>(
			appendPath(MOVIES, id, "people"),
			withQuery({ extended }, request),
		);
	}

	ratings(id: TraktId, request?: TraktRequestOptions): Promise<TraktRatings> {
		return this.get<TraktRatings>(appendPath(MOVIES, id, "ratings"), request);
	}

	related(
		id: TraktId,
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktMovie>> {
		return this.api.paginated<TraktMovie>(
			appendPath(MOVIES, id, "related"),
			withQuery(options, request),
		);
	}

	stats(id: TraktId, request?: TraktRequestOptions): Promise<TraktStats> {
		return this.get<TraktStats>(appendPath(MOVIES, id, "stats"), request);
	}

	watching(id: TraktId, request?: TraktRequestOptions): Promise<TraktUser[]> {
		return this.get<TraktUser[]>(appendPath(MOVIES, id, "watching"), request);
	}
}
