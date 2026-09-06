# North American Project Additions

Audit date: 2026-09-05

The 12 projects identified for addition were reconciled against every data collection loaded by `app.js`. Ten were already present in regional data files, so they were not duplicated. Honolulu Skyline Segment 3 and the Sepulveda Transit Corridor were absent and were added.

| Requested project | Current data location | Disposition |
| --- | --- | --- |
| Broadway Subway | `data/vancouver-projects.json` | Already present; construction |
| Surrey–Langley SkyTrain | `data/vancouver-projects.json` | Already present; construction |
| Valley Line West | `data/edmonton-projects.json` | Already present; construction |
| Capital Line South Phase 1 | `data/edmonton-projects.json` | Already present; construction |
| Chicago Red Line Extension | `data/chicago-projects.json` | Already present; construction |
| Maryland Purple Line | `data/maryland-projects.json` | Already present; construction |
| Minneapolis METRO Green Line Extension | `data/minneapolis-projects.json` | Already present; construction |
| Honolulu Skyline Segment 3 | `data/honolulu-projects.json` | Added; construction |
| Los Angeles D Line Sections 2–3 | `data/la-projects.json` | Already present; construction |
| BART Silicon Valley Phase II | `data/bay-area-projects.json` | Already present; corrected to planning and engineering |
| Seattle West Seattle Link Extension | `data/seattle-projects.json` | Already present; in design |
| Los Angeles Sepulveda Transit Corridor | `data/la-projects.json` | Added as a planning corridor; station points intentionally omitted because final station locations remain under study |

## Existing-record source checks

The ten pre-existing records were checked against their current official project pages:

- Broadway Subway and Surrey–Langley SkyTrain: <https://www.translink.ca/plans-and-projects/projects/rapid-transit-projects/broadway-subway-project> and <https://www.translink.ca/translink/plans-and-projects/projects/rapid-transit-projects/surrey-langley-skytrain>
- Valley Line West and Capital Line South: <https://www.edmonton.ca/projects_plans/transit/valley-line-west> and <https://www.edmonton.ca/projects_plans/transit/capital-line-south>
- Chicago Red Line Extension: <https://www.transitchicago.com/rle/construction/>
- Maryland Purple Line: <https://purplelinemd.com/updates>
- METRO Green Line Extension: <https://metrocouncil.org/Transportation/Projects/Light-Rail-Projects/METRO-Green-Line-Extension/About.aspx>
- Los Angeles D Line Sections 2–3: <https://www.metro.net/projects/westside/>
- West Seattle Link Extension: <https://www.soundtransit.org/system-expansion/west-seattle-link-extension/news-updates>

## Honolulu verification

HART’s current construction page says Segment 3 is under construction from Mokauea to Civic Center, includes six stations, and is scheduled for passenger service in 2031. The official HART/City ArcGIS station layer supplied the six point coordinates used in `data/honolulu-projects.json`: Mokauea, Niuhelewai, Kūwili, Hōlau, Kuloloia, and Ka‘ākaukukui.

- Construction source: <https://honolulutransit.org/construction/>
- Station names and current phase: <https://honolulutransit.org/hart-faqs/what-is-the-current-status-of-the-construction-for-the-honolulu-rail-transit-project/>
- Official station GIS layer: <https://services6.arcgis.com/2cZSk3EXXiOHcbOl/arcgis/rest/services/HART_Transit_Stations_PUBLIC/FeatureServer/0>

## BART status correction

VTA’s current Phase II page says the project is in planning and engineering while it advances toward federal funding and construction. The six existing records were retained, but the parent and station statuses were changed from construction to planning.

- Source: <https://www.vta.org/projects/bart-sv/phase-ii>

## Sepulveda verification

Metro’s current project page identifies the underground heavy-rail locally preferred alternative between Van Nuys and the E Line Sepulveda Station and says the project remains in planning and environmental review. The map therefore contains the committed corridor concept but no unsupported station points.

- Source: <https://www.metro.net/projects/sepulvedacorridor/>

## Verification

The new Honolulu collection is loaded by `app.js`, the requested project name is active, and all six station records inherit the parent’s construction status. The complete loaded-data validation is run before commit.
