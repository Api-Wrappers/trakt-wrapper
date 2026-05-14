import type { QueryParams, QueryPrimitive } from "@api-wrappers/api-core";
import type { TraktPagination, TraktRequestOptions } from "./types";

export type QueryValue =
	| QueryPrimitive
	| ReadonlyArray<QueryPrimitive | null | undefined>
	| null
	| undefined;

export type QueryInput = object;

export const csv = (
	values?: ReadonlyArray<QueryPrimitive | null | undefined> | QueryPrimitive,
): string | undefined => {
	if (values === undefined || values === null) return undefined;
	if (!Array.isArray(values)) return String(values);

	const normalized = values
		.filter(
			(value): value is QueryPrimitive => value !== undefined && value !== null,
		)
		.map(String);

	return normalized.length > 0 ? normalized.join(",") : undefined;
};

export const compactQuery = (query?: QueryInput): QueryParams | undefined => {
	if (!query) return undefined;

	const params: QueryParams = {};
	for (const [key, value] of Object.entries(query as Record<string, QueryValue>)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			const values = value.filter(
				(item): item is QueryPrimitive => item !== undefined && item !== null,
			);
			if (values.length > 0) params[key] = values;
			continue;
		}
		params[key] = value;
	}

	return Object.keys(params).length > 0 ? params : undefined;
};

export const withQuery = (
	query?: QueryInput,
	options?: TraktRequestOptions,
): TraktRequestOptions => {
	const methodQuery = compactQuery(query);
	const mergedQuery = {
		...(options?.query ?? {}),
		...(methodQuery ?? {}),
	};

	return {
		...options,
		query: Object.keys(mergedQuery).length > 0 ? mergedQuery : undefined,
	};
};

export const appendPath = (
	base: string,
	...parts: Array<string | number | undefined>
): string =>
	[base.replace(/\/$/, ""), ...parts.filter((part) => part !== undefined)]
		.map((part, index) =>
			index === 0
				? String(part)
				: encodeURIComponent(String(part).replace(/^\/|\/$/g, "")),
		)
		.join("/");

export const paginationFromHeaders = (headers: Headers): TraktPagination => ({
	page: readNumberHeader(headers, "x-pagination-page"),
	limit: readNumberHeader(headers, "x-pagination-limit"),
	pageCount: readNumberHeader(headers, "x-pagination-page-count"),
	itemCount: readNumberHeader(headers, "x-pagination-item-count"),
});

const readNumberHeader = (
	headers: Headers,
	name: string,
): number | undefined => {
	const raw = headers.get(name);
	if (!raw) return undefined;
	const value = Number(raw);
	return Number.isFinite(value) ? value : undefined;
};
