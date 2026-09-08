import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function readCollection(filename) {
    const contents = await readFile(path.join(root, 'data', filename), 'utf8');
    return JSON.parse(contents);
}

function validateCollection(collection, label) {
    if (collection?.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
        throw new Error(`${label} must be a GeoJSON FeatureCollection`);
    }
}

function requireProperty(feature, property, label) {
    if (feature.properties?.[property] === undefined || feature.properties[property] === '') {
        throw new Error(`${label} is missing properties.${property}`);
    }
}

const projects = await readCollection('projects.geojson');
const stations = await readCollection('stations.geojson');
validateCollection(projects, 'projects.geojson');
validateCollection(stations, 'stations.geojson');

const projectIds = new Set();
const projectNames = new Set();
const allowedStatuses = new Set(['planning', 'design', 'approved', 'construction', 'opened', 'delayed']);
for (const [index, feature] of projects.features.entries()) {
    const label = `projects.geojson feature ${index + 1}`;
    if (!['LineString', 'MultiLineString'].includes(feature.geometry?.type)) {
        throw new Error(`${label} must have LineString or MultiLineString geometry`);
    }
    for (const property of ['id', 'name', 'region', 'status', 'source_url', 'geometry_note']) {
        requireProperty(feature, property, label);
    }
    if (!allowedStatuses.has(feature.properties.status)) {
        throw new Error(`${label} has unsupported status ${feature.properties.status}`);
    }
    if (typeof feature.properties.published !== 'boolean') {
        throw new Error(`${label} must have boolean properties.published`);
    }
    if (projectIds.has(feature.properties.id)) throw new Error(`Duplicate project id: ${feature.properties.id}`);
    if (projectNames.has(feature.properties.name)) throw new Error(`Duplicate project name: ${feature.properties.name}`);
    projectIds.add(feature.properties.id);
    projectNames.add(feature.properties.name);
}

const stationIds = new Set();
for (const [index, feature] of stations.features.entries()) {
    const label = `stations.geojson feature ${index + 1}`;
    if (feature.geometry?.type !== 'Point') throw new Error(`${label} must have Point geometry`);
    for (const property of ['id', 'project_id', 'project_name', 'feature_type']) {
        requireProperty(feature, property, label);
    }
    if (feature.properties.feature_type !== 'station') throw new Error(`${label} must have feature_type station`);
    if (typeof feature.properties.published !== 'boolean') {
        throw new Error(`${label} must have boolean properties.published`);
    }
    if (!projectIds.has(feature.properties.project_id)) {
        throw new Error(`${label} references missing project ${feature.properties.project_id}`);
    }
    if (stationIds.has(feature.properties.id)) throw new Error(`Duplicate station id: ${feature.properties.id}`);
    stationIds.add(feature.properties.id);
}

const publishedProjects = projects.features.filter(feature => feature.properties.published);
const publishedStations = stations.features.filter(feature => feature.properties.published);
console.log(JSON.stringify({
    projects: projects.features.length,
    publishedProjects: publishedProjects.length,
    stations: stations.features.length,
    publishedStations: publishedStations.length,
    regions: [...new Set(publishedProjects.map(feature => feature.properties.region))].sort()
}, null, 2));
