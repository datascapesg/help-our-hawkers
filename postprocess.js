import * as toGeoJSON from 'https://dev.jspm.io/togeojson'
import xmldom from 'https://dev.jspm.io/xmldom'

const stalls = Deno.readTextFileSync(Deno.args[0])

const doc = new xmldom.DOMParser().parseFromString(stalls)
const geoJson = toGeoJSON.kml(doc)

const jsonString = JSON.stringify(geoJson, null, 2)

Deno.writeTextFileSync(Deno.env.get('POSTPROCESS_FILENAME'), jsonString)
