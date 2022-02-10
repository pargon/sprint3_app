/////////////////////////////////////////////////////////////
// Variables Iniciales
const base_url = "https://api.gnparra.tk/v1/users" // "http://localhost:5050/v1/users"
let form = document.getElementById('login_form');
let buttons = document.querySelectorAll('.providers button');


////////////////////////////
// Agregamos Eventos
form.addEventListener('submit', login_event);

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', login_provider_event);
}



/////////////////////////////////////////////////////////////
// Eventos

//1) Evento #1 para el Login Normal
function login_event(e) {



  ////////////////////////////
  // Variables

  e.preventDefault(); // prevent the browser redirection
  let message = document.getElementById('message');
  let formData = new FormData(form); //Get all inputs from the form 
  let data = Object.fromEntries(formData); //Convert data into json 
  let url_login = `${base_url}/login`

  message.textContent = "";

  if (data.user.includes("@")) {
    console.log("Es un correo");
    data = { email: data.user, password: data.password };
    console.log(data);
  } else {
    console.log("Es un username");
    data = { userid: data.user, password: data.password };
    console.log(data);
  }

  fetch(url_login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {

      form.reset();
      console.log(`data response: ${JSON.stringify(data)}`)

      if (data.message)
        message.textContent = data.message;
      else {
        localStorage.setItem('token', data.token);
        // sessionStorage.setItem("token",  data.token);
        window.location.replace(`/orders.html?token=${data.token}`);
      }
    })
    .catch(error => {
      form.reset();
      console.log(error)
    });
} /// End of the event


//2) Evento para poder logearse
function login_provider_event(event) {
  event.preventDefault();
  const provider = this.getAttribute("data-provider");
  console.log(window.localStorage);
  window.location.href = `${base_url}/${provider}/auth`;
}