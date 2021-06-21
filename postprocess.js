import { readJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts' 

const toName = ({ name }) => name

const FIELD_NAMES = {
  address: 'Address:', 
  hours: 'Opening Hours:', 
  recommendations: 'Shop Recommendations:',
  details: 'Other Details:',
  contributor: 'Contributor:',
}

const annotate = (data) => {
  const features = data.features.map((f) => {
    // Make a deep copy of feature and properties
    const feature = { ...f, properties: { name: f.properties.name } }
    const fields = f.properties.description
      .split('<br>')
      .filter(Boolean)

    for (const [propertyName, fieldName] of Object.entries(FIELD_NAMES)) {
      const fieldNameIndex = fields.indexOf(fieldName)
      const fieldValue = fields[fieldNameIndex + 1]
      feature.properties[propertyName] = 
        fieldValue &&
        !Object.values(FIELD_NAMES).includes(fieldValue) &&
        !fieldValue.endsWith(':')
          ? fieldValue
          : null
    }
    
    feature.properties = {
      ...feature.properties,
      ...f.properties,
    }
    return feature
  })
  return { ...data, features }
}

// Read the downloaded_filename JSON
const data = await readJSON(Deno.args[0].replace('kml', 'json'))

// Rework data, filtering only points with description
const cleanedData = {
  ...data,
  features: data.features.filter(({ properties }) => properties.description)
}

cleanedData.features.forEach((d) => {
  delete d.gx_media_links
})

const annotatedData = annotate(cleanedData)

annotatedData.features.forEach((d) => {
  delete d.description
})

// Write a new JSON file with our filtered data
const jsonString = JSON.stringify(annotatedData, null, 2)
Deno.writeTextFileSync(Deno.env.get('POSTPROCESS_FILENAME'), jsonString)

console.log('Done.')
