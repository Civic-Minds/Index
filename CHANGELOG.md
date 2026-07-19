# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **METRO Green Line Extension**: Added Minneapolis–Eden Prairie Southwest LRT corridor and 16 stations (opening planned 2027).
- **South Central Extension / Downtown Hub**: Added Valley Metro’s open Phoenix Central Avenue extension and downtown hub.
- **REM Airport Branch**: Added the under-construction spur to YUL via Marie-Curie.
- **Valley Line West**: Added Edmonton’s downtown-to-Lewis Farms LRT corridor and 16 stops under construction through 2028.
- **Federal Way Link**: Added Sound Transit’s open 1 Line extension from Angle Lake to Federal Way Downtown.
- **D Line Section 1**: Added LA Metro’s open Wilshire subway extension to La Cienega.
- **D Line Sections 2–3**: Added the under-construction subway segments through Beverly Hills, Century City, and Westwood.
- **REM Network**: Added the open South Shore trunk and Deux-Montagnes branch, and corrected the Anse-à-l’Orme station set to the West Island branch only.
- **Maryland Purple Line**: Added the Bethesda-to-New Carrollton light rail corridor and all 21 stations (opening targeted for winter 2027).
- **Calgary Green Line**: Added Phase 1 (under construction toward 2031) and Phase 2 planned expansion corridors.
- **O-Train Stage 2 East**: Added the Blair-to-Trim Line 1 extension and its five new stations.
- **O-Train Stage 2 South**: Added the open Line 2 south / Line 4 Airport extension with mapped stations.
- **Surrey–Langley SkyTrain**: Added the Expo Line Fraser Highway extension and eight new stations toward a late-2029 opening.
- **Map Launch**: The public map now opens without asking visitors to provide their own Mapbox token.
- **Project Corridors**: Transit construction lines now render reliably when the map launches.
- **Status Filtering**: The map legend now toggles project statuses on and off directly.
- **Data Labeling**: Replaced the misleading live-update masthead with source-date labeling.
- **Masthead**: Replaced decorative Roman numerals with the plain publication year.
- **Sidebar**: Replaced the repeated product name with a direct `PROJECTS` heading.
- **Masthead**: Removed redundant source-date metadata from the primary header.
- **Active Data**: Removed point-only placeholder projects from the live dataset until corridor geometry is available.
- **Masthead**: Removed the unnecessary `TECHNICAL RECORD` descriptor.
- **Eglinton Crosstown**: Added the Line 5 corridor and all 25 station locations from TTC schedule geometry.
- **Map Data**: Separated corridor projects from station features so stations render on the map without becoming list entries.
- **Active Scope**: Limited the public index to Eglinton Crosstown until each additional project has a complete corridor and station layer.
- **Corridor Rendering**: Made the active route line render independently of station point features.
- **Map Framing**: Zoomed the map to the active corridor instead of capping the initial view at regional scale.
- **Finch West LRT**: Added the Line 6 corridor and all 18 station locations from TTC schedule geometry.
- **Hazel McCallion Line**: Added the Hurontario LRT corridor and its 19 construction-phase stops.
- **Hamilton B-Line LRT**: Added the McMaster-to-Eastgate corridor and 17 planned stops.
- **Ontario Line**: Added the Metrolinx corridor and all 15 construction-phase stations.
- **Scarborough Subway Extension**: Added the Line 2 extension and its four mapped stations.
- **Yonge North Subway Extension**: Added the Line 1 extension to Richmond Hill Centre and its six mapped stations.
- **Durham-Scarborough BRT**: Added the corridor while clearly marking its station layer as unmapped.
- **Status Filtering**: Synced legend toggles across the project list, route lines, stations, and active-project highlight.
- **Project Focus**: Keep station layers hidden until a visitor selects a project or corridor.
- **Eglinton Crosstown West Extension**: Added the Mount Dennis-to-Pearson corridor and its 11 mapped stations.
- **ION Stage 2**: Added the Fairway-to-Cambridge corridor while leaving unfinalized station locations unmapped.
- **Regional Corridors**: Added eight additional Metrolinx corridors, including Eglinton East, Hamilton A-Line, and Waterfront routes.
- **Corridor Focus**: Clicking a route now zooms to the project and reveals its mapped stations.
- **Bailey Avenue BRT**: Added NFTA’s Bailey corridor from University Station to South Buffalo.
- **Project Copy**: Removed internal verification notes from public project details.
- **Project Scope**: Limited the visible index to projects with corridor geometry until point-only records have mapped shapes.
- **Station Visibility**: Hide station markers on the overview until a corridor or project is selected.
- **London Rapid Transit**: Added the East London Link and Wellington Gateway construction corridors.
- **Wellington Gateway**: Corrected the corridor endpoint to Wellington Road at Greenfield Drive.
- **Broadway Subway**: Added Vancouver’s VCC–Clark-to-Arbutus extension and six stations.
- **NFTA Metro Expansion**: Added the University Station-to-UB North Campus study corridor while the LRT/BRT alternatives remain under review.
- **O-Train Stage 2**: Added Ottawa’s official western extension alignment for Lines 1 and 3.
- **REM Anse-à-l’Orme**: Added the Montréal West Island branch and its seven stations from current REM feed geometry.
- **Montréal Blue Line**: Added the Saint-Michel-to-Anjou extension and its five new stations.
- **Québec Tramway**: Added the TramCité Le Gendre-to-Charlesbourg corridor as line-only data.

## [1.3.0] - 2026-05-31

### Changed
- **Branding**: Finalized the project name as **Transit Index**, establishing it as a technical record of transit infrastructure.
- **Modern Brutalist Redesign**: Completely overhauled the UI aesthetic to match a high-utility "digital ledger" style (inspired by cadtech.fyi).
- **Typography**: Switched to a monospace-heavy typographic system using *Space Mono* for technical data and *Inter* for body text.
- **Visuals**: Implemented a high-contrast monochrome palette, sharp 1px black borders, and solid offset shadows.
- **Basemap**: Updated the Mapbox style to a stark white background with simplified features to prioritize transit data.
- **Header**: Redesigned the masthead with a live pulsing indicator and technical metadata (MMXXVI).

### Fixed
- **Map Initialization**: Fixed a corruption error in `app.js` that prevented the "Launch Map" button from correctly initializing the interactive map.

## [1.2.2] - 2026-05-31

### Fixed
- Restored visible map context by keeping non-label basemap layers on screen.
- Improved the atlas so transit lines and markers read against the paper-style background.

## [1.2.1] - 2026-05-31

### Changed
- Simplified the atlas layout into a softer paper-style presentation.
- Removed the agency filter and agency badges from the sidebar.
- Added a sidebar reopen control after closing the panel.

### Fixed
- Corrected the token placeholder to avoid secret-scanning issues.
- Updated Finch West LRT and Eglinton Crosstown LRT to recently opened status.

## [1.2.0] - 2026-05-31

### Added
- Expanded the dataset with real Canadian transit construction and planning projects.
- Added Toronto-area projects plus Durham-Scarborough BRT coverage.
- Added source links for each featured project.

### Changed
- Reworked the layout into a magazine-style framed map.
- Updated the map to handle both corridor lines and point-based projects.
- Refined the filtering and project list interactions for the new dataset.

### Fixed
- Corrected broken source links in the dataset.
- Improved fit-to-data behavior for multi-geometry features.

## [1.1.0] - 2026-02-12

### Added
- **Decoupled Data Architecture**: Migrated all project data to `data/projects.json` for easier updates.
- **Agency Filtering**: Added ability to filter by TTC, Metrolinx, and City of Toronto.
- **Status Filtering**: Added filters for "Recently Opened", "Under Construction", "Approved", and "Planning".
- **Dynamic Project List**: Sidebar now populates from the JSON data.
- **"Fly To" Interaction**: Clicking a project in the list centers the map on it.
- **Rich Details View**: Added milestones and source links to the project details panel.

### Changed
- **Rebranding**: Renamed application to "Transit Progress | GTA".
- **UI Overhaul**: Updated aesthetics for a professional, data-driven look (blue/gray theme).
- **Sidebar UX**: Sidebar and legend are now hidden until a valid Mapbox token is entered.
- **Markers**: Updated station markers to use agency-specific colors.

### Fixed
- **UI Overlap**: Fixed `calc()` typos in CSS that caused sidebar overlap.
- **Legend Visibility**: Fixed legend dots not appearing correctly.
