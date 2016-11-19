const defaultOrigin = 'Athens,GA'
const defaultDestination = 'Knoxville,TN'
var origin = defaultOrigin
var destination = defaultDestination
var directionsService
var directionsDisplay

//function updateDistance () {
  //Meteor.call('getDistance', {
    //origin,
    //destination
  //}, (err, distance) => {
    //if (err) {
      //console.error(`Error when getting distance: ${err}`)
    //} else {
      //Session.set('distance', distance)
    //}
  //})
//}

//function updateMapSrc () {
  //Meteor.call('getMapSrc', {
    //origin,
    //destination
  //}, (err, url) => {
    //if (err) {
      //console.error(`Error when getting map src: ${err}`)
    //} else {
      //Session.set('mapSrc', url)
    //}
  //})
//}

//function updateMap () {
  //updateMapSrc()
  //updateDistance()
//}

Template.route.helpers({
  distance () {
    const distance = Session.get('distance')
    if (distance) {
      return distance.toFixed(1)
    }
  },
  mapSrc () {
    return Session.get('mapSrc')
  },
  defaultOrigin () {
    return defaultOrigin
  },
  defaultDestination () {
    return defaultDestination
  }
})

function calculateAndDisplayRoute() {
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      const legs = response.routes[0].legs
      const sum = (total, n) => total + n
      const totalMeters = legs.map(leg => leg.distance.value).reduce(sum)
      const totalInches = totalMeters * 39.370
      const totalMiles = totalInches / 63360
      Session.set('distance', totalMiles)
      directionsDisplay.setDirections(response)
    } else {
      window.alert('Directions request failed due to ' + status)
    }
  })
}

window.initMap = function () {
  console.log('initing map')
  directionsService = new google.maps.DirectionsService
  directionsDisplay = new google.maps.DirectionsRenderer
  var map = new google.maps.Map(document.getElementById('map'))
  directionsDisplay.setMap(map)
  calculateAndDisplayRoute()
}

Template.route.events({
  'input #origin': (e) => {
    origin = encodeURIComponent(e.target.value)
  },
  'input #destination': (e) => {
    destination = encodeURIComponent(e.target.value)
  },
  'click #update-map': () => {
    calculateAndDisplayRoute()
  }
})

//Template.route.onCreated(() => {
  //updateMap()
//})

Template.route.onRendered(() => {
  const apiKey = 'AIzaSyDPLvgIuiBMSj5wpOM3RDwxEr5UW9i0H3U'
  const callbackName = 'initMap'
  const googleMapsApiSrc = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`
  $.getScript(googleMapsApiSrc)
})
