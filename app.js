const detailSheet = document.getElementById('detail-sheet');
const projectName = document.getElementById('project-name');
const projectStatus = document.getElementById('project-status');
const projectDescription = document.getElementById('project-description');
const projectMilestones = document.getElementById('project-milestones');
const projectTimeline = document.getElementById('project-timeline');
const projectMeta = document.getElementById('project-meta');
const projectStationsField = document.getElementById('project-stations-field');
const projectStationsCount = document.getElementById('project-stations-count');
const projectLink = document.getElementById('project-link');
const closeDetailBtn = document.getElementById('close-detail');
const clearSelectionBtn = document.getElementById('clear-selection');
const statusChips = document.getElementById('status-chips');
const projectSearch = document.getElementById('project-search');
const loadingBanner = document.getElementById('loading');
const resetViewBtn = document.getElementById('reset-view');
const hoverCard = document.getElementById('hover-card');
const viewportStrip = document.getElementById('viewport-strip');
const viewportChips = document.getElementById('viewport-chips');
const mapHint = document.getElementById('map-hint');
const statTotal = document.getElementById('stat-total');

const PUBLIC_MAPBOX_TOKEN = 'pk.eyJ1Ijoicnlhbmhhbm5hIiwiYSI6ImNtbXk3MTkyYTM5ZHQyb3EzOWZnczV2NWUifQ.1ipGd2Oc07tCfLY7I_Fb1w';
const STATUS_ORDER = ['planning', 'approved', 'construction', 'opened', 'delayed'];
const STATUS_LABELS = {
    planning: 'Plan',
    approved: 'Approved',
    construction: 'Build',
    opened: 'Open',
    delayed: 'Delayed'
};
const STATUS_LABELS_FULL = {
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
let labelCollection = { type: 'FeatureCollection', features: [] };
/** null = all statuses */
let selectedStatus = null;
let activeProjectName = '';
let hoverProjectName = '';
let searchQuery = '';
let viewportUpdateTimer = null;

function isProjectFeature(feature) {
    return feature.geometry && ['LineString', 'MultiLineString'].includes(feature.geometry.type);
}

function isStationFeature(feature) {
    return feature.properties?.feature_type === 'station' && feature.geometry?.type === 'Point';
}

function featureCentroid(feature) {
    const g = feature.geometry;
    if (!g) return null;
    const pts = [];
    const walk = (c) => {
        if (!c || !c.length) return;
        if (typeof c[0] === 'number') {
            pts.push(c);
            return;
        }
        c.forEach(walk);
    };
    walk(g.coordinates);
    if (!pts.length) return null;
    let lon = 0;
    let lat = 0;
    pts.forEach(p => {
        lon += p[0];
        lat += p[1];
    });
    return [lon / pts.length, lat / pts.length];
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function stationCountFor(projectName) {
    return allStationFeatures.filter(f => f.properties.project_name === projectName).length;
}

function buildLabelCollection(projects) {
    return {
        type: 'FeatureCollection',
        features: projects.map(p => {
            const c = featureCentroid(p);
            if (!c) return null;
            return {
                type: 'Feature',
                properties: {
                    name: p.properties.name,
                    status: p.properties.status,
                    statusText: p.properties.statusText || p.properties.status,
                    color: p.properties.color || '#f28c28'
                },
                geometry: { type: 'Point', coordinates: c }
            };
        }).filter(Boolean)
    };
}

initializeMap(PUBLIC_MAPBOX_TOKEN);

async function fetchProjects() {
    loadingBanner.classList.remove('hidden');
    try {
        const responses = await Promise.all([
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
        const collections = await Promise.all(responses.map(r => r.json()));
        const features = collections.flatMap(c => c.features || []);

        const projectFeatures = features.filter(feature =>
            isProjectFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.name)
        );
        const stationFeatures = features.filter(feature =>
            isStationFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.project_name)
        );
        allProjects = projectFeatures;
        allStationFeatures = stationFeatures;
        fullMapCollection = { type: 'FeatureCollection', features: [...projectFeatures, ...stationFeatures] };
        labelCollection = buildLabelCollection(projectFeatures);
        updateMastheadStats(allProjects);
        buildStatusChips(allProjects);
        applyFilters({ fit: true });
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

    map.dragRotate.disable();

    map.on('load', () => {
        simplifyBaseMap();

        map.addSource('transit-projects', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
        });
        map.addSource('project-labels', {
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
                'line-opacity': 0.15,
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
                'line-width': [
                    'interpolate', ['linear'], ['zoom'],
                    3, 2.5,
                    8, 4,
                    12, 6
                ],
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
                'line-width': 9,
                'line-opacity': 0.4
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

        map.addLayer({
            id: 'project-labels',
            type: 'symbol',
            source: 'project-labels',
            minzoom: 5,
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
                'text-size': [
                    'interpolate', ['linear'], ['zoom'],
                    5, 10,
                    10, 13
                ],
                'text-offset': [0, 1.1],
                'text-anchor': 'top',
                'text-max-width': 14,
                'text-optional': true,
                'text-allow-overlap': false,
                'text-ignore-placement': false
            },
            paint: {
                'text-color': '#111111',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1.4
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
            const name = e.features[0].properties.name;
            setHoverProject(name);
            showHoverCard(e.features[0].properties, e.point);
        });

        map.on('mouseleave', 'transit-lines', () => {
            map.getCanvas().style.cursor = '';
            setHoverProject('');
            hideHoverCard();
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

        map.on('moveend', scheduleViewportUpdate);
        map.on('zoomend', scheduleViewportUpdate);

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

function updateMastheadStats(projects) {
    statTotal.textContent = String(projects.length);
}

function buildStatusChips(projects) {
    const counts = {};
    STATUS_ORDER.forEach(s => { counts[s] = 0; });
    projects.forEach(p => {
        const s = p.properties.status;
        if (counts[s] !== undefined) counts[s] += 1;
    });

    statusChips.innerHTML = '';
    const makeChip = (key, label, count) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `status-chip${key !== 'all' ? ` status-chip-${key}` : ''}`;
        btn.dataset.status = key;
        btn.title = key === 'all' ? 'All projects' : (STATUS_LABELS_FULL[key] || label);
        // Dot doubles as the color key — no separate legend needed
        const swatch = key === 'all'
            ? ''
            : `<span class="chip-swatch status-${key}-dot" aria-hidden="true"></span>`;
        btn.innerHTML = `${swatch}<span class="chip-label">${label}</span><span class="chip-count">${count}</span>`;
        btn.addEventListener('click', () => {
            selectedStatus = key === 'all' ? null : key;
            syncChipUI();
            applyFilters({ fit: true });
        });
        statusChips.appendChild(btn);
    };

    makeChip('all', 'All', projects.length);
    STATUS_ORDER.forEach(status => {
        if (!counts[status]) return;
        makeChip(status, STATUS_LABELS[status] || status, counts[status]);
    });
    syncChipUI();
}

function syncChipUI() {
    statusChips.querySelectorAll('.status-chip').forEach(chip => {
        const key = chip.dataset.status;
        const active = selectedStatus === null ? key === 'all' : key === selectedStatus;
        chip.classList.toggle('is-active', active);
        chip.setAttribute('aria-pressed', String(active));
    });
}

function getFilteredProjects() {
    const q = searchQuery.trim().toLowerCase();
    return allProjects.filter(p => {
        if (selectedStatus && p.properties.status !== selectedStatus) return false;
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
}

function applyFilters({ fit = false } = {}) {
    const filtered = getFilteredProjects();
    const names = new Set(filtered.map(p => p.properties.name));
    const features = [
        ...filtered,
        ...allStationFeatures.filter(s => names.has(s.properties.project_name))
    ];
    const collection = { type: 'FeatureCollection', features };
    const labels = buildLabelCollection(filtered);

    if (map && map.getSource('transit-projects')) {
        map.getSource('transit-projects').setData(collection);
        map.getSource('project-labels').setData(labels);
        if (fit && !activeProjectName) {
            fitMapToData({ type: 'FeatureCollection', features: filtered });
        }
    }
    applyMapFilters();
    updateViewportStrip();
}

function fitMapToData(data) {
    if (!map || !data?.features?.length) return;
    const bounds = new mapboxgl.LngLatBounds();
    let hasCoords = false;
    data.features.forEach(feature => {
        if (!feature.geometry || feature.properties?.feature_type === 'station') return;
        if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach(coord => bounds.extend(coord));
            hasCoords = true;
        } else if (feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach(line => line.forEach(coord => bounds.extend(coord)));
            hasCoords = true;
        }
    });
    if (hasCoords) {
        map.fitBounds(bounds, { padding: 80, maxZoom: 11, duration: 600 });
    }
}

function applyMapFilters() {
    if (!map || !map.getLayer('transit-lines')) return;

    const statusExpression = selectedStatus
        ? ['==', 'status', selectedStatus]
        : ['any', ...STATUS_ORDER.map(item => ['==', 'status', item])];

    // Search already filtered source data; status still applied for safety
    if (activeProjectName) {
        map.setFilter('transit-lines', ['all', statusExpression, ['==', 'name', activeProjectName]]);
        map.setFilter('transit-lines-dim', ['all', statusExpression, ['!=', 'name', activeProjectName]]);
    } else {
        map.setFilter('transit-lines', statusExpression);
        map.setFilter('transit-lines-dim', ['==', 'name', '']);
    }

    const stationProjectExpression = activeProjectName
        ? ['==', 'project_name', activeProjectName]
        : ['==', 'feature_type', '__no_project_selected__'];
    map.setFilter('transit-stations', [
        'all',
        ['==', 'feature_type', 'station'],
        stationProjectExpression,
        statusExpression
    ]);

    const focusName = activeProjectName || hoverProjectName;
    map.setFilter(
        'transit-lines-hover',
        focusName ? ['all', ['==', 'name', focusName], statusExpression] : ['==', 'name', '']
    );

    if (map.getLayer('project-labels')) {
        map.setFilter('project-labels', statusExpression);
        map.setLayoutProperty(
            'project-labels',
            'visibility',
            activeProjectName ? 'none' : 'visible'
        );
    }
}

function setHoverProject(name) {
    if (hoverProjectName === name) return;
    hoverProjectName = name || '';
    applyMapFilters();
}

function showHoverCard(props, point) {
    if (activeProjectName) {
        hideHoverCard();
        return;
    }
    const status = props.statusText || STATUS_LABELS_FULL[props.status] || props.status;
    hoverCard.innerHTML = `
        <div class="hover-card-name">${escapeHtml(props.name)}</div>
        <div class="hover-card-status status-${props.status}">${escapeHtml(status)}</div>
    `;
    hoverCard.classList.remove('hidden');
    hoverCard.style.left = `${point.x + 14}px`;
    hoverCard.style.top = `${point.y + 14}px`;
}

function hideHoverCard() {
    hoverCard.classList.add('hidden');
}

function scheduleViewportUpdate() {
    clearTimeout(viewportUpdateTimer);
    viewportUpdateTimer = setTimeout(updateViewportStrip, 120);
}

function updateViewportStrip() {
    if (!map || activeProjectName) {
        viewportStrip.classList.add('hidden');
        return;
    }
    const zoom = map.getZoom();
    if (zoom < 4.2) {
        viewportStrip.classList.add('hidden');
        mapHint.classList.remove('hidden');
        return;
    }
    mapHint.classList.add('hidden');

    const bounds = map.getBounds();
    const visible = getFilteredProjects().filter(p => {
        const c = featureCentroid(p);
        if (!c) return false;
        return bounds.contains(c);
    }).slice(0, 12);

    if (!visible.length) {
        viewportStrip.classList.add('hidden');
        return;
    }

    viewportChips.innerHTML = '';
    visible.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'viewport-chip';
        btn.textContent = p.properties.name;
        btn.addEventListener('click', () => {
            showProjectDetails(p.properties);
            flyToProject(p);
        });
        btn.addEventListener('mouseenter', () => setHoverProject(p.properties.name));
        btn.addEventListener('mouseleave', () => setHoverProject(''));
        viewportChips.appendChild(btn);
    });
    viewportStrip.classList.remove('hidden');
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

    activeProjectName = props.name;
    hideHoverCard();
    detailSheet.classList.remove('hidden');
    viewportStrip.classList.add('hidden');
    mapHint.classList.add('hidden');
    applyMapFilters();
}

function closeDetail() {
    activeProjectName = '';
    detailSheet.classList.add('hidden');
    applyMapFilters();
    updateViewportStrip();
    if (map.getZoom() < 4.2) mapHint.classList.remove('hidden');
}

function flyToProject(project) {
    if (!map || !project.geometry) return;
    if (project.geometry.type === 'LineString') {
        const bounds = new mapboxgl.LngLatBounds();
        project.geometry.coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: { top: 100, bottom: 220, left: 40, right: 40 }, maxZoom: 12 });
        return;
    }
    if (project.geometry.type === 'MultiLineString') {
        const bounds = new mapboxgl.LngLatBounds();
        project.geometry.coordinates.forEach(line => line.forEach(coord => bounds.extend(coord)));
        map.fitBounds(bounds, { padding: { top: 100, bottom: 220, left: 40, right: 40 }, maxZoom: 12 });
        return;
    }
    map.flyTo({ center: project.geometry.coordinates, zoom: 12, essential: true });
}

function resetOverview() {
    closeDetail();
    selectedStatus = null;
    searchQuery = '';
    projectSearch.value = '';
    syncChipUI();
    applyFilters({ fit: true });
}

projectSearch.addEventListener('input', () => {
    searchQuery = projectSearch.value;
    applyFilters({ fit: false });
});

resetViewBtn.addEventListener('click', resetOverview);
closeDetailBtn.addEventListener('click', closeDetail);
clearSelectionBtn.addEventListener('click', closeDetail);
