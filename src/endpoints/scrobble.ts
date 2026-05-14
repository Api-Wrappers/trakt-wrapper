import type {
	TraktRequestOptions,
	TraktScrobbleBody,
	TraktScrobbleResponse,
} from "../types";
import { BaseEndpoint } from "./BaseEndpoint";

export class ScrobbleEndpoint extends BaseEndpoint {
	start(
		body: TraktScrobbleBody,
		options?: TraktRequestOptions,
	): Promise<TraktScrobbleResponse> {
		return this.post<TraktScrobbleResponse>("/scrobble/start", body, options);
	}

	pause(
		body: TraktScrobbleBody,
		options?: TraktRequestOptions,
	): Promise<TraktScrobbleResponse> {
		return this.post<TraktScrobbleResponse>("/scrobble/pause", body, options);
	}

	stop(
		body: TraktScrobbleBody,
		options?: TraktRequestOptions,
	): Promise<TraktScrobbleResponse> {
		return this.post<TraktScrobbleResponse>("/scrobble/stop", body, options);
	}
}
