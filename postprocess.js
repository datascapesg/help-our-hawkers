import { readJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts' 

const toName = ({ name }) => name


// Read the downloaded_filename JSON
const data = await readJSON(Deno.args[0].replace('kml', 'json'))

// Rework data, filtering only points with description
const cleanedData = {
  ...data,
  features: data.features.filter(({ properties }) => properties.description)
}

// Write a new JSON file with our filtered data
const jsonString = JSON.stringify(cleanedData, null, 2)

Deno.writeTextFileSync(Deno.env.get('POSTPROCESS_FILENAME'), jsonString)
    
console.log('Done.')