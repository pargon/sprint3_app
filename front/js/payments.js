/////////////////////////////////////////////////////////////
// Variables Iniciales

const base_url = "http://localhost:8080"
let form = document.getElementById('login_form');
form.addEventListener('submit', showOrder);
let paymentBox = document.getElementById('box-payment');


/////////////////////////////////////////////////////////////
// Eventos

//1) Evento para mostrar las ordenes
function showOrder(e) {

  // prevent the browser redirection
  e.preventDefault();  
  
  // Get all inputs from the form 
  let orderId = document.getElementById('orderId').value
  let token = document.getElementById('token').value

  console.log(token)

  const url_orders = `${base_url}/pedidos/${orderId}`;

  console.log(url_orders)

  fetch(url_orders, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authentication': `${token}`
    }
  })
.then(response => response.json())
.then(data => {
  console.log(data);
  form.reset();

  let divOut = document.getElementById('txtOut');
  let txtOut = "";
    for (let k in data) {
      txtOut += `<p id="orderId2"> Order Id: <b>${data[k].OrderId}</b><br/></p>`;
      txtOut += `<p id="orderState"> State: <b>${data[k].state}</b><br/></p>`;
      txtOut += `<p id="orderPrice">Total Price: <b>${data[k].totalPrice}</b><br/></p>`;
      txtOut += `<p id="orderAddress"> Address: <b>${data[k].Agenda.address}</b><br/><hr/></p>`;
      txtOut += ` <div class="box" id="box-payment">
      <h3>Payment</h3>
      <button class="btn btn-success btn-payment"  data-order-id="${orderId}" data-provider="mercadopago" data-order-price="${data[k].totalPrice}" 
        data-state-order="${data[k].state}" data-token-user="${token}">Pagar con MercadoPago</button>
      <button class="btn btn-success btn-payment" data-order-id="${orderId}" data-provider="paypal" data-order-price="${data[k].totalPrice}" 
        data-state-order="${data[k].state}" data-token-user="${token}">Pagar con Paypal</button>
      <hr>
      <div class="cho-container"></div>
    </div>`
    }

    divOut.innerHTML = txtOut;

    //Seleccionamos todo lo que tenga la clase ".btn-payment"
    const buttonsPayment = document.querySelectorAll('.btn-payment')

    //Le agregamos eventos
    for (let i = 0; i < buttonsPayment.length; i++) {
      buttonsPayment[i].addEventListener('click',payment_event);
    }

  //paymentBox.removeAttribute('hidden')

})
.catch(error => {
  console.log(error)
  window.alert("Something is wrong with your order. Please check your Order Id or Token User");
});
}


//2 Evento para poder realizar los pagos
let payment_event= (e) => {

   // prevent the browser redirection
   e.preventDefault();  

   //Capturamos los datos de los botones
   const provider = e.target.getAttribute("data-provider");
   const orderId =  e.target.getAttribute("data-order-id");
   const orderTotalPrice = e.target.getAttribute("data-order-price");
   const orderState = e.target.getAttribute("data-state-order");
   const token = e.target.getAttribute("data-token-user");

   //Si el estado es Processing entonces puedes pagar
   if (orderState === "Processing" || orderState === 'Payment unsuccessful')
    {
      if (provider === 'paypal')
        paypal_payment(orderId, orderTotalPrice)
      else if (provider === 'mercadopago')
        mercadopago_payment(orderId,orderTotalPrice,token)
    }
  //Caso contrario, le mandamos una ventan de información
  else 
    window.alert("This order is already done. Please try with another one");

}


/////////////////////////////////////////////////////////////
// Funciones 


//1) Funcion Main
let main = () =>{

  const urlSearchParams = new URLSearchParams(window.location.search);
  let params = Object.fromEntries(urlSearchParams.entries());
  const token = params.token;
  const orderId = params.orderId

  //console.log(token)
  //console.log(orderId)

  if(token && orderId){
    // Get all inputs from the form 
  document.getElementById('orderId').value= orderId
  document.getElementById('token').value = token
  
  }

}


// 2) Función que consume los endpoints de paypal
let paypal_payment = (order, price) =>{

  console.log("Pagando con Paypal")

  const payment_url = `${base_url}/paypal/payment`;

  const data = {"amount": price, "orderId": order}

  fetch(payment_url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }
  )
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const url = data.href;
    window.location.href = url;
  });

}


//3) Función que consume los endpoints de Meli
let mercadopago_payment = (orderId, price, token) =>{

  const payment_url = `${base_url}/mercadopago/payment/${orderId}`;
  const data = {"amount": price, "orderId": orderId}
  let MERCADOPAGO_PUBLIC_KEY = 'TEST-4f1be09b-de90-409e-be6c-282da7b8c326';

  fetch(payment_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authentication': `${token}`
      },
      body: JSON.stringify(data),
    }
  )
  .then(response => response.json())
  .then(data => {

    console.log(data);
    const preference_id = data.preference_id;
    const url = data.url;
    const redirect = true;  // change this to have different views

    if (redirect){
      // use the URL if you want to redirect
      console.log(`Redireccionar a la url: ${url}`)
      window.location.href = url;
    }else{
      // Use preference_id to show a modal
        const mp = new MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
          locale: 'es-AR'
        });
  
      // Inicializa el checkout
      mp.checkout({
          preference: {
            id: preference_id
          },
          render: {
            container: '.cho-container', // Indica el nombre de la clase donde se mostrará el botón de pago
            label: 'Pagar', // Cambia el texto del botón de pago (opcional)
          }
      }); 
    }

  });

}



/////////////////////////////////////////////////////////////
// Invocaciones

main();