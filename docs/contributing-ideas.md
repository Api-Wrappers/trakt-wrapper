# Contributing Ideas

These are real, useful ways to improve the Trakt wrapper without changing its
direction. Before implementing an idea, check the source and add tests that prove
the documented behavior.

1. Add tests for every `calendars` method to verify path parameters, query
   parameters, and authenticated calendar paths.
2. Add examples for custom list creation, updating, deleting, and item syncing.
3. Add check-in examples that show `checkin.create` and `checkin.remove` with
   movie and episode references.
4. Add more fixtures for watchlist, ratings, history, scrobble, and playback
   responses so type coverage is easier to review.
5. Improve sync request body types for advanced Trakt history fields after
   confirming the API shape and adding tests.
6. Add a guide for pairing TMDB search results with Trakt sync calls through
   shared TMDB IDs.
7. Add a recipe for token refresh using `auth.refreshToken` and
   `trakt.setAccessToken`.
8. Add an error-handling guide that covers `@api-wrappers/api-core` errors,
   retry configuration, and user-facing fallback behavior.
9. Add examples for `sync.playback` and `sync.removePlayback` to support resume
   playback dashboards.
10. Add endpoint tests for `users.ratings`, `sync.ratings`, and rating filters.
11. Add docs for pagination patterns across trending, history, comments, lists,
   and related media endpoints.
12. Add examples for `search.text` and `search.id` that show how to bridge
   external catalog IDs into Trakt flows.
13. Add more show, season, and episode examples for TV tracker apps.
14. Add a migration guide for apps moving from raw `fetch` calls to this wrapper.
15. Add runtime examples for custom `fetch`, timeout settings, retries, and
   api-core plugins.
