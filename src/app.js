//Core node modules
const path = require('path')

//npm, external, api modules.
//Express is actually a function, it is not an object.
const express = require('express')
const hbs = require('hbs')

const app = express()
//This is how we would access the port value that heroku wants to give our website. env is for environment variable. It gives us access to the environment variable value. We add the or(||) sign so that even when heroku doesn't assign a port(like when we host our project locally) it'll still work.
const port = process.env.PORT || 3000

//Local Modules: ./ means current directory, which in this case is src. ./utils/geocode = src/utils/geocode
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecasts')


//Define paths for Express config
//__dirname returns the filepath to the current folder you're currently working in. path, which is a core node module, allows us to easily manipulate a filepath to fit our needs with the join method.
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
//app.set allows you to set a value for a given express setting.
//This line of code allows us to use hbs with express. hbs makes it easy to integrate the handlebar engine with express. This will make it easy to create dynamic pages with templating. 
app.set('view engine', 'hbs')
//By default express is looking for a directory named views. With this line of code we tell express to look for whatever directory we name in the viewsPath constant.
app.set('views', viewsPath)
//This line of code sets up the environment were going to need in order to use partials
hbs.registerPartials(partialsPath)

//Sets up static directory to serve.
//express.static sends the file path used as an argument to the browser making the request. Index.html is a special name for a file. By default it is recognized as the root website page. This line of code is sending the entire directory and all of its contents to the browser. The filenames are used as the ending for the url.
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  // Render allows us to show one of our view engines. In this case that is the hbs view engine.
  //The first argument is the name of the hbs file you want to render
  res.render('index', {
    title: 'Weather App',
    name: 'James Louis Le-Goff',
  });
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Good Morning!',
    name: 'James Louis Le-Goff',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    name: 'James Louis Le-Goff',
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      // This gets sent back as JSON data.
      error: 'You must provide a city name.'
    })
  } else { //Putting the ={} sets a default value for the parameters whichc will make the code work. The reason being is that the object properties are undefined since no argument was passed. You cannot destructure undefined. Hence, your site will crash if it tries too.
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
      //The if statements are used to exit the functon if an error happens. The return keyword will immediately get you out of the function no matter how nested you are inside the function.
      if (error) {
          return res.send({error})
      } 
      
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({error})
          }
         
          res.send({
            forecast: forecastData,
            location,
            address: req.query.address,
          })
        })
      })
  }
})

app.get('/products', (req, res) => {
  //If no value is added to the search query, you send the error. req.query.search will return an empty string if no value is added. Empty strings are falsy. Hence, !falsy, become truthy and the if statement will execute.
  //If you attempt to put in the url with simply /products and no query string you'll get the error message as well but for a different logical reason. It will attempt to search for a value that doesn't exist. It'll return undefined which by default is falsy. 
    if (!req.query.search) {
      // We add the return statment to exit the function. This stops the program from reading the second res.send, which would cause an error for our program.
      return res.send({
        error: 'You must provide a search term.'
      })
    }
  //Cannot set headers after they are sent to the client. This means that you are attempting to res.send twice. This can only be done once for a request otherwise this error will pop up.
  // url: localhost/products?search=games  req.query holds the information concerning this query string, which is an object with properties and values. req.query.search returns the value of the property named search, which is games in this example.
    console.log(typeof(req.query.search))
    res.send({
      products: [],
    })
})





//This would be a catch all handler for urls ending in /help/. By targeting the /help/ url we can send back a more targeted message to help the user.
app.get('/help/*', (req, res) => {
    res.render('errpage2', {
      title: '404', 
      name: 'James Le-Goff',
      errorMessage: 'Help article not found'
    })
})

//This line of code is used to send information to the user when he attempts to load a page that doesn't exist.
//When we use app.get the anonymous function only runs if the user enters a url that matches our first argument.
//The asteriks will handle any url the user uses that haven't created a handler for since the * accepts any url. Since it accepts any url it must be put last since the code is read from top to bottom.
app.get('*', (req, res) => {
    res.render('error-page', {
      title: '404',
      name: 'James Le-Goff',
      errorMessage: 'Page not found'
    })
})

// app.listen will host our code on port 3000, which is perfect for wanting to view our local projects and files from a browser.
app.listen(port, () => {
  //The code will run if the website has been successfully hosted on port 3000. It's a good way to let developers know if the website is up and running.
  console.log('Server is up on port ' + port + ". ")
})