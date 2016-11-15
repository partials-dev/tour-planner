const defaultOrigin = 'Athens,GA'
const defaultDestination = 'Knoxville,TN'
var origin = defaultOrigin
var destination = defaultDestination

function updateDistance () {
  Meteor.call('getDistance', {
    origin,
    destination
  }, (err, distance) => {
    if (err) {
      console.error(`Error when getting distance: ${err}`)
    } else {
      Session.set('distance', distance)
    }
  })
}

function updateMapSrc () {
  Meteor.call('getMapSrc', {
    origin,
    destination
  }, (err, url) => {
    if (err) {
      console.error(`Error when getting map src: ${err}`)
    } else {
      Session.set('mapSrc', url)
    }
  })
}

function updateMap () {
  updateMapSrc()
  updateDistance()
}

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

Template.route.events({
  'input #origin': (e) => {
    origin = encodeURIComponent(e.target.value)
  },
  'input #destination': (e) => {
    destination = encodeURIComponent(e.target.value)
  },
  'click #update-map': () => {
    updateMap()
  }
})

Template.route.onCreated(() => {
  updateMap()
})
