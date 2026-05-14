import type {
	TraktDeviceCode,
	TraktOAuthToken,
	TraktRequestOptions,
} from "../types";
import { BaseEndpoint } from "./BaseEndpoint";

export interface TraktAuthorizationUrlOptions {
	redirectUri?: string;
	responseType?: "code";
	state?: string;
	scope?: string;
}

export class AuthEndpoint extends BaseEndpoint {
	getAuthorizationUrl(options: TraktAuthorizationUrlOptions = {}): string {
		const url = new URL("https://trakt.tv/oauth/authorize");
		url.searchParams.set("response_type", options.responseType ?? "code");
		url.searchParams.set("client_id", this.api.requireClientId());

		const redirectUri = options.redirectUri ?? this.api.redirectUri;
		if (redirectUri) url.searchParams.set("redirect_uri", redirectUri);
		if (options.state) url.searchParams.set("state", options.state);
		if (options.scope) url.searchParams.set("scope", options.scope);

		return url.toString();
	}

	deviceCode(options?: TraktRequestOptions): Promise<TraktDeviceCode> {
		return this.post<TraktDeviceCode>(
			"/oauth/device/code",
			{ client_id: this.api.requireClientId() },
			options,
		);
	}

	deviceToken(
		deviceCode: string,
		options?: TraktRequestOptions,
	): Promise<TraktOAuthToken> {
		return this.post<TraktOAuthToken>(
			"/oauth/device/token",
			{
				code: deviceCode,
				client_id: this.api.requireClientId(),
				client_secret: this.api.requireClientSecret(),
			},
			options,
		);
	}

	exchangeCode(
		code: string,
		options?: { redirectUri?: string; request?: TraktRequestOptions },
	): Promise<TraktOAuthToken> {
		return this.post<TraktOAuthToken>(
			"/oauth/token",
			{
				code,
				client_id: this.api.requireClientId(),
				client_secret: this.api.requireClientSecret(),
				redirect_uri: options?.redirectUri ?? this.api.redirectUri,
				grant_type: "authorization_code",
			},
			options?.request,
		);
	}

	refreshToken(
		refreshToken: string,
		options?: { redirectUri?: string; request?: TraktRequestOptions },
	): Promise<TraktOAuthToken> {
		return this.post<TraktOAuthToken>(
			"/oauth/token",
			{
				refresh_token: refreshToken,
				client_id: this.api.requireClientId(),
				client_secret: this.api.requireClientSecret(),
				redirect_uri: options?.redirectUri ?? this.api.redirectUri,
				grant_type: "refresh_token",
			},
			options?.request,
		);
	}

	revokeToken(token: string, options?: TraktRequestOptions): Promise<void> {
		return this.post<void>(
			"/oauth/revoke",
			{
				token,
				client_id: this.api.requireClientId(),
				client_secret: this.api.requireClientSecret(),
			},
			options,
		);
	}
}
