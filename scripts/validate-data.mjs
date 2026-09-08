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
const allowedSourceSupports = new Set(['project', 'status', 'timeline', 'description', 'geometry', 'stations']);
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
    const sources = feature.properties.sources;
    if (!Array.isArray(sources) || sources.length === 0) {
        throw new Error(`${label} must have a non-empty properties.sources array`);
    }
    if (feature.properties.source_url !== sources[0]?.url) {
        throw new Error(`${label} source_url must match the first source URL`);
    }
    const sourceUrls = new Set();
    for (const [sourceIndex, source] of sources.entries()) {
        const sourceLabel = `${label} source ${sourceIndex + 1}`;
        if (!source || typeof source !== 'object' || Array.isArray(source)) {
            throw new Error(`${sourceLabel} must be an object`);
        }
        requireProperty({ properties: source }, 'url', sourceLabel);
        requireProperty({ properties: source }, 'language', sourceLabel);
        let sourceUrl;
        try {
            sourceUrl = new URL(source.url);
        } catch {
            sourceUrl = null;
        }
        if (!sourceUrl || !['http:', 'https:'].includes(sourceUrl.protocol)) {
            throw new Error(`${sourceLabel} must use an http(s) URL`);
        }
        if (typeof source.language !== 'string') throw new Error(`${sourceLabel} language must be a string`);
        if (sourceUrls.has(source.url)) throw new Error(`${sourceLabel} duplicates a source URL`);
        sourceUrls.add(source.url);
        if (!Array.isArray(source.supports) || source.supports.length === 0) {
            throw new Error(`${sourceLabel} must have a non-empty supports array`);
        }
        for (const claim of source.supports) {
            if (!allowedSourceSupports.has(claim)) {
                throw new Error(`${sourceLabel} has unsupported claim ${claim}`);
            }
        }
        for (const property of ['title', 'publisher']) {
            if (source[property] !== undefined && (typeof source[property] !== 'string' || source[property] === '')) {
                throw new Error(`${sourceLabel} ${property} must be a non-empty string`);
            }
        }
        if (source.accessed_at !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(source.accessed_at)) {
            throw new Error(`${sourceLabel} accessed_at must use YYYY-MM-DD`);
        }
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
const sourceRecords = projects.features.flatMap(feature => feature.properties.sources);
console.log(JSON.stringify({
    projects: projects.features.length,
    publishedProjects: publishedProjects.length,
    stations: stations.features.length,
    publishedStations: publishedStations.length,
    sourceRecords: sourceRecords.length,
    uniqueSourceUrls: new Set(sourceRecords.map(source => source.url)).size,
    projectsWithMultipleSources: projects.features.filter(feature => feature.properties.sources.length > 1).length,
    regions: [...new Set(publishedProjects.map(feature => feature.properties.region))].sort()
}, null, 2));
