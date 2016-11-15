import { directionsApiKey, distanceApiKey } from './gitignore/google-api-keys'
import { HTTP } from 'meteor/http'

Meteor.methods({
  getMapSrc ({ origin, destination }) {
    return `https://www.google.com/maps/embed/v1/directions?key=${directionsApiKey}&origin=${origin}&destination=${destination}`
  },
  getDistance ({ origin, destination }) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${distanceApiKey}&origins=${origin}&destinations=${destination}`
    const result = HTTP.get(url)
    const json = JSON.parse(result.content)
    const meters = json.rows[0].elements[0].distance.value
    console.log(`Meters: ${meters}`)
    const inches = meters * 39.370
    const miles = inches / 63360
    return miles
    //return fetch(url).then(data => data.json()).then(json => {
      //console.log(`Fetched ${JSON.stringify(json)}`)
      //const meters = json.rows[0].elements[0].distance.value
      //const inches = meters * 39.370
      //const miles = inches / 63360
      //console.log(`Got ${miles} miles`)
      //return miles
    //}).catch(err => {
      //console.log(`Got err fetching miles: ${err}`)
    //})
  }
})
