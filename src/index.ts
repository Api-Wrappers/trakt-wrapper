import { TraktApiClient } from "./client";
import {
	AuthEndpoint,
	CalendarsEndpoint,
	CheckinEndpoint,
	EpisodesEndpoint,
	ListsEndpoint,
	MoviesEndpoint,
	ScrobbleEndpoint,
	SearchEndpoint,
	SeasonsEndpoint,
	ShowsEndpoint,
	SyncEndpoint,
	UsersEndpoint,
} from "./endpoints";
import type { TraktAuth } from "./types";

export class Trakt {
	readonly api: TraktApiClient;
	readonly auth: AuthEndpoint;
	readonly calendars: CalendarsEndpoint;
	readonly checkin: CheckinEndpoint;
	readonly episodes: EpisodesEndpoint;
	readonly lists: ListsEndpoint;
	readonly movies: MoviesEndpoint;
	readonly scrobble: ScrobbleEndpoint;
	readonly search: SearchEndpoint;
	readonly seasons: SeasonsEndpoint;
	readonly shows: ShowsEndpoint;
	readonly sync: SyncEndpoint;
	readonly users: UsersEndpoint;

	constructor(auth: TraktAuth) {
		this.api = new TraktApiClient(auth);
		this.auth = new AuthEndpoint(this.api);
		this.calendars = new CalendarsEndpoint(this.api);
		this.checkin = new CheckinEndpoint(this.api);
		this.episodes = new EpisodesEndpoint(this.api);
		this.lists = new ListsEndpoint(this.api);
		this.movies = new MoviesEndpoint(this.api);
		this.scrobble = new ScrobbleEndpoint(this.api);
		this.search = new SearchEndpoint(this.api);
		this.seasons = new SeasonsEndpoint(this.api);
		this.shows = new ShowsEndpoint(this.api);
		this.sync = new SyncEndpoint(this.api);
		this.users = new UsersEndpoint(this.api);
	}

	setAccessToken(accessToken: string | undefined): void {
		this.api.setAccessToken(accessToken);
	}

	dispose(): Promise<void> {
		return this.api.dispose();
	}
}

export { TraktApiClient } from "./client";
export * from "./endpoints";
export * from "./types";
export { compactQuery, csv, paginationFromHeaders, withQuery } from "./utils";
