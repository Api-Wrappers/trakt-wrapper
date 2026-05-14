import type {
	TraktCalendarMovie,
	TraktCalendarShow,
	TraktExtended,
	TraktRequestOptions,
} from "../types";
import { appendPath, withQuery } from "../utils";
import { BaseEndpoint } from "./BaseEndpoint";

export interface CalendarOptions {
	startDate?: string;
	days?: number;
	extended?: TraktExtended;
}

export class CalendarsEndpoint extends BaseEndpoint {
	allShows(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath("/calendars/all/shows", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}

	allNewShows(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath("/calendars/all/new_shows", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}

	allSeasonPremieres(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath(
				"/calendars/all/season_premieres",
				options.startDate,
				options.days,
			),
			withQuery({ extended: options.extended }, request),
		);
	}

	allMovies(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarMovie[]> {
		return this.get<TraktCalendarMovie[]>(
			appendPath("/calendars/all/movies", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}

	myShows(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath("/calendars/my/shows", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}

	myNewShows(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath("/calendars/my/new_shows", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}

	mySeasonPremieres(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarShow[]> {
		return this.get<TraktCalendarShow[]>(
			appendPath(
				"/calendars/my/season_premieres",
				options.startDate,
				options.days,
			),
			withQuery({ extended: options.extended }, request),
		);
	}

	myMovies(
		options: CalendarOptions = {},
		request?: TraktRequestOptions,
	): Promise<TraktCalendarMovie[]> {
		return this.get<TraktCalendarMovie[]>(
			appendPath("/calendars/my/movies", options.startDate, options.days),
			withQuery({ extended: options.extended }, request),
		);
	}
}
