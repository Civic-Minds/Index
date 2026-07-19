// DOM Elements
const sidebar = document.getElementById('sidebar');
const projectName = document.getElementById('project-name');
const projectList = document.getElementById('project-list');
const detailsView = document.getElementById('project-details-view');
const projectStatus = document.getElementById('project-status');
const projectDescription = document.getElementById('project-description');
const projectMilestones = document.getElementById('project-milestones');
const projectTimeline = document.getElementById('project-timeline');
const projectLink = document.getElementById('project-link');
const closeBtn = document.getElementById('close-sidebar');
const openBtn = document.getElementById('open-sidebar');
const backBtn = document.getElementById('back-to-list');

const statusFilter = document.getElementById('status-filter');
const filterContainer = document.getElementById('filter-container');
const statusToggles = document.querySelectorAll('.status-toggle');

const tokenPrompt = document.getElementById('token-prompt');
const tokenInput = document.getElementById('token-input');
const tokenSubmit = document.getElementById('token-submit');

const DEFAULT_TITLE = 'PROJECTS';
const PUBLIC_MAPBOX_TOKEN = 'pk.eyJ1Ijoicnlhbmhhbm5hIiwiYSI6ImNtbXk3MTkyYTM5ZHQyb3EzOWZnczV2NWUifQ.1ipGd2Oc07tCfLY7I_Fb1w';
const STATUS_ORDER = ['planning', 'approved', 'construction', 'opened', 'delayed'];
const ACTIVE_PROJECT_NAMES = new Set(['Eglinton Crosstown LRT', 'Finch West LRT', 'Hazel McCallion Line', 'Hamilton B-Line LRT', 'Ontario Line', 'Scarborough Subway Extension', 'Yonge North Subway Extension', 'Durham-Scarborough BRT', 'Eglinton Crosstown West Extension', 'ION Stage 2', 'Eglinton East LRT', 'Sheppard East LRT', 'Waterfront West LRT', 'Waterfront East LRT', 'Hamilton A-Line', 'Finch West LRT Extension', 'Brampton Queen Street BRT / LRT', 'Downtown Mississauga Transitway', 'Bailey Avenue BRT', 'East London Link', 'Wellington Gateway', 'NFTA Metro Transit Expansion', 'O-Train Stage 2 West Extension', 'REM Anse-à-l’Orme Branch', 'Montréal Blue Line Extension', 'TramCité', 'Broadway Subway Extension', 'Green Line Phase 1', 'Green Line Phase 2', 'O-Train Stage 2 East Extension', 'O-Train Stage 2 South Extension', 'Surrey–Langley SkyTrain', 'REM South Shore', 'REM Deux-Montagnes Branch', 'Maryland Purple Line', 'Valley Line West LRT', 'Federal Way Link Extension', 'D Line Extension Section 1', 'D Line Extension Section 2', 'D Line Extension Section 3', 'METRO Green Line Extension', 'South Central Extension / Downtown Hub', 'REM Airport Branch']);
const MAP_BACKGROUND_COLOR = '#ffffff';

let map;
let allProjects = [];
const hiddenStatuses = new Set();
let activeProjectName = '';

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

// Check for saved token
const savedToken = localStorage.getItem('mapbox_token');
if (savedToken || PUBLIC_MAPBOX_TOKEN) {
    initializeMap(savedToken || PUBLIC_MAPBOX_TOKEN);
}

tokenSubmit.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (token) {
        localStorage.setItem('mapbox_token', token);
        initializeMap(token);
    } else {
        alert('Please enter a valid Mapbox token.');
    }
});

async function fetchProjects() {
    try {
        const [response, supplementalResponse, nftaResponse, londonResponse, ottawaResponse, remResponse, montrealResponse, quebecResponse, vancouverResponse, marylandResponse, edmontonResponse, seattleResponse, laResponse, minneapolisResponse, phoenixResponse] = await Promise.all([
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
            fetch('data/phoenix-projects.json')
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
        const features = [...data.features, ...supplemental.features, ...nfta.features, ...london.features, ...ottawa.features, ...rem.features, ...montreal.features, ...quebec.features, ...vancouver.features, ...maryland.features, ...edmonton.features, ...seattle.features, ...la.features, ...minneapolis.features, ...phoenix.features];
        const projectFeatures = features.filter(feature =>
            isProjectFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.name)
        );
        const stationFeatures = features.filter(feature =>
            isStationFeature(feature) && ACTIVE_PROJECT_NAMES.has(feature.properties.project_name)
        );
        allProjects = projectFeatures;
        populateFilters(allProjects);
        renderProjectList(allProjects);
        updateMapData({ ...data, features: [...projectFeatures, ...stationFeatures] });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

function initializeMap(token) {
    mapboxgl.accessToken = token;
    tokenPrompt.style.display = 'none';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-98.5, 39.5], // North America
        zoom: 3,
        attributionControl: false
    });

    // Disable all navigation interactions for a "static graphic" feel
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    map.on('load', () => {
        simplifyBaseMap();

        // Show UI elements
        sidebar.classList.remove('hidden');
        document.getElementById('legend').classList.remove('hidden');
        showSidebar();
        map.addSource('transit-projects', {
            'type': 'geojson',
            'data': { type: 'FeatureCollection', features: [] }
        });

        // Line layers
        map.addLayer({
            'id': 'transit-lines',
            'type': 'line',
            'source': 'transit-projects',
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': {
                'line-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'line-width': 4,
                'line-opacity': 1,
                'line-dasharray': [1.2, 2.2]
            }
        });

        map.addLayer({
            'id': 'transit-lines-hover',
            'type': 'line',
            'source': 'transit-projects',
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': {
                'line-color': ['coalesce', ['get', 'color'], '#f28c28'],
                'line-width': 7,
                'line-opacity': 0.25
            },
            'filter': ['==', 'name', '']
        });

        map.addLayer({
            'id': 'transit-stations',
            'type': 'circle',
            'source': 'transit-projects',
            'filter': ['==', 'feature_type', 'station'],
            'paint': {
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

        map.on('mouseenter', 'transit-lines', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'transit-lines', () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('click', 'transit-stations', (e) => {
            const station = e.features[0].properties;
            const project = allProjects.find(item => item.properties.name === station.project_name);
            if (project) showProjectDetails(project.properties);
        });

        map.on('mouseenter', 'transit-stations', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'transit-stations', () => {
            map.getCanvas().style.cursor = '';
        });

        // Load project data only after its source and layers are ready.
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
    applyFilters();
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

function populateFilters(projects) {
    const statusMap = new Map();
    projects.forEach(project => {
        const status = project.properties.status;
        if (status) {
            statusMap.set(status, project.properties.statusText || status);
        }
    });

    const sortedStatuses = Array.from(statusMap.keys()).sort((a, b) => {
        const rankA = STATUS_ORDER.includes(a) ? STATUS_ORDER.indexOf(a) : Number.MAX_SAFE_INTEGER;
        const rankB = STATUS_ORDER.includes(b) ? STATUS_ORDER.indexOf(b) : Number.MAX_SAFE_INTEGER;
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b);
    });

    statusFilter.innerHTML = '<option value="all">All Statuses</option>';
    sortedStatuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = statusMap.get(status);
        statusFilter.appendChild(option);
    });
}

function renderProjectList(projects) {
    projectList.innerHTML = '';
    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div class="project-item-header">
                <h3>${project.properties.name}</h3>
            </div>
            <div class="project-item-status status-${project.properties.status}">${project.properties.statusText}</div>
        `;
        item.addEventListener('click', () => {
            showProjectDetails(project.properties);
            flyToProject(project);
        });
        projectList.appendChild(item);
    });
}

function showProjectDetails(props) {
    projectName.textContent = props.name.toUpperCase();
    projectStatus.textContent = (props.statusText || props.status).toUpperCase();
    projectStatus.className = `status-badge status-${props.status}`;
    projectDescription.textContent = props.description;
    projectTimeline.innerHTML = `<strong>TIMELINE:</strong> ${props.timeline}`;

    // Handle milestones
    projectMilestones.innerHTML = '';
    if (props.milestones) {
        let milestones = props.milestones;
        if (typeof milestones === 'string') milestones = JSON.parse(milestones);

        const h4 = document.createElement('h4');
        h4.textContent = 'KEY MILESTONES';
        projectMilestones.appendChild(h4);

        const ul = document.createElement('ul');
        milestones.forEach(m => {
            const li = document.createElement('li');
            li.textContent = m;
            ul.appendChild(li);
        });
        projectMilestones.appendChild(ul);
    }

    // Handle link
    if (props.source_url) {
        projectLink.href = props.source_url;
        projectLink.classList.remove('hidden');
    } else {
        projectLink.classList.add('hidden');
    }

    projectList.classList.add('hidden');
    filterContainer.classList.add('hidden');
    detailsView.classList.remove('hidden');
    showSidebar();

    if (map) {
        activeProjectName = props.name;
        applyFilters();
    }
}

function applyFilters() {
    const status = statusFilter.value;

    const filtered = allProjects.filter(p => {
        const projectStatus = p.properties.status;
        const selectedStatusMatch = status === 'all' || projectStatus === status;
        return selectedStatusMatch && !hiddenStatuses.has(projectStatus);
    });

    renderProjectList(filtered);

    const visibleStatuses = STATUS_ORDER.filter(item => !hiddenStatuses.has(item));
    const statusExpression = status !== 'all'
        ? (hiddenStatuses.has(status) ? ['==', 'status', '__hidden__'] : ['==', 'status', status])
        : visibleStatuses.length
            ? ['any', ...visibleStatuses.map(item => ['==', 'status', item])]
            : ['==', 'status', '__hidden__'];

    // Update map visibility via the same status state as the project list.
    if (map) {
        map.setFilter('transit-lines', statusExpression);
        const stationProjectExpression = activeProjectName
            ? ['==', 'project_name', activeProjectName]
            : ['==', 'feature_type', '__no_project_selected__'];
        map.setFilter('transit-stations', ['all', ['==', 'feature_type', 'station'], stationProjectExpression, statusExpression]);
        map.setFilter('transit-lines-hover', ['all', ['==', 'name', activeProjectName], statusExpression]);
    }
}

function flyToProject(project) {
    if (!map) return;
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

statusFilter.addEventListener('change', applyFilters);

statusToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const status = toggle.dataset.status;
        if (hiddenStatuses.has(status)) {
            hiddenStatuses.delete(status);
        } else {
            hiddenStatuses.add(status);
        }

        const isVisible = !hiddenStatuses.has(status);
        toggle.setAttribute('aria-pressed', String(isVisible));
        toggle.classList.toggle('is-hidden', !isVisible);
        applyFilters();
    });
});

backBtn.addEventListener('click', () => {
    projectName.textContent = DEFAULT_TITLE;
    projectList.classList.remove('hidden');
    filterContainer.classList.remove('hidden');
    detailsView.classList.add('hidden');
    if (map) {
        activeProjectName = '';
        applyFilters();
    }
});

closeBtn.addEventListener('click', () => {
    hideSidebar();
    if (map) {
        activeProjectName = '';
        applyFilters();
    }
});

openBtn.addEventListener('click', () => {
    showSidebar();
});
