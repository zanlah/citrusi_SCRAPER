import axios from 'axios';
import fs from 'fs';
import { regions } from './regions.js';


async function fetchPOINTS() {
    const url = 'https://mapzs.pzs.si/api/tracks/points';
    try {
        const response = await axios.get(url);
        const ids = response.data.map(item => item.id);
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

        const abstractDescription = response.data.abstractDescription;
        const distance = response.data.distance;
        const duration = response.data.duration;
        return { name, abstractDescription, distance, duration };
    } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
        return null;
    }
}

async function main() {
    const detailedDataArray = [];
    let i = 0;
    const initialData = await fetchPOINTS();
    console.log('Starting to process initial data...');
    if (initialData) {
        console.log('Initial Data:', initialData); //
        for (const item of initialData) {
            console.log('Current Item:', item);
            //const routes = await fetchRoutes(item.id);
            //for (const route of routes) {
            if (item && (i < 200)) {
                console.log('Fetching data for ID:', item)
                const detailedData = await fetchDetailedPointData(item);
                if (detailedData) {
                    detailedDataArray.push(detailedData);
                }
                i++;
                if (i >= 200) break;
            }
            // }
            if (i >= 200) break;
        }
    }



    fs.writeFileSync('output.json', JSON.stringify(detailedDataArray, null, 2), 'utf8');
    console.log('Data has been written to output.json');
}

main();