/////////////////////////////////////////////////////////////
// Variables Iniciales

const base_url = "http://localhost:5050/v1"
const base_url_front = "http://localhost:5000"
let paymentBox = document.getElementById('box-payment');


/////////////////////////////////////////////////////////////
// Funciones


let main = () => {
    // console.log(localStorage);
    // const token = localStorage.getItem('token');

    // const bearer = req.headers.authorization;
    // const token2 = (bearer !== undefined ? bearer : '')
    //   .replace('Bearer ', '');
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const token = params.token;

    console.log(urlSearchParams);

    // TODO: remove token from url
    // console.log(`token:${token} y ${token2}`);

    if (token) {
        getUserData(token);
        getAllOrders(token);
    } else {
        window.location.href = `/index`
    }
}


//1) Evento para mostrar las ordenes
function getAllOrders(token) {

    const url_orders = `${base_url}/orders`;

    fetch(url_orders, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            let divOut = document.getElementById('txtOut');
            let txtOut = "";
            for (let k in data) {
                let totalPrice = 0
                for (let p in data[k].products) {
                    totalPrice += (data[k].products[p].orderproduct.cantidad * data[k].products[p].precio);
                }

                txtOut += `<p id="orderId2"> Order Id: <b>${data[k].id}</b><br/></p>`;
                txtOut += `<p id="orderState"> State: <b>${data[k].estado}</b><br/></p>`;
                txtOut += `<p id="orderPrice"> Total Price: <b>${totalPrice}</b><br/></p>`;
                txtOut += `<p id="orderAddress"> Address: <b>${data[k].direccion_entrega}</b><br/></p>`;

                txtOut += `<button class="btn btn-success btn-paymentMP" data-order-id="${data[k].id}" data-token-user="${token}">MercadoPago</button>`;
                txtOut += ` `;
                txtOut += `<button class="btn btn-success btn-paymentPP" data-order-id="${data[k].id}" data-token-user="${token}">PayPal</button><hr/>`;
            }

            divOut.innerHTML = txtOut;

            //Seleccionamos todo lo que tenga la clase ".btn-paymentMP"
            const buttonsPaymentMP = document.querySelectorAll('.btn-paymentMP')

            //Le agregamos eventos
            for (let i = 0; i < buttonsPaymentMP.length; i++) {
                buttonsPaymentMP[i].addEventListener('click', payment_eventMP);
            }

            //Seleccionamos todo lo que tenga la clase ".btn-paymentPP"
            const buttonsPaymentPP = document.querySelectorAll('.btn-paymentPP')

            //Le agregamos eventos
            for (let i = 0; i < buttonsPaymentPP.length; i++) {
                buttonsPaymentPP[i].addEventListener('click', payment_eventPP);
            }
        })
        .catch(error => {
            console.log(error)
        });
}


//2 Función para mostrar datos del usuario 
let getUserData = (token) => {

    const url_usuarios = `${base_url}/users`;

    fetch(url_usuarios, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let divUserData = document.getElementById('userData');
            if (divUserData) {
                let txtOut = "";

                txtOut += `<p id="userId">User: <b>${data.userid}</b><br/></p>`;
                txtOut += `<p id="name">Name: <b>${data.nombre}</b><br/></p>`;
                txtOut += `<p id="name">Last Name: <b>${data.apellido}</b><br/></p>`;
                txtOut += `<p id="email">Email: <b>${data.mail}</b><br/></p>`;

                divUserData.innerHTML = txtOut;
            }
        })
        .catch(error => {
            console.log(error)
        });
}

/////////////////////////////////////////////////////////////
// Invocaciones

main();



/////////////////////////////////////////////////////////////
// Eventos 

// 1) Función que consume los endpoints de MP
let payment_eventMP = (e) => {

    e.preventDefault();
    const orderId = e.target.getAttribute("data-order-id");
    const token = e.target.getAttribute("data-token-user");

    //----------------    
    // paso 1. Preparar el pago (ir al backend y obtener un preference_id)
    // paso 2. Crear un botón que abre la ventana de MercadoPago.

    const payment_url = `${base_url}/mercadopago/pago`;

    const data = { "orderid": orderId }

    fetch(payment_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const url = data.url;
        
            // use the URL if you want to redirect
            console.log(`Redireccionar a la url: ${url}`)
            window.location.href = url;
        });
}

// 2) Función que consume los endpoints de PP
let payment_eventPP = (e) => {

    e.preventDefault();
    const orderId = e.target.getAttribute("data-order-id");
    const token = e.target.getAttribute("data-token-user");

    window.location.href = `${base_url_front}/payments?orderId=${orderId}&token=${token}`;
}
