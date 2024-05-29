import axios from 'axios';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqohcrtvvbaaofvxfcaf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxb2hjcnR2dmJhYW9mdnhmY2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMjg2NjEsImV4cCI6MjAzMDkwNDY2MX0.n125xdxjq8SdLrBYcGWBIGd5XpZzWT8hIrsyvw71_kM';
const supabase = createClient(supabaseUrl, supabaseKey);



async function uploadDataToSupabase(filePath) {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);


        for (const record of jsonData) {

            const { data, error } = await supabase
                .from('ROUTES')
                .insert([record]);

            if (error) {
                throw error;
            } else {
                console.log('Upload successful:', data);
            }
        }
    } catch (error) {
        console.error('Error uploading data:', error);
    }
}

async function fetchPOINTS() {
    const url = 'https://mapzs.pzs.si/api/tracks/points';
    try {
        const response = await axios.get(url);
        // 1 planinske poti
        // 2 turistična pot
        // 
        const filteredData = response.data.filter(item => [1, 2, 3].includes(item.trailType));
        const ids = filteredData.map(item => item.id);
        console.log('Fetched IDs:', ids);
        return ids;
    } catch (error) {
        console.error('Error fetching initial data:', error);
        return null;
    }
}

async function fetchRoutes(id) {
    const url = `https://mapzs.pzs.si/api/tracks/poi/${id}`;
    try {
        const response = await axios.get(url);
        console.log('Fetched routes for ID:', id, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching routes for ID ${id}:`, error);
        return [];
    }
}


async function fetchDetailedPointData(id) {
    const url = `https://mapzs.pzs.si/api/tracks/${id}/detailed`;
    try {
        const response = await axios.get(url);

        const name = response.data.name;

        let abstractDescription = response.data.abstractDescription;
        let distance = response.data.distance;
        let duration = response.data.duration;
        let durationReverse = response.data.durationReverse;
        let id = response.data.id;
        let cumulativeElevationGain = response.data.cumulativeElevationGain;
        let cumulativeElevationLoss = response.data.cumulativeElevationLoss;
        let coverImage = response.data.coverImage;
        let hasSafetyGear = response.data.hasSafetyGear;
        let dificulty = response.data.dificulty;
        let trailType = response.data.trailType;
        let startPoint = response.data.startPoint;
        let finishPoint = response.data.finishPoint;
        let owner = response.data.owner;
        let pois = response.data.pois;
        let coordinates = response.data.elevationProfile.coordinates;
        let territory = response.data.territory;

        return {
            id,
            name,
            abstractDescription,
            distance,
            duration,
            durationReverse,
            cumulativeElevationGain,
            cumulativeElevationLoss,
            coverImage,
            hasSafetyGear,
            dificulty,
            trailType,
            startPoint,
            finishPoint,
            owner,
            pois,
            coordinates,
            territory
        };

    } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
        return null;
    }
}

async function getData(limit = 400) {
    const detailedDataArray = [];
    const initialData = await fetchPOINTS();
    for (let i = 0; i < Math.min(initialData.length, limit); i++) {
        const detailedData = await fetchDetailedPointData(initialData[i]);
        if (detailedData) detailedDataArray.push(detailedData);
    }
    fs.writeFileSync('output.json', JSON.stringify(detailedDataArray, null, 2), 'utf8');
    console.log('Data has been written to output.json');
}


async function main() {
    const args = process.argv.slice(2);
    const limit = parseInt(args[1], 10) || 400;
    switch (args[0]) {
        case 'fetch':
            await getData(limit)
            break;

        case 'upload':
            console.log('Uploading data...');
            await uploadDataToSupabase('output.json');
            break;
        default:
            console.log('No or invalid argument provided. Use "fetch", "write", or "upload".');
    }
}

main();