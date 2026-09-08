# Index data

`projects.geojson` and `stations.geojson` are the canonical files loaded by the app.

Each project has a stable `id` and a boolean `published` field. New projects should be added to `projects.geojson`; they do not require a JavaScript allowlist entry. Station features refer to projects through `project_id` and retain `project_name` for map labels and compatibility.

The older regional JSON files remain as migration-era source records and are not loaded by the app. `pending-projects.json` contains researched records that are not published.

Run `npm run validate:data` before committing data changes. The validator checks GeoJSON shape, required fields, unique IDs and names, and station-to-project references.
