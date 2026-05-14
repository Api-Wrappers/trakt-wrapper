import type {
	TraktId,
	TraktMediaType,
	TraktPaginatedResponse,
	TraktRequestOptions,
	TraktSearchOptions,
	TraktSearchResult,
} from "../types";
import { csv, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export type TraktSearchIdType =
	| "trakt"
	| "imdb"
	| "tmdb"
	| "tvdb";

export class SearchEndpoint extends BaseEndpoint {
	text(
		types: TraktMediaType | TraktMediaType[],
		query: string,
		options: Omit<TraktSearchOptions, "query"> = {},
		request?: TraktRequestOptions,
	): Promise<TraktPaginatedResponse<TraktSearchResult>> {
		return this.api.paginated<TraktSearchResult>(`/search/${csv([types].flat())}`, {
			...withQuery(
				{
					query,
					fields: csv([options.fields].flat()),
					years: csv([options.years].flat()),
					page: options.page,
					limit: options.limit,
					extended: options.extended,
				},
				request,
			),
		});
	}

	id(
		idType: TraktSearchIdType,
		id: TraktId,
		options: {
			type?: TraktMediaType | TraktMediaType[];
			extended?: TraktSearchOptions["extended"];
		} = {},
		request?: TraktRequestOptions,
	): Promise<TraktSearchResult[]> {
		return this.get<TraktSearchResult[]>(
			`/search/${idType}/${encodeURIComponent(String(id))}`,
			withQuery(
				{
					type: csv([options.type].flat()),
					extended: options.extended,
				},
				request,
			),
		);
	}
}
