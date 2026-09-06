# Project Accuracy Audit

Status: complete
Audit started: 2026-09-05
Scope: every feature in `data/projects.json`, including corridor records and station/stop records.

## Inventory

- 133 GeoJSON features after the first confirmed correction.
- 19 named project groups.
- 17 source URL groups, with station and stop features inheriting their parent project’s source.

## Project-level dispositions

| Project | Current disposition | Audit result |
| --- | --- | --- |
| Kitchener Extension | Under construction | Corrected scope and status |
| Gormley Extension | In service | Corrected from future extension |
| Lakeshore West Line - West Harbour Extension | Opened | Corrected completed connection |
| Barrie Extension | Under construction | Corrected scope and status |
| Niagara Extension | Planning | Updated current program scope |
| Confederation Extension | Opened | Corrected from planning |
| O-Train Stage 2 (Confederation Line Extension) | Construction / phased completion | Updated phase distinction |
| Green Line Phase 1 | Under construction | Updated current Phase 1 scope |
| Green Line Phase 2 | Unfunded future extension | Corrected status wording |
| Finch West LRT | Opened | Verified 18-stop current line |
| Hazel McCallion Line | Under construction | Verified 19-stop current project |
| Hamilton B-Line LRT | Enabling works | Corrected current delivery phase |
| Ontario Line | Under construction | Corrected five station names |
| Scarborough Subway Extension | Under construction | Corrected two station names |
| Yonge North Subway Extension | Under construction | Removed obsolete station and corrected count |
| Eglinton Crosstown West Extension | Under construction | Corrected committed/potential station scope |
| ION Stage 2 | Pre-construction | Corrected current phase |
| Durham-Scarborough BRT | Planning | Added current 36-km/49-stop scope |
| Eglinton Crosstown LRT | Opened | Verified 25-stop current line |

## Confirmed corrections

### Yonge North Subway Extension

Metrolinx’s current project page lists five stations: Steeles, Clark, Royal Orchard, Bridge, and High Tech. The data previously listed six and included Cummer/Drewry, which is no longer in the current station set.

- Removed the obsolete Cummer/Drewry station feature.
- Changed the parent project description and milestone from six stations to five.
- Source: <https://www.metrolinx.com/en/projects-and-programs/yonge-north-subway-extension/what-were-building>

### ION Stage 2

The Region of Waterloo says Regional Council approved the Cambridge extension in November 2025 and that the project is now in detailed design and pre-construction. The data still displayed only “Planning.”

- Changed the display status to “Pre-construction.”
- Updated the timeline with the approval and current phase.
- Source: <https://www.regionofwaterloo.ca/programs-and-services/roads-and-transportation/transit-and-transportation/stage-2-ion/>

### Calgary Green Line Phase 1

The City of Calgary currently defines Phase 1 as 17.2 kilometres and 12 stations, including both the southeast and downtown segments. Southeast construction is underway; downtown is in functional planning.

- Updated the summary from the narrower 16-kilometre southeast segment to the current Phase 1 scope.
- Source: <https://www.calgary.ca/green-line/about.html>

### Eglinton Crosstown West Extension

Metrolinx currently describes the committed extension as seven stations from Mount Dennis to Renforth, with up to three additional stations on a potential Pearson link. The data previously described all 11 mapped points as stations on an airport extension.

- Reworded the project summary to distinguish the committed 9.2-kilometre extension, the existing Mount Dennis endpoint, and the potential Pearson link.
- Source: <https://www.metrolinx.com/en/projects-and-programs/eglinton-crosstown-west-extension>

### Calgary Green Line future extension

The City currently describes the north and south Green Line extensions as unfunded future extensions that will be built in phases as funding becomes available. “Green Line Phase 2” was too definite.

- Changed the display status to “Unfunded Future Extension” and clarified that no delivery schedule is set.
- Source: <https://www.calgary.ca/green-line/faqs-and-resources.html>

### Hamilton B-Line LRT

The City’s current LRT page says enabling works and detailed design are underway. The data previously labeled the project “In Delivery,” which overstated the current construction phase.

- Changed the display status to “Enabling Works” and clarified that major LRT construction has not yet begun.
- Source: <https://www.hamilton.ca/city-council/plans-strategies/light-rail-transit-lrt/lrt-enabling-works>

### O-Train Stage 2 Confederation Line Extension

Ottawa reports that the Line 1 east extension reached substantial completion in March 2026, while the west extension and new Line 3 remain under construction.

- Updated the summary to distinguish those phases instead of describing all Stage 2 work as simply under construction.
- Source: <https://ottawa.ca/en/business/research-and-data/investor-relations/green-bonds-city-ottawa/city-ottawa-green-debenture-treasurers-information-report-2024/green-debenture-project-updates>
- East-extension milestone: <https://www.octranspo.com/en/news/article/march-5-2026-stage-2-o-train-line-east-extension-achieves-substantial-completion>

### Durham-Scarborough BRT

Metrolinx currently describes the proposed corridor as 36 kilometres with 49 proposed stops. The data had no current length or stop-count detail.

- Added the current scope and stop count while retaining the line-only geometry.
- Source: <https://www.metrolinx.com/en/projects-and-programs/durham-scarborough-brt>

### Ontario Line station names

Metrolinx’s current station page uses updated names for five mapped stations: King West, Chinatown, Distillery District, Leslieville, and Don Valley. The data used older or provisional labels for all five.

- Updated the five station names without changing their mapped coordinates or the 15-station count.
- Source: <https://www.metrolinx.com/en/projects-and-programs/ontario-line/what-were-building>

### Hazel McCallion Line stop names

The current Metrolinx project material confirms 19 stops. A current Metrolinx stop-label map uses Port Credit GO Station, Cooksville GO Station, City Centre, and Ray Lawson; the data used shorter or stale labels at those four coordinates.

- Renamed Port Credit, Cooksville, Mississauga City Centre, and Sir Lou to the current labels without moving their coordinates.
- Sources: <https://www.metrolinx.com/en/projects-and-programs/hazel-mccallion-lrt>, <https://assets.metrolinx.com/image/upload/v1760465749/Documents/Engineering/PRESTO_Service_Design_Standard.pdf>

### Hamilton B-Line LRT stop names

The current Metrolinx Hamilton LRT material confirms the mapped 17-stop set, including Scott Park and Gage Park, from McMaster University to Eastgate Square. No Hamilton stop-name or coordinate change was required.

- Source: <https://assets.metrolinx.com/image/upload/v1750878787/Images/Metrolinx/Hamilton%20LRT/HaLRT_Virtual_Open_House_June_24_2025_FINAL.pdf>

### Future Toronto corridor point names

Current Metrolinx station pages confirm the complete point-name sets for the Ontario Line (15), the Scarborough Subway Extension (three new stations plus the Kennedy connection), and the Yonge North Subway Extension (five). The current Eglinton Crosstown West page confirms the seven committed stations from Mount Dennis to Renforth; the three mapped Pearson-link points remain potential future stations, consistent with Metrolinx’s current wording and the agency’s earlier EPR station locations.

- No additional point-name or coordinate changes were required after the earlier Ontario, Scarborough, and Yonge corrections.
- Sources: <https://www.metrolinx.com/en/projects-and-programs/ontario-line/what-were-building>, <https://www.metrolinx.com/en/projects-and-programs/scarborough-subway-extension/what-were-building>, <https://www.metrolinx.com/en/projects-and-programs/yonge-north-subway-extension/what-were-building>, <https://www.metrolinx.com/en/projects-and-programs/eglinton-crosstown-west-extension>, <https://assets.metrolinx.com/image/upload/v1668610621/Images/Metrolinx/ECWE_EPR_2020_Addendum.pdf>

### Scarborough Subway Extension station names

Metrolinx’s current station page identifies the three new stations as Lawrence & McCowan, Scarborough Centre, and Sheppard & McCowan. The map used the shortened but inaccurate labels Lawrence East and McCowan.

- Renamed those two station features without changing their coordinates.
- Source: <https://www.metrolinx.com/en/projects-and-programs/scarborough-subway-extension/what-were-building>

## Toronto station geometry audit

The current TTC static GTFS feed includes Line 5 Eglinton and Line 6 Finch West. The 43 corresponding mapped station records match the feed by station name and platform coordinate to six decimal places: 25 Line 5 records and 18 Line 6 records. The feed record was current as of its 2026-09-04 fetch.

- Line 5 Eglinton: 25 of 25 names and coordinates matched.
- Line 6 Finch West: 18 of 18 names and coordinates matched.
- Source record: <https://www.transit.land/feeds/f-dpz8-ttc>
- TTC feed URL exposed by that record: <https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/7795b45e-e65a-4465-81fc-c36b9dfff169/resource/cfb6b2b8-6191-41e3-bda1-b175c51148cb/download/TTC%20Routes%20and%20Schedules%20Data.zip>

## GO corridor audit

### Kitchener Extension

Metrolinx describes this as a phased construction project between Georgetown and Kitchener GO, with current and future track, platform, storage, bridge, and station works supporting two-way, all-day service.

- Changed the record from long-range planning to “Under Construction.”
- Replaced the incorrect description of a future corridor west of current Kitchener service with the current Kitchener Extension scope.
- Source: <https://www.metrolinx.com/en/projects-and-programs/kitchener-line-go-expansion/what-were-building/kitchener-extension>

### Gormley Extension

Current GO service information and schedules show Gormley as an active Richmond Hill Line station. The record previously described this as a future extension beyond Gormley.

- Changed the record to “In Service” and corrected the description to the Richmond Hill-to-Gormley extension.
- Source: <https://www.gotransit.com/en/see-schedules/pdf-schedules>

### West Harbour connection

Metrolinx says the West Harbour connecting track is complete and now supports expanded Niagara service. The record previously described future long-range growth beyond West Harbour.

- Changed the record to “Opened” and described the completed connection.
- Source: <https://www.metrolinx.com/en/projects-and-programs/lakeshore-west-line-go-expansion/what-were-building/niagara-extension>

### Barrie Extension

Metrolinx’s approved corridor expansion adds a second track between Lansdowne Avenue and Allandale Waterfront GO Station, with construction and corridor works underway.

- Changed the record to “Under Construction” and corrected its scope and milestones.
- Source: <https://www.metrolinx.com/en/projects-and-programs/barrie-line-go-expansion/resources/barrie-rail-corridor-expansion-tpap>

### Niagara Extension

The current program includes completed West Harbour connection work, more than 25 kilometres of new track in scope, four new or improved stations, and continued planning for future service enhancements.

- Kept the record in planning while replacing stale “seasonal service only” wording with the current program scope.
- Source: <https://www.metrolinx.com/en/projects-and-programs/lakeshore-west-line-go-expansion/what-were-building/niagara-extension>

### Confederation Extension

Confederation GO is complete and has been in service since October 27, 2025.

- Changed the record from planning to “Opened” and documented the current in-service state.
- Source: <https://www.metrolinx.com/en/projects-and-programs/lakeshore-west-line-go-expansion/what-were-building/confederation>

## Count checks completed

The following live agency counts match the current local feature sets, with the noted endpoint treatment:

- Finch West: 18 stops.
- Line 5 Eglinton: 25 stations and stops.
- Hazel McCallion: 19 stops.
- Hamilton B-Line: 17 stops.
- Ontario Line: 15 stations.
- Scarborough Subway Extension: three new stations, plus the existing Kennedy connection point in the map data.
- Yonge North: five stations after removing Cummer/Drewry.
- Eglinton Crosstown West: seven committed stations, three potential Pearson-link locations, plus the existing Mount Dennis endpoint.

## Completion verification

Structural validation completed on 2026-09-05: 133 features, 19 corridor features, 114 point features, no invalid GeoJSON geometry, no out-of-range coordinates, no orphaned point features, and no missing parent source URLs. The separate TTC feed check verified all 43 Line 5 and Line 6 point records by name and coordinate.

The other 71 station/stop records had their names checked against current project material, and their coordinates remain on their mapped parent corridors. A corridor-distance sanity check found all 71 within 67 metres of their parent geometry; the separate TTC feed check is the exact coordinate check for the 43 stations that are already in service. No unsupported coordinate change was made.

All 19 parent `source_url` values were also requested successfully on 2026-09-05. Four stale links were replaced with live official pages for Ottawa Stage 2, both Calgary Green Line phases, and Durham-Scarborough BRT.

This audit is complete as of 2026-09-05. Project status, scope, counts, station names, source links, and mapped geometry have a recorded disposition for every feature; corrections were limited to source-backed changes listed above.
