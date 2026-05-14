import type {
	TraktComment,
	TraktEpisode,
	TraktExtended,
	TraktId,
	TraktList,
	TraktPaginatedResponse,
	TraktPageOptions,
	TraktPeople,
	TraktRatings,
	TraktRequestOptions,
	TraktStats,
	TraktSort,
	TraktUser,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export class EpisodesEndpoint extends BaseEndpoint {
	summary(
		showId: TraktId,
		season: number,
		episode: number,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktEpisode> {
		return this.get<TraktEpisode>(
			appendPath("/shows", showId, "seasons", season, "episodes", episode),
			withQuery({ extended }, request),
		);
	}

	comments(
		showId: TraktId,
		season: number,
		episode: number,
		sort: TraktSort = "newest",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktComment>> {
		return this.api.paginated<TraktComment>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"comments",
				sort,
			),
			withQuery(options, request),
		);
	}

	lists(
		showId: TraktId,
		season: number,
		episode: number,
		type = "personal",
		sort: TraktSort = "popular",
		options?: TraktPageOptions,
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktList>> {
		return this.api.paginated<TraktList>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"lists",
				type,
				sort,
			),
			withQuery(options, request),
		);
	}

	people(
		showId: TraktId,
		season: number,
		episode: number,
		extended?: TraktExtended,
		request?: TraktRequestOptions,
	): Promise<TraktPeople> {
		return this.get<TraktPeople>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"people",
			),
			withQuery({ extended }, request),
		);
	}

	ratings(
		showId: TraktId,
		season: number,
		episode: number,
		request?: TraktRequestOptions,
	): Promise<TraktRatings> {
		return this.get<TraktRatings>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"ratings",
			),
			request,
		);
	}

	stats(
		showId: TraktId,
		season: number,
		episode: number,
		request?: TraktRequestOptions,
	): Promise<TraktStats> {
		return this.get<TraktStats>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"stats",
			),
			request,
		);
	}

	watching(
		showId: TraktId,
		season: number,
		episode: number,
		request?: TraktRequestOptions,
	): Promise<TraktUser[]> {
		return this.get<TraktUser[]>(
			appendPath(
				"/shows",
				showId,
				"seasons",
				season,
				"episodes",
				episode,
				"watching",
			),
			request,
		);
	}
}
