# North American Coverage Audit

Audit date: 2026-09-05

Index is an editorial map of major active transit projects, not a complete inventory of every transit proposal. This audit uses transparent inclusion rules: add projects that are federally tracked for capital funding, under construction, approved, or in active project development; omit concepts without a current official project record.

## United States

The Rio East–Dobson Streetcar Extension in the Tempe–Mesa area was also added after review of the Valley Metro study record. It is an active planning/design project with federal RAISE funding for design and environmental work, not an active construction project.

- Valley Metro study record: <https://redestreetcar.com/archive.html>
- Federal grant announcement: <https://stanton.house.gov/2024/6/stanton-announces-15-9-million-federal-grant-to-advance-rio-east-dobson-streetcar-extension>

The Federal Transit Administration's current Capital Investment Grants roster was checked against every project parent loaded by `app.js`. The missing projects from that roster were added to `data/fta-projects.json`:

- Stone Avenue BRT
- Red Line Modernization Project
- Eastside Transit Corridor Phase 2
- Vermont Avenue BRT
- Transbay Program Downtown Extension
- Downtown Riverfront Streetcar
- Federal Boulevard BRT
- West Elizabeth Corridor
- Broward Commuter Rail South
- Northeast Corridor Rapid Transit
- MARTA Rapid Campbellton
- MARTA Rapid Southlake
- Blue Hill Avenue Transit Action Plan
- Green Line Transformation Program
- Cleveland MetroHealth Line BRT
- Columbus East Main Street BRT
- Columbus Northwest BRT
- Columbus West Broad Street BRT
- MAPS 4 Bus Rapid Transit Corridor
- 82nd Avenue Transit Project
- Montgomery Park Transit Project
- TV Highway Transit and Safety Project
- Lowcountry Rapid Transit
- METRORapid Gulfton Corridor
- San Antonio ART East/West Corridor
- Davis-Salt Lake City Community Connector
- FrontRunner 2X
- Richmond Highway Bus Rapid Transit
- Swift Gold Line BRT
- RapidRide K Line BRT
- Division Street Bus Rapid Transit
- Madison North-South BRT

The FTA roster is the status source for these records. Its stage labels are preserved in each feature's `federal_stage` property. Geometry is intentionally approximate and line-only; no station points were invented from a roster that does not publish authoritative station GIS.

- FTA current project roster: <https://www.transit.dot.gov/funding/grant-programs/capital-investments/current-capital-investment-grant-cig-projects>
- FTA current dashboard: <https://www.transit.dot.gov/funding/grants/grant-programs/capital-investments/capital-investment-grant-cig-dashboard>

## Canada

Alto High-Speed Rail was added as a planning/co-development corridor. Canada's current Transport Canada project page identifies the Toronto–Québec City initiative and its principal cities, but the final alignment and station plan are not fixed, so the map uses a clearly marked approximate corridor with no station points.

- Transport Canada major-projects page: <https://tc.canada.ca/en/corporate-services/transparency/briefing-documents-transport-canada/2026-dm/transport-canada-structure-portfolio/tc-groups/major-projects>

## Mexico

The current SICT/ATTRAPI passenger-rail program identifies four new national routes and the Lechería–AIFA suburban branch. All five absent projects were added to `data/mexico-projects.json` with approximate line-only corridors and no unsupported station points:

- Tren México–Pachuca
- Tren México–Querétaro
- Tren Querétaro–Irapuato
- Tren Saltillo–Nuevo Laredo
- Tren Suburbano Lechería–AIFA

- SICT passenger-rail program: <https://www.gob.mx/sict/prensa/avanza-construccion-de-nuevas-rutas-ferroviarias-para-pasajeros-sict>
- SICT Querétaro–Irapuato and Saltillo–Nuevo Laredo update: <https://www.gob.mx/sict/prensa/avanzan-en-su-proceso-de-licitacion-y-construccion-trenes-queretaro-irapuato-y-saltillo-nuevo-laredo>
- SICT Lechería–AIFA assignment: <https://www.gob.mx/sict/prensa/otorga-sict-titulo-de-asignacion-del-tren-lecheria-aifa-a-banobras>

## Deliberate exclusions

Freight-only infrastructure, completed projects, unfunded concepts, and proposals without a current authoritative project record were not added. Examples include the Lac-Mégantic rail bypass, which is a freight bypass rather than passenger transit, and the Interstate Bridge Replacement Program, which is a highway/bridge program rather than a transit project in Index's scope.

## Verification

After the additions, every data file is parsed, every new collection is loaded by `app.js`, every new project is active, station-orphan and parent/child status checks are run, and the approximate-geometry limitation remains documented here.
