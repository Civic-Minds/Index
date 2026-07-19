// DOM Elements
const sidebar = document.getElementById('sidebar');
const projectName = document.getElementById('project-name');
const projectList = document.getElementById('project-list');
const listView = document.getElementById('list-view');
const detailsView = document.getElementById('project-details-view');
const projectStatus = document.getElementById('project-status');
const projectDescription = document.getElementById('project-description');
const projectMilestones = document.getElementById('project-milestones');
const projectTimeline = document.getElementById('project-timeline');
const projectMeta = document.getElementById('project-meta');
const projectStationsField = document.getElementById('project-stations-field');
const projectStationsCount = document.getElementById('project-stations-count');
const projectLink = document.getElementById('project-link');
const closeBtn = document.getElementById('close-sidebar');
const openBtn = document.getElementById('open-sidebar');
const backBtn = document.getElementById('back-to-list');
const filterContainer = document.getElementById('filter-container');
const statusChips = document.getElementById('status-chips');
const projectSearch = document.getElementById('project-search');
const sortSelect = document.getElementById('sort-select');
const listCount = document.getElementById('list-count');
const emptyList = document.getElementById('empty-list');
const loadingBanner = document.getElementById('loading');
const resetViewBtn = document.getElementById('reset-view');
const statTotal = document.getElementById('stat-total');
const statConstruction = document.getElementById('stat-construction');
const statOpened = document.getElementById('stat-opened');
const statPlanning = document.getElementById('stat-planning');

const DEFAULT_TITLE = 'PROJECTS';
const PUBLIC_MAPBOX_TOKEN = 'pk.eyJ1Ijoicnlhbmhhbm5hIiwiYSI6ImNtbXk3MTkyYTM5ZHQyb3EzOWZnczV2NWUifQ.1ipGd2Oc07tCfLY7I_Fb1w';
const STATUS_ORDER = ['planning', 'approved', 'construction', 'opened', 'delayed'];
const STATUS_LABELS = {
    planning: 'Planning',
    approved: 'Approved',
    construction: 'Construction',
    opened: 'Recently opened',
    delayed: 'Delayed'
};
const ACTIVE_PROJECT_NAMES = new Set(['Eglinton Crosstown LRT', 'Finch West LRT', 'Hazel McCallion Line', 'Hamilton B-Line LRT', 'Ontario Line', 'Scarborough Subway Extension', 'Yonge North Subway Extension', 'Durham-Scarborough BRT', 'Eglinton Crosstown West Extension', 'ION Stage 2', 'Eglinton East LRT', 'Sheppard East LRT', 'Waterfront West LRT', 'Waterfront East LRT', 'Hamilton A-Line', 'Finch West LRT Extension', 'Brampton Queen Street BRT / LRT', 'Downtown Mississauga Transitway', 'Bailey Avenue BRT', 'East London Link', 'Wellington Gateway', 'NFTA Metro Transit Expansion', 'O-Train Stage 2 West Extension', 'REM Anse-à-l’Orme Branch', 'Montréal Blue Line Extension', 'TramCité', 'Broadway Subway Extension', 'Green Line Phase 1', 'Green Line Phase 2', 'O-Train Stage 2 East Extension', 'O-Train Stage 2 South Extension', 'Surrey–Langley SkyTrain', 'REM South Shore', 'REM Deux-Montagnes Branch', 'Maryland Purple Line', 'Valley Line West LRT', 'Federal Way Link Extension', 'D Line Extension Section 1', 'D Line Extension Section 2', 'D Line Extension Section 3', 'METRO Green Line Extension', 'South Central Extension / Downtown Hub', 'REM Airport Branch', 'Lynnwood Link Extension', '2 Line East Link Extension', 'DART Silver Line', 'CTA Red Line Extension', 'South Coast Rail Fall River', 'South Coast Rail New Bedford', 'A Line Foothill Extension', 'East San Fernando Valley LRT', 'Capital Line South', 'Second Avenue Subway Phase 2', 'Penn Station Access', 'VTA BART Silicon Valley Phase II', 'NICTD West Lake Corridor', 'KC Streetcar Main Street Extension', 'KC Streetcar Riverfront Extension', 'MARTA Rapid A-Line', 'Gateway Hudson Tunnel Project', 'LAX SkyLink', 'Austin Light Rail Phase 1', 'Southeast Gateway Line', 'UTA Midvalley Express (MVX)', 'Maryland Parkway BRT', 'Interborough Express (IBX)', 'West Seattle Link Extension', 'Kitchener Extension', 'Gormley Extension', 'Lakeshore West Line - West Harbour Extension', 'Barrie Extension', 'Niagara Extension', 'Confederation Extension']);
const MAP_BACKGROUND_COLOR = '#ffffff';
const OVERVIEW = { center: [-98.5, 39.5], zoom: 3 };

let map;
let allProjects = [];
let allStationFeatures = [];
let fullMapCollection = { type: 'FeatureCollection', features: [] };
const hiddenStatuses = new Set();
let activeProjectName = '';
let hoverProjectName = '';
let searchQuery = '';
let sortMode = 'name';

function isProjectFeature(feature) {
    return feature.geometry && ['LineString', 'MultiLineString'].includes(feature.geometry.type);
}

function isStationFeature(feature) {
    return feature.properties?.feature_type === 'station' && feature.geometry?.type === 'Point';
}

function showSidebar() {
    sidebar.classList.add('open');
    openBtn.classList.add('hidden');
}

function hideSidebar() {
    sidebar.classList.remove('open');
    openBtn.classList.remove('hidden');
}

initializeMap(PUBLIC_MAPBOX_TOKEN);

async function fetchProjects() {
    loadingBanner.classList.remove('hidden');
    try {
        const [
            response, supplementalResponse, nftaResponse, londonResponse, ottawaResponse,
            remResponse, montrealResponse, quebecResponse, vancouverResponse, marylandResponse,
            edmontonResponse, seattleResponse, laResponse, minneapolisResponse, phoenixResponse,
            dallasResponse, chicagoResponse, bostonResponse, nycResponse, bayAreaResponse,
            indianaResponse, kansasCityResponse, atlantaResponse, austinResponse,
            saltLakeResponse, lasVegasResponse
        ] = await Promise.all([
            fetch('data/projects.json'),
            fetch('data/regional-projects.json'),
            fetch('data/nfta-projects.json'),
            fetch('data/london-projects.json'),
            fetch('data/ottawa-projects.json'),
            fetch('data/rem-projects.json'),
            fetch('data/montreal-projects.json'),
            fetch('data/quebec-projects.json'),
            fetch('data/vancouver-projects.json'),
            fetch('data/maryland-projects.json'),
            fetch('data/edmonton-projects.json'),
            fetch('data/seattle-projects.json'),
            fetch('data/la-projects.json'),
            fetch('data/minneapolis-projects.json'),
            fetch('data/phoenix-projects.json'),
            fetch('data/dallas-projects.json'),
            fetch('data/chicago-projects.json'),
            fetch('data/boston-projects.json'),
            fetch('data/nyc-projects.json'),
            fetch('data/bay-area-projects.json'),
            fetch('data/indiana-projects.json'),
            fetch('data/kansas-city-projects.json'),
            fetch('data/atlanta-projects.json'),
            fetch('data/austin-projects.json'),
            fetch('data/salt-lake-projects.json'),
            fetch('data/las-vegas-projects.json')
        ]);
        const data = await response.json();
        const supplemental = await supplementalResponse.json();
        const nfta = await nftaResponse.json();
        const london = await londonResponse.json();
        const ottawa = await ottawaResponse.json();
        const rem = await remResponse.json();
        const montreal = await montrealResponse.json();
        const quebec = await quebecResponse.json();
        const vancouver = await vancouverResponse.json();
        const maryland = await marylandResponse.json();
        const edmonton = await edmontonResponse.json();
        const seattle = await seattleResponse.json();
        const la = await laResponse.json();
        const minneapolis = await minneapolisResponse.json();
        const phoenix = await phoenixResponse.json();
        const dallas = await dallasResponse.json();
        const chicago = await chicagoResponse.json();
        const boston = await bostonResponse.json();
        const nyc = await nycResponse.json();
        const bayArea = await bayAreaResponse.json();
        const indiana = await indianaResponse.json();
        const kansasCity = await kansasCityResponse.json();
        const atlanta = await atlantaResponse.json();
        const austin = await austinResponse.json();
        const saltLake = await saltLakeResponse.json();
        const lasVegas = await lasVegasResponse.json();
        const features = [
            ...data.features, ...supplemental.features, ...nfta.features, ...london.features,
            ...ottawa.features, ...rem.features, ...montreal.features, ...quebec.features,
            ...vancouver.features, ...maryland.features, ...edmonton.features, ...seattle.features,
            ...la.features, ...minneapolis.features, ...phoenix.features, ...dallas.features,
            ...chicago.features, ...boston.features, ...nyc.features, ...bayArea.features,
            ...indiana.features, ...kansasCity.features, ...atlanta.features,
            ...austin.features, ...saltLake.features, ...lasVegas.features
        ];
        const projectFeatures = features.filter(feature =>
            isProjectFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.name)
        );
        const stationFeatures = features.filter(feature =>
            isStationFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.project_name)
        );
        allProjects = projectFeatures;
        allStationFeatures = stationFeatures;
        fullMapCollection = { type: 'FeatureCollection', features: [...projectFeatures, ...stationFeatures] };
        updateMastheadStats(allProjects);
        buildStatusChips(allProjects);
        applyFilters();
        updateMapData(fullMapCollection);
    } catch (error) {
        console.error('Error fetching projects:', error);
        loadingBanner.textContent = 'Failed to load corridors.';
    } finally {
        loadingBanner.classList.add('hidden');
    }
}

function initializeMap(token) {
    mapboxgl.accessToken = token;

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: OVERVIEW.center,
        zoom: OVERVIEW.zoom,
        attributionControl: false
    });

    // Allow normal pan/zoom; Reset returns to the full network framing.
    map.dragRotate.disable();

    map.on('load', () => {
        simplifyBaseMap();

        sidebar.classList.remove('hidden');
        document.getElementById('legend').classList.remove('hidden');
        showSidebar();
        map.addSource('transit-projects', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
            id: 'transit-lines-dim',
            type: 'line',
            source: 'transit-projects',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'line-width': 3,
                'line-opacity': 0.2,
                'line-dasharray': [1.2, 2.2]
            },
            filter: ['==', 'name', '']
        });

        map.addLayer({
            id: 'transit-lines',
            type: 'line',
            source: 'transit-projects',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'line-width': 4,
                'line-opacity': 1,
                'line-dasharray': [1.2, 2.2]
            }
        });

        map.addLayer({
            id: 'transit-lines-hover',
            type: 'line',
            source: 'transit-projects',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'line-width': 8,
                'line-opacity': 0.35
            },
            filter: ['==', 'name', '']
        });

        map.addLayer({
            id: 'transit-stations',
            type: 'circle',
            source: 'transit-projects',
            filter: ['==', 'feature_type', 'station'],
            paint: {
                'circle-radius': 5,
                'circle-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 2
            }
        });

        map.on('click', 'transit-lines', (e) => {
            const props = e.features[0].properties;
            const project = allProjects.find(item => item.properties.name === props.name);
            if (project) {
                showProjectDetails(project.properties);
                flyToProject(project);
            }
        });

        map.on('mousemove', 'transit-lines', (e) => {
            if (!e.features.length) return;
            map.getCanvas().style.cursor = 'pointer';
            setHoverProject(e.features[0].properties.name);
        });

        map.on('mouseleave', 'transit-lines', () => {
            map.getCanvas().style.cursor = '';
            setHoverProject('');
        });

        map.on('click', 'transit-stations', (e) => {
            const station = e.features[0].properties;
            const project = allProjects.find(item => item.properties.name === station.project_name);
            if (project) {
                showProjectDetails(project.properties);
                flyToProject(project);
            }
        });

        map.on('mouseenter', 'transit-stations', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'transit-stations', () => {
            map.getCanvas().style.cursor = '';
        });

        fetchProjects();
    });
}

function simplifyBaseMap() {
    if (!map) return;
    const style = map.getStyle();
    if (!style || !style.layers) return;

    style.layers.forEach(layer => {
        if (layer.type === 'background') {
            map.setPaintProperty(layer.id, 'background-color', MAP_BACKGROUND_COLOR);
        } else if (layer.type === 'symbol' || layer.id.includes('label')) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
    });
}

function updateMapData(data) {
    if (!map) return;
    map.getSource('transit-projects').setData(data);
    fitMapToData(data);
    applyMapFilters();
}

function fitMapToData(data) {
    if (!data || !data.features || !data.features.length) return;
    const bounds = new mapboxgl.LngLatBounds();
    let hasCoords = false;

    data.features.forEach(feature => {
        if (!feature.geometry) return;
        if (feature.geometry.type === 'Point') {
            bounds.extend(feature.geometry.coordinates);
            hasCoords = true;
        } else if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach(coord => bounds.extend(coord));
            hasCoords = true;
        } else if (feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach(line =>
                line.forEach(coord => bounds.extend(coord))
            );
            hasCoords = true;
        }
    });

    if (hasCoords) {
        map.fitBounds(bounds, { padding: 70, maxZoom: 11 });
    }
}

function stationCountFor(projectName) {
    return allStationFeatures.filter(f => f.properties.project_name === projectName).length;
}

function updateMastheadStats(projects) {
    const counts = { planning: 0, approved: 0, construction: 0, opened: 0, delayed: 0 };
    projects.forEach(p => {
        const s = p.properties.status;
        if (counts[s] !== undefined) counts[s] += 1;
    });
    statTotal.textContent = String(projects.length);
    statConstruction.textContent = String(counts.construction);
    statOpened.textContent = String(counts.opened);
    statPlanning.textContent = String(counts.planning + counts.approved);
}

function buildStatusChips(projects) {
    const counts = {};
    STATUS_ORDER.forEach(s => { counts[s] = 0; });
    projects.forEach(p => {
        const s = p.properties.status;
        if (counts[s] !== undefined) counts[s] += 1;
    });

    statusChips.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'status-chip is-active';
    allBtn.dataset.status = 'all';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.innerHTML = `All <span class="chip-count">${projects.length}</span>`;
    allBtn.addEventListener('click', () => {
        hiddenStatuses.clear();
        STATUS_ORDER.forEach(s => {
            // show all
        });
        syncChipUI();
        applyFilters();
    });
    statusChips.appendChild(allBtn);

    STATUS_ORDER.forEach(status => {
        if (!counts[status]) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `status-chip status-chip-${status}`;
        btn.dataset.status = status;
        btn.setAttribute('aria-pressed', 'true');
        btn.innerHTML = `${STATUS_LABELS[status] || status} <span class="chip-count">${counts[status]}</span>`;
        btn.addEventListener('click', () => {
            if (hiddenStatuses.has(status)) {
                hiddenStatuses.delete(status);
            } else {
                hiddenStatuses.add(status);
            }
            // If every status hidden, clear
            const visible = STATUS_ORDER.filter(s => counts[s] && !hiddenStatuses.has(s));
            if (!visible.length) hiddenStatuses.clear();
            syncChipUI();
            applyFilters();
        });
        statusChips.appendChild(btn);
    });
    syncChipUI();
}

function syncChipUI() {
    const chips = statusChips.querySelectorAll('.status-chip');
    const allHiddenEmpty = STATUS_ORDER.every(s => !hiddenStatuses.has(s));
    chips.forEach(chip => {
        const status = chip.dataset.status;
        if (status === 'all') {
            chip.classList.toggle('is-active', allHiddenEmpty);
            chip.setAttribute('aria-pressed', String(allHiddenEmpty));
            return;
        }
        const on = !hiddenStatuses.has(status);
        chip.classList.toggle('is-active', on);
        chip.classList.toggle('is-hidden', !on);
        chip.setAttribute('aria-pressed', String(on));
    });
}

function getFilteredProjects() {
    const q = searchQuery.trim().toLowerCase();
    let list = allProjects.filter(p => {
        const status = p.properties.status;
        if (hiddenStatuses.has(status)) return false;
        if (!q) return true;
        const hay = [
            p.properties.name,
            p.properties.agency,
            p.properties.category,
            p.properties.statusText,
            p.properties.description
        ].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
    });

    list = list.slice().sort((a, b) => {
        if (sortMode === 'status') {
            const ra = STATUS_ORDER.indexOf(a.properties.status);
            const rb = STATUS_ORDER.indexOf(b.properties.status);
            if (ra !== rb) return ra - rb;
        }
        return a.properties.name.localeCompare(b.properties.name);
    });

    return list;
}

function applyFilters() {
    const filtered = getFilteredProjects();
    renderProjectList(filtered);
    listCount.textContent = `${filtered.length} of ${allProjects.length}`;
    emptyList.classList.toggle('hidden', filtered.length > 0);
    applyMapFilters();
}

function applyMapFilters() {
    if (!map || !map.getLayer('transit-lines')) return;

    const visibleStatuses = STATUS_ORDER.filter(item => !hiddenStatuses.has(item));
    const statusExpression = visibleStatuses.length
        ? ['any', ...visibleStatuses.map(item => ['==', 'status', item])]
        : ['==', 'status', '__hidden__'];

    const focusName = activeProjectName || hoverProjectName;

    if (activeProjectName) {
        // Focus mode: active full, others dim
        map.setFilter('transit-lines', ['all', statusExpression, ['==', 'name', activeProjectName]]);
        map.setFilter('transit-lines-dim', ['all', statusExpression, ['!=', 'name', activeProjectName]]);
        map.setPaintProperty('transit-lines-dim', 'line-opacity', 0.18);
    } else {
        map.setFilter('transit-lines', statusExpression);
        map.setFilter('transit-lines-dim', ['==', 'name', '']);
    }

    const stationProjectExpression = activeProjectName
        ? ['==', 'project_name', activeProjectName]
        : ['==', 'feature_type', '__no_project_selected__'];
    map.setFilter('transit-stations', ['all', ['==', 'feature_type', 'station'], stationProjectExpression, statusExpression]);

    if (focusName) {
        map.setFilter('transit-lines-hover', ['all', ['==', 'name', focusName], statusExpression]);
    } else {
        map.setFilter('transit-lines-hover', ['==', 'name', '']);
    }
}

function setHoverProject(name) {
    if (hoverProjectName === name) return;
    hoverProjectName = name || '';
    applyMapFilters();
}

function renderProjectList(projects) {
    projectList.innerHTML = '';
    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.dataset.name = project.properties.name;
        const agency = project.properties.agency ? `<div class="project-item-agency">${escapeHtml(project.properties.agency)}</div>` : '';
        item.innerHTML = `
            <div class="project-item-header">
                <h3>${escapeHtml(project.properties.name)}</h3>
            </div>
            <div class="project-item-status status-${project.properties.status}">${escapeHtml(project.properties.statusText || project.properties.status)}</div>
            ${agency}
        `;
        item.addEventListener('click', () => {
            showProjectDetails(project.properties);
            flyToProject(project);
        });
        item.addEventListener('mouseenter', () => setHoverProject(project.properties.name));
        item.addEventListener('mouseleave', () => setHoverProject(''));
        projectList.appendChild(item);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showProjectDetails(props) {
    projectName.textContent = props.name;
    projectStatus.textContent = props.statusText || props.status;
    projectStatus.className = `status-badge status-${props.status}`;
    projectDescription.textContent = props.description || '';

    const metaParts = [];
    if (props.agency) metaParts.push(`<span class="meta-pill">${escapeHtml(props.agency)}</span>`);
    if (props.category) metaParts.push(`<span class="meta-pill">${escapeHtml(props.category)}</span>`);
    projectMeta.innerHTML = metaParts.join('');

    projectTimeline.textContent = props.timeline || '—';

    const nStations = stationCountFor(props.name);
    if (nStations > 0) {
        projectStationsField.hidden = false;
        projectStationsCount.textContent = String(nStations);
    } else {
        projectStationsField.hidden = true;
    }

    projectMilestones.innerHTML = '';
    if (props.milestones) {
        let milestones = props.milestones;
        if (typeof milestones === 'string') {
            try { milestones = JSON.parse(milestones); } catch { milestones = []; }
        }
        if (Array.isArray(milestones) && milestones.length) {
            const h4 = document.createElement('h4');
            h4.textContent = 'Key milestones';
            projectMilestones.appendChild(h4);
            const ul = document.createElement('ul');
            milestones.forEach(m => {
                const li = document.createElement('li');
                li.textContent = m;
                ul.appendChild(li);
            });
            projectMilestones.appendChild(ul);
        }
    }

    if (props.source_url) {
        projectLink.href = props.source_url;
        projectLink.classList.remove('hidden');
    } else {
        projectLink.classList.add('hidden');
    }

    listView.classList.add('hidden');
    detailsView.classList.remove('hidden');
    showSidebar();

    if (map) {
        activeProjectName = props.name;
        applyMapFilters();
    }
}

function flyToProject(project) {
    if (!map || !project.geometry) return;
    if (project.geometry.type === 'LineString') {
        const bounds = new mapboxgl.LngLatBounds();
        project.geometry.coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 80, maxZoom: 11 });
        return;
    }
    if (project.geometry.type === 'MultiLineString') {
        const bounds = new mapboxgl.LngLatBounds();
        project.geometry.coordinates.forEach(line =>
            line.forEach(coord => bounds.extend(coord))
        );
        map.fitBounds(bounds, { padding: 80, maxZoom: 11 });
        return;
    }

    const coords = project.geometry.coordinates;
    map.flyTo({ center: coords, zoom: 12, essential: true });
}

function resetOverview() {
    activeProjectName = '';
    hoverProjectName = '';
    applyMapFilters();
    if (map && fullMapCollection.features.length) {
        fitMapToData(fullMapCollection);
    } else if (map) {
        map.flyTo({ center: OVERVIEW.center, zoom: OVERVIEW.zoom, essential: true });
    }
}

projectSearch.addEventListener('input', () => {
    searchQuery = projectSearch.value;
    applyFilters();
});

sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    applyFilters();
});

resetViewBtn.addEventListener('click', () => {
    resetOverview();
    projectName.textContent = DEFAULT_TITLE;
    listView.classList.remove('hidden');
    detailsView.classList.add('hidden');
});

backBtn.addEventListener('click', () => {
    projectName.textContent = DEFAULT_TITLE;
    listView.classList.remove('hidden');
    detailsView.classList.add('hidden');
    if (map) {
        activeProjectName = '';
        applyMapFilters();
        fitMapToData(fullMapCollection);
    }
});

closeBtn.addEventListener('click', () => {
    hideSidebar();
    if (map) {
        activeProjectName = '';
        applyMapFilters();
    }
});

openBtn.addEventListener('click', () => {
    showSidebar();
});
