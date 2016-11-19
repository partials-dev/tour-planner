import camelCase from 'lodash.camelcase'

const values = {}

function round (n) {
  return +n.toFixed(2)
}

function unwrap (reactiveVarDictionary) {
  const keys = Object.keys(reactiveVarDictionary)
  function transferProperty (result, property) {
    const reactiveVar = values[property]
    result[property] = reactiveVar.get()
    return result
  }
  return keys.reduce(transferProperty, {})
}

function toId (description) {
  return description.replace(/ /g, '-').toLowerCase()
}

const itineraryInputs = [
  {
    description: 'Days gone on tour',
    defaultValue: 3
  },
  {
    description: 'Number of gigs',
    defaultValue: 3
  },
  {
    description: 'Total payout',
    defaultValue: 0
  }
]

const roomAndBoardInputs = [
  {
    description: 'Number of members on tour',
    defaultValue: 6
  },
  {
    description: 'Per diem',
    defaultValue: 10
  },
  {
    description: 'Housing cost per night',
    defaultValue: 100
  }
]
const travelInputs = [
  {
    description: 'Number of vehicles',
    defaultValue: 2
  },
  {
    description: 'Average mpg for all vehicles',
    defaultValue: 10
  },
  {
    description: 'Dollars per gallon of gas',
    defaultValue: 10
  }
]

const hiredGunInputs = [
  {
    description: 'Number of hired guns',
    defaultValue: 2
  },
  {
    description: 'Pay per gig',
    defaultValue: 40
  }
]

function roomAndBoardCost () {
  const { housingCostPerNight, numberOfMembersOnTour, perDiem, daysGoneOnTour } = unwrap(values)
  const room = daysGoneOnTour * housingCostPerNight
  const memberBoard = daysGoneOnTour * numberOfMembersOnTour * perDiem
  return room + memberBoard
}

function hiredGunsCost () {
  const { daysGoneOnTour, numberOfHiredGuns, perDiem, numberOfGigs, payPerGig } = unwrap(values)
  const hiredGunBoard = daysGoneOnTour * numberOfHiredGuns * perDiem
  const hiredGunPay = numberOfGigs * numberOfHiredGuns * payPerGig
  return hiredGunBoard + hiredGunPay
}

function travelCost () {
  const miles = Session.get('distance')
  const { numberOfVehicles, averageMpgForAllVehicles, dollarsPerGallonOfGas } = unwrap(values)
  const gallonsUsed = (numberOfVehicles * miles) / averageMpgForAllVehicles
  return gallonsUsed * dollarsPerGallonOfGas
}

function totalCost () {
  return roomAndBoardCost() + hiredGunsCost() + travelCost()
}

function payout () {
  return values.totalPayout.get()
}

function profit () {
  return payout() - totalCost()
}

const sections = [
  {
    heading: 'Itinerary',
    inputs: itineraryInputs
  },
  {
    heading: 'Room And Board',
    inputs: roomAndBoardInputs,
    cost: roomAndBoardCost
  },
  {
    heading: 'Travel',
    inputs: travelInputs,
    cost: travelCost
  },
  {
    heading: 'Hired Guns',
    inputs: hiredGunInputs,
    cost: hiredGunsCost
  }
]

Template.calculator.helpers({
  sections,
  roomAndBoardCost,
  hiredGunsCost,
  travelCost,
  totalCost,
  profit,
  payout,
  round 
})

Template.calculatorSection.helpers({
  id () {
    return toId(this.description)
  },
  round
})

function getInputValues () {
  const allInputs = sections.reduce((allInputs, section) => {
    return allInputs.concat(section.inputs)
  }, [])
  const values = {}
  allInputs.forEach(input => {
    const id = toId(input.description)
    const variableName = camelCase(id)
    const value = $('#' + id).val() || input.defaultValue
    values[variableName] = parseFloat(value)
  })
  return values
}

const events = {}
const allInputs = sections.reduce((allInputs, section) => {
  return allInputs.concat(section.inputs)
}, [])

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const calculatorEvents = allInputs.forEach(input => {
  const { description, defaultValue } = input
  const id = toId(description)
  const variableName = camelCase(id)
  const eventSelector = `input #${id}`
  values[variableName] = new ReactiveVar(defaultValue)
  events[eventSelector] = function (e) {
    if (isNumeric(e.target.value)) {
      values[variableName].set(parseFloat(e.target.value))
    }
  }
})

Template.calculator.events(events)
