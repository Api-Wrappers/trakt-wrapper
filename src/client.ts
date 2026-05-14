import {
	ApiError,
	type ApiResponse,
	BaseHttpClient,
	type ClientConfig,
	type RequestOptions,
} from "@api-wrappers/api-core";
import type {
	TraktAuth,
	TraktClientOptions,
	TraktPaginatedResponse,
	TraktRequestOptions,
} from "./types";
import { paginationFromHeaders } from "./utils";

const BASE_URL = "https://api.trakt.tv";

interface NormalizedAuth {
	clientId?: string;
	clientSecret?: string;
	redirectUri?: string;
	accessToken?: string;
	client?: TraktClientOptions;
}

export class TraktApiClient extends BaseHttpClient {
	readonly clientId?: string;
	readonly clientSecret?: string;
	readonly redirectUri?: string;
	private accessToken?: string;

	constructor(auth: TraktAuth) {
		const normalized = normalizeAuth(auth);
		const defaultHeaders: Record<string, string> = {
			Accept: "application/json",
			"trakt-api-version": "2",
			...normalized.client?.defaultHeaders,
		};

		if (normalized.clientId) {
			defaultHeaders["trakt-api-key"] = normalized.clientId;
		}

		const clientConfig: ClientConfig = {
			...normalized.client,
			baseUrl: normalized.client?.baseUrl ?? BASE_URL,
			defaultHeaders,
			fetch: normalized.client?.fetch,
			retry: normalized.client?.retry ?? {
				maxAttempts: 3,
				delayMs: 300,
				jitter: false,
				retriableStatusCodes: [429, 502, 503, 504],
			},
		};

		super(clientConfig);

		this.clientId = normalized.clientId;
		this.clientSecret = normalized.clientSecret;
		this.redirectUri = normalized.redirectUri;
		this.accessToken = normalized.accessToken;
	}

	setAccessToken(accessToken: string | undefined): void {
		this.accessToken = accessToken;
	}

	requireClientId(): string {
		if (!this.clientId) throw new ApiError("No Trakt client ID provided", 0);
		return this.clientId;
	}

	requireClientSecret(): string {
		if (!this.clientSecret) {
			throw new ApiError("No Trakt client secret provided", 0);
		}
		return this.clientSecret;
	}

	override requestWithResponse<T = unknown>(
		path: string,
		options: TraktRequestOptions & { method?: RequestOptions["method"] } = {},
	): Promise<ApiResponse<T>> {
		this.requireClientId();

		const headers = {
			...(this.accessToken
				? { Authorization: `Bearer ${this.accessToken}` }
				: undefined),
			...options.headers,
		};

		return super.requestWithResponse<T>(path, {
			...options,
			headers,
		});
	}

	async paginated<T = unknown>(
		path: string,
		options: TraktRequestOptions = {},
	): Promise<TraktPaginatedResponse<T>> {
		const response = await this.requestWithResponse<T[]>(path, {
			...options,
			method: "GET",
		});

		return {
			...response,
			pagination: paginationFromHeaders(response.response.headers),
		};
	}
}

function normalizeAuth(auth: TraktAuth): NormalizedAuth {
	if (typeof auth === "string") {
		return { clientId: auth || undefined };
	}

	return {
		clientId: auth.clientId,
		clientSecret: auth.clientSecret,
		redirectUri: auth.redirectUri,
		accessToken: auth.accessToken,
		client: auth,
	};
}

export type { TraktRequestOptions };
