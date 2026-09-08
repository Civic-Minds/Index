# Index data

`projects.geojson` and `stations.geojson` are the canonical files loaded by the app.

Each project has a stable `id`, a boolean `published` field, and a non-empty `sources` array. Each source stores a URL, language, and the claims it supports; optional title, publisher, and access date make later fact-checking easier. The first source is the primary project page, and `source_url` remains as a compatibility alias for that first URL. New projects should be added to `projects.geojson`; they do not require a JavaScript allowlist entry. Station features refer to projects through `project_id` and retain `project_name` for map labels and compatibility; station sources are not stored separately.

Use `supports` values from `project`, `status`, `timeline`, `description`, `geometry`, and `stations`. Preserve official non-English sources and record their language instead of replacing them with an English summary. There is no maximum source count; preserve every distinct source that materially supports the record. Add a source when it supports a claim used by the record; do not add URLs that were not actually consulted.

The older regional JSON files remain as migration-era source records and are not loaded by the app. `pending-projects.json` contains researched records that are not published.

Run `npm run validate:data` before committing data changes. The validator checks GeoJSON shape, required fields, unique IDs and names, source records and URL consistency, and station-to-project references.
