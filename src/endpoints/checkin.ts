import type {
	TraktCheckinBody,
	TraktCheckinResponse,
	TraktRequestOptions,
} from "../types";
import { BaseEndpoint } from "./BaseEndpoint";

export class CheckinEndpoint extends BaseEndpoint {
	create(
		body: TraktCheckinBody,
		options?: TraktRequestOptions,
	): Promise<TraktCheckinResponse> {
		return this.post<TraktCheckinResponse>("/checkin", body, options);
	}

	remove(options?: TraktRequestOptions): Promise<void> {
		return super.delete<void>("/checkin", options);
	}
}
