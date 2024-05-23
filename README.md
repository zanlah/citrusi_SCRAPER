# Web Scraper

## Description
This web scraper is made for our university project, it fetches data and uploads it directly to a Supabase PostREST database.

## Setup
Ensure Node.js is installed on your system and that your Supabase credentials are configured.

## Usage

### Fetching Data
To fetch data and store it in 'output.json', run:
> node .\scraper.js fetch n
Replace 'n' with the number of data entries you want to fetch.

### Uploading Data
To upload the data directly into the Supabase PostREST database, run:
> node .\scraper.js upload

## Dependencies
Install the required dependencies using:
> npm install"
