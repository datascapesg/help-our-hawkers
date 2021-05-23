import * as toGeoJSON from 'https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.js'
import xmldom from 'https://dev.jspm.io/xmldom'

// Provide a require shim for togeojson
window.require = () => xmldom

const stalls = Deno.readTextFileSync(Deno.args[0])

const doc = new xmldom.DOMParser().parseFromString(stalls)
const geoJson = toGeoJSON.kml(doc)

const jsonString = JSON.stringify(geoJson, null, 2)

Deno.writeTextFileSync(Deno.env.get('POSTPROCESS_FILENAME'), jsonString)
