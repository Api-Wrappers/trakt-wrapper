import type {
	ApiResponse,
	ClientConfig,
	QueryParams,
	RequestOptions,
} from "@api-wrappers/api-core";

export type TraktAuth = string | TraktClientOptions;

export interface TraktClientOptions
	extends Omit<ClientConfig, "baseUrl" | "defaultHeaders"> {
	clientId?: string;
	clientSecret?: string;
	redirectUri?: string;
	accessToken?: string;
	baseUrl?: string;
	defaultHeaders?: Record<string, string>;
}

export type TraktRequestOptions = Omit<RequestOptions, "method">;
export type TraktQuery = QueryParams;
export type TraktId = string | number;
export type TraktMediaType =
	| "movie"
	| "show"
	| "season"
	| "episode"
	| "person"
	| "list";
export type TraktSyncMediaType = "movies" | "shows" | "seasons" | "episodes";
export type TraktPeriod =
	| "daily"
	| "weekly"
	| "monthly"
	| "yearly"
	| "all";
export type TraktSort =
	| "popular"
	| "newest"
	| "oldest"
	| "likes"
	| "replies"
	| "highest"
	| "lowest"
	| "plays"
	| "relevance"
	| "rank"
	| "added"
	| "released"
	| "title";
export type TraktExtended = "min" | "full" | "metadata" | "episodes" | string;
export type TraktHistoryType = "movies" | "shows" | "seasons" | "episodes";
export type TraktRatingType =
	| "movies"
	| "shows"
	| "seasons"
	| "episodes"
	| "all";
export type TraktWatchlistSort = "rank" | "added" | "released" | "title";
export type TraktListItemType =
	| "movie"
	| "show"
	| "season"
	| "episode"
	| "person";

export interface TraktPagination {
	page?: number;
	limit?: number;
	pageCount?: number;
	itemCount?: number;
}

export interface TraktPaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: TraktPagination;
}

export interface TraktPageOptions {
	page?: number;
	limit?: number;
	extended?: TraktExtended;
}

export interface TraktIds {
	trakt?: number;
	slug?: string;
	imdb?: string;
	tmdb?: number;
	tvdb?: number;
	tvrage?: number;
}

export interface TraktMovie {
	title: string;
	year?: number;
	ids: TraktIds;
	tagline?: string;
	overview?: string;
	released?: string;
	runtime?: number;
	country?: string;
	trailer?: string;
	homepage?: string;
	status?: string;
	rating?: number;
	votes?: number;
	comment_count?: number;
	updated_at?: string;
	language?: string;
	available_translations?: string[];
	genres?: string[];
	certification?: string;
}

export interface TraktShow {
	title: string;
	year?: number;
	ids: TraktIds;
	overview?: string;
	first_aired?: string;
	airs?: {
		day?: string;
		time?: string;
		timezone?: string;
	};
	runtime?: number;
	certification?: string;
	network?: string;
	country?: string;
	trailer?: string;
	homepage?: string;
	status?: string;
	rating?: number;
	votes?: number;
	comment_count?: number;
	updated_at?: string;
	language?: string;
	available_translations?: string[];
	genres?: string[];
	aired_episodes?: number;
}

export interface TraktSeason {
	number: number;
	ids?: TraktIds;
	rating?: number;
	votes?: number;
	episode_count?: number;
	aired_episodes?: number;
	title?: string;
	overview?: string;
	first_aired?: string;
	updated_at?: string;
	episodes?: TraktEpisode[];
}

export interface TraktEpisode {
	season: number;
	number: number;
	title?: string;
	ids?: TraktIds;
	overview?: string;
	first_aired?: string;
	updated_at?: string;
	rating?: number;
	votes?: number;
	comment_count?: number;
	available_translations?: string[];
	runtime?: number;
}

export interface TraktPerson {
	name: string;
	ids: TraktIds;
	biography?: string;
	birthday?: string;
	death?: string;
	birthplace?: string;
	homepage?: string;
}

export interface TraktAlias {
	title: string;
	country?: string;
}

export interface TraktTranslation {
	title: string;
	overview?: string;
	tagline?: string;
	language?: string;
	country?: string;
}

export interface TraktRatings {
	rating: number;
	votes: number;
	distribution: Record<string, number>;
}

export interface TraktStats {
	watchers: number;
	plays: number;
	collectors: number;
	comments: number;
	lists: number;
	votes: number;
	collected_episodes?: number;
}

export interface TraktCastMember {
	characters: string[];
	person: TraktPerson;
}

export interface TraktCrewMember {
	job: string;
	person: TraktPerson;
}

export interface TraktPeople {
	cast: TraktCastMember[];
	crew: Record<string, TraktCrewMember[]>;
}

export interface TraktComment {
	id: number;
	parent_id?: number;
	created_at: string;
	updated_at?: string;
	comment: string;
	spoiler: boolean;
	review: boolean;
	replies?: number;
	likes?: number;
	user_rating?: number;
	user?: TraktUser;
}

export interface TraktUser {
	username: string;
	private?: boolean;
	name?: string;
	vip?: boolean;
	vip_ep?: boolean;
	ids?: { slug?: string };
	joined_at?: string;
	location?: string;
	about?: string;
	gender?: string;
	age?: number;
	images?: Record<string, unknown>;
	vip_og?: boolean;
}

export interface TraktList {
	name: string;
	description?: string;
	privacy?: "private" | "friends" | "public";
	type?: "personal" | "official" | "watchlist" | "recommendations";
	display_numbers?: boolean;
	allow_comments?: boolean;
	sort_by?: string;
	sort_how?: "asc" | "desc";
	created_at?: string;
	updated_at?: string;
	item_count?: number;
	comment_count?: number;
	likes?: number;
	ids?: {
		trakt?: number;
		slug?: string;
	};
	user?: TraktUser;
}

export interface TraktListItem {
	listed_at: string;
	type: TraktListItemType;
	rank?: number;
	movie?: TraktMovie;
	show?: TraktShow;
	season?: TraktSeason;
	episode?: TraktEpisode;
	person?: TraktPerson;
}

export interface TraktSearchOptions extends TraktPageOptions {
	query?: string;
	fields?: string | string[];
	years?: string | number | Array<string | number>;
}

export interface TraktSearchResult {
	type: TraktMediaType;
	score: number;
	movie?: TraktMovie;
	show?: TraktShow;
	episode?: TraktEpisode;
	person?: TraktPerson;
	list?: TraktList;
}

export interface TraktTrendingMovie {
	watchers: number;
	movie: TraktMovie;
}

export interface TraktTrendingShow {
	watchers: number;
	show: TraktShow;
}

export interface TraktCalendarShow {
	first_aired: string;
	episode: TraktEpisode;
	show: TraktShow;
}

export interface TraktCalendarMovie {
	released: string;
	movie: TraktMovie;
}

export interface TraktOAuthToken {
	access_token: string;
	token_type: "bearer" | string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
}

export interface TraktDeviceCode {
	device_code: string;
	user_code: string;
	verification_url: string;
	expires_in: number;
	interval: number;
}

export interface TraktStatusResponse {
	added?: Record<string, number>;
	existing?: Record<string, number>;
	deleted?: Record<string, number>;
	not_found?: Record<string, unknown[]>;
}

export interface TraktMovieReference {
	title?: string;
	year?: number;
	ids: TraktIds;
}

export interface TraktShowReference {
	title?: string;
	year?: number;
	ids: TraktIds;
}

export interface TraktEpisodeReference {
	season?: number;
	number?: number;
	title?: string;
	ids?: TraktIds;
}

export interface TraktSeasonReference {
	number?: number;
	ids?: TraktIds;
	episodes?: TraktEpisodeReference[];
}

export interface TraktScrobbleBody {
	movie?: TraktMovieReference;
	show?: TraktShowReference;
	episode?: TraktEpisodeReference;
	progress: number;
	app_version?: string;
	app_date?: string;
}

export interface TraktScrobbleResponse extends TraktScrobbleBody {
	action: "start" | "pause" | "scrobble";
	sharing?: Record<string, boolean>;
}

export interface TraktCheckinBody {
	movie?: TraktMovieReference;
	show?: TraktShowReference;
	episode?: TraktEpisodeReference;
	message?: string;
	app_version?: string;
	app_date?: string;
	foursquare_venue_id?: string;
	foursquare_venue_name?: string;
}

export interface TraktCheckinResponse extends TraktCheckinBody {
	id?: number;
	watched_at?: string;
	sharing?: Record<string, boolean>;
}

export interface TraktSyncItems {
	movies?: TraktMovieReference[];
	shows?: Array<TraktShowReference & { seasons?: TraktSeasonReference[] }>;
	episodes?: TraktEpisodeReference[];
	seasons?: TraktSeasonReference[];
}

export interface TraktRatedMovieReference extends TraktMovieReference {
	rating: number;
	rated_at?: string;
}

export interface TraktRatedShowReference extends TraktShowReference {
	rating: number;
	rated_at?: string;
	seasons?: TraktRatedSeasonReference[];
}

export interface TraktRatedSeasonReference extends TraktSeasonReference {
	rating: number;
	rated_at?: string;
	episodes?: TraktRatedEpisodeReference[];
}

export interface TraktRatedEpisodeReference extends TraktEpisodeReference {
	rating: number;
	rated_at?: string;
}

export interface TraktRatingSyncItems {
	movies?: TraktRatedMovieReference[];
	shows?: TraktRatedShowReference[];
	seasons?: TraktRatedSeasonReference[];
	episodes?: TraktRatedEpisodeReference[];
}

export interface TraktPlaybackItem {
	id: number;
	progress: number;
	paused_at: string;
	type: "movie" | "episode";
	movie?: TraktMovie;
	show?: TraktShow;
	episode?: TraktEpisode;
}

export interface TraktWatchlistItem {
	rank: number;
	listed_at: string;
	type: "movie" | "show" | "season" | "episode";
	movie?: TraktMovie;
	show?: TraktShow;
	season?: TraktSeason;
	episode?: TraktEpisode;
}

export interface TraktCollectionItem {
	last_collected_at?: string;
	last_updated_at?: string;
	movie?: TraktMovie;
	show?: TraktShow & { seasons?: TraktSeason[] };
}

export interface TraktWatchedMovie {
	plays: number;
	last_watched_at?: string;
	last_updated_at?: string;
	movie: TraktMovie;
}

export interface TraktWatchedShow {
	plays: number;
	last_watched_at?: string;
	last_updated_at?: string;
	show: TraktShow & { seasons?: TraktSeason[] };
}

export interface TraktWatching {
	started_at?: string;
	expires_at?: string;
	type: "movie" | "episode";
	movie?: TraktMovie;
	show?: TraktShow;
	episode?: TraktEpisode;
}

export interface TraktHistoryItem {
	id: number;
	watched_at: string;
	action: "scrobble" | "checkin" | "watch";
	type: "movie" | "episode";
	movie?: TraktMovie;
	show?: TraktShow;
	episode?: TraktEpisode;
}

export interface TraktRatingItem {
	rated_at: string;
	rating: number;
	type: "movie" | "show" | "season" | "episode";
	movie?: TraktMovie;
	show?: TraktShow;
	season?: TraktSeason;
	episode?: TraktEpisode;
}

export interface TraktLastActivities {
	all: string;
	movies: Record<string, string>;
	episodes: Record<string, string>;
	shows: Record<string, string>;
	seasons?: Record<string, string>;
	lists?: Record<string, string>;
	watchlist?: Record<string, string>;
	recommendations?: Record<string, string>;
}

export interface TraktWatchlistOptions {
	type?: TraktSyncMediaType;
	sort?: TraktWatchlistSort;
	extended?: TraktExtended;
}

export interface TraktUserWatchlistOptions {
	type: TraktSyncMediaType;
	sort?: TraktWatchlistSort;
	extended?: TraktExtended;
	page?: number;
	limit?: number;
}
