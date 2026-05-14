import type { TraktApiClient } from "../client";
import type { TraktRequestOptions } from "../types";

export class BaseEndpoint {
	constructor(protected readonly api: TraktApiClient) {}

	protected get<T>(path: string, options?: TraktRequestOptions): Promise<T> {
		return this.api.get<T>(path, options);
	}

	protected post<T>(
		path: string,
		body?: unknown,
		options?: TraktRequestOptions,
	): Promise<T> {
		return this.api.post<T>(path, body, options);
	}

	protected put<T>(
		path: string,
		body?: unknown,
		options?: TraktRequestOptions,
	): Promise<T> {
		return this.api.put<T>(path, body, options);
	}

	protected delete<T>(
		path: string,
		options?: TraktRequestOptions,
	): Promise<T> {
		return this.api.delete<T>(path, options);
	}
}
