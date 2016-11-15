import camelCase from 'lodash.camelcase'

const values = {}

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

const sections = [
  {
    heading: 'Itinerary',
    inputs: itineraryInputs
  },
  {
    heading: 'Room And Board',
    inputs: roomAndBoardInputs
  },
  {
    heading: 'Travel',
    inputs: travelInputs
  },
  {
    heading: 'Hired Guns',
    inputs: hiredGunInputs
  }
]

function roomAndBoardCost () {
  const { values, housingCostPerNight, numberOfMembersOnTour, perDiem, daysGoneOnTour } = getInputValues()
  const room = daysGoneOnTour * housingCostPerNight
  const memberBoard = daysGoneOnTour * numberOfMembersOnTour * perDiem
  debugger
  return room + memberBoard
}

function hiredGunCost () {
  const { daysGoneOnTour, numberOfHiredGuns, perDiem, numberOfGigs, payPerGig } = getInputValues()
  const hiredGunBoard = daysGoneOnTour * numberOfHiredGuns * perDiem
  const hiredGunPay = numberOfGigs * numberOfHiredGuns * payPerGig
  return hiredGunBoard + hiredGunPay
}

function travelCost () {
  const miles = Session.get('distance')
  const { numberOfVehicles, averageMpgForAllVehicles, dollarsPerGallonOfGas } = getInputValues()
  const gallonsUsed = (numberOfVehicles * miles) / averageMpgForAllVehicles
  return gallonsUsed * dollarsPerGallonOfGas
}

function totalCost () {
  return roomAndBoardCost() + hiredGunCost + travelCost
}

Template.calculator.helpers({
  sections () {
    return sections
  },
  roomAndBoardCost,
  hiredGunCost,
  travelCost,
  totalCost
})

Template.calculatorSection.helpers({
  toId (description) {
    return toId(description)
  }
})

function getInputValues () {
  const allInputs = sections.reduce((allInputs, section) => {
    return allInputs.concat(section.inputs)
  }, [])
  const values = {}
  allInputs.forEach(input => {
    const id = toId(input.description)
    const variableName = camelCase(id)
    const value = $('#' + id).val()
    values[variableName] = parseFloat(value)
  })
  return values
}

//const allInputs = sections.reduce((inputs, section) => {
  //return inputs.concat(section.inputs)
//}, [])
                              
//const events = {}

//const calculatorEvents = allInputs.map({ description } => {
  //const id = toId(description)
  //const variableName = camelCase(id)
  //const eventSelector = `input ${id}`
  //events[eventSelector] = function (e) {
    //values[variableName] = e.target.value
  //}
//})

//Template.calculator.events(events)
