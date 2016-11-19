const defaultOrigin = 'Athens,GA'
const defaultDestination = 'Knoxville,TN'
var origin = defaultOrigin
var destination = defaultDestination
var directionsService
var directionsDisplay

function toMiles (meters) {
  const inches = meters * 39.370
  return inches / 63360
}

function updateRoute() {
  directionsService.route({
    origin,
    destination,
    travelMode: 'DRIVING'
  }, (response, status) => {
    if (status === 'OK') {
      const legs = response.routes[0].legs
      const sum = (total, n) => total + n
      const totalMeters = legs.map(leg => leg.distance.value).reduce(sum)
      Session.set('distance', toMiles(totalMeters))
      directionsDisplay.setDirections(response)
    } else {
      window.alert('Directions request failed due to ' + status)
    }
  })
}

window.initMap = function () {
  directionsService = new google.maps.DirectionsService
  directionsDisplay = new google.maps.DirectionsRenderer
  const map = new google.maps.Map(document.getElementById('map'))
  directionsDisplay.setMap(map)
  updateRoute()
}

Template.route.helpers({
  distance () {
    const distance = Session.get('distance')
    if (distance) {
      return distance.toFixed(1)
    }
  },
  defaultOrigin () {
    return defaultOrigin
  },
  defaultDestination () {
    return defaultDestination
  }
})

Template.route.events({
  'input #origin': (e) => {
    origin = encodeURIComponent(e.target.value)
  },
  'input #destination': (e) => {
    destination = encodeURIComponent(e.target.value)
  },
  'click #update-map': () => {
    updateRoute()
  }
})

Template.route.onCreated(() => {
  const apiKey = 'AIzaSyDPLvgIuiBMSj5wpOM3RDwxEr5UW9i0H3U'
  const callbackName = 'initMap'
  const googleMapsApiSrc = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`
  $.getScript(googleMapsApiSrc)
})
