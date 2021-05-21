const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=3cff33a76fd665b305e37360200265f5&query=' + latitude + ',' + longitude;

    request({ url, json: true}, (error, {body}) => {
      if (error) {
        callback('Could not connect to the API', undefined);
      } else if (body.error) {
        callback('Could not find the city requested for. Try another name', undefined)
      } else {
        callback(undefined, body.current.weather_descriptions[0] + " is the current weather. It is currently " + body.current.temperature + " degrees out. It feels like " +  body.current.feelslike +  " degrees out.")
      }
    })
}

module.exports = forecast;