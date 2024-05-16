import axios from 'axios';
import fs from 'fs';
import { regions } from './regions.js';


async function fetchPOIS() {
    const url = 'https://mapzs.pzs.si/api/pois/track/ids';
    try {
        const response = await axios.get(url);
        const ids = response.data.map(item => item.id); // Assuming response.data is an array of objects
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


async function fetchDetailedData(id) {
    const url = `https://mapzs.pzs.si/api/tracks/${id}/detailed`;
    try {
        const response = await axios.get(url);

        const name = response.data.name;
        const abstractDescription = response.data.abstractDescription;
        return { name, abstractDescription };
    } catch (error) {
        console.error(`Error fetching data for ID ${id}:`, error);
        return null;
    }
}

async function main() {
    const detailedDataArray = [];
    let i = 0;
    const initialData = await fetchPOIS();

    if (initialData) {
        for (const item of initialData) {
            const routes = await fetchRoutes(item.id);
            for (const route of routes) {
                if (route.id && i < 100) { // Check for ID and ensure limit of 100
                    const detailedData = await fetchDetailedData(route.id);
                    if (detailedData) {
                        detailedDataArray.push(detailedData);
                    }
                    i++;
                    if (i >= 100) break;
                }
            }
            if (i >= 100) break;
        }
    }


    // Writing the array of objects to a file
    fs.writeFileSync('output.json', JSON.stringify(detailedDataArray, null, 2), 'utf8');
    console.log('Data has been written to output.json');
}

main();