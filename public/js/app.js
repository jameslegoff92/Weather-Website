// The goal is to figure out how to make an HTTP request for that forecast data from client side JavaScript in the browser. That's going to allow us to create a form, submit it, fetch the data and then on the fly re-render the page to show that weather information.
//Used to access the tag element we need.
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')



//weatherForm holds both the opening and closing form tag. Along with all of its inner tags. 
// console.log(weatherForm)

//e is simply the event object that gets send back after the event listener is completed.
weatherForm.addEventListener('submit', (e) => {
    //stops the browsers default setting of refreshing the webpage automatically
    e.preventDefault()

    //.value gets the value from the input tag.
    const location = search.value;

    messageOne.textContent = 'Loading'
    messageTwo.textContent = ''

        //when using fetch the url must have http://, otherwise the function won't work. The fetch function in this case allows us to get information from a url, which we can then manipulate at show on the index page of our website. This is done because there is a link on the index.hbs file to this app.js file.
    fetch('http://localhost:3000/weather?address=' + location).then((response) => {
      //data.error will either return undefined or our error message. undefined = falsy, while a string = truthy. This is how the if statment would be activated or not.
      response.json().then((data) => {
        if(data.error){
          return messageOne.textContent = data.error
      } 
      messageOne.textContent = data.location;
      messageTwo.textContent = data.forecast;
      
      })
    })
})