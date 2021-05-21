const request = require("request")

const geocode = (address, callback) => {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoiamFtZXNsZWdvZmYiLCJhIjoiY2tvbHgwc3RoMGtlbjJwbHB1OHNoMTJybCJ9.qKR02IgrWdkc8y2jUcXXfg&limit=1'
// url: url has been shorted to simply url since both the name and variable are the same. This is thanks to ES6 object shorthand syntax. Response is an object an has been destructured to simply input it's body property as an argument.
    request({url, json: true}, (error, { body }) => {
      if (error) {
          callback('Unable to connect to location services!', undefined)
      } else if (body.features.length === 0) {
          callback('Unable to find location. Try another search.', undefined)
      } else {
          callback( undefined, {
              latitude: body.features[0].center[1],
              longitude: body.features[0].center[0],
              location: body.features[0].place_name
          })
      }
  })
}

module.exports = geocode