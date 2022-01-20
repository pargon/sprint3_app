/////////////////////////////////////////////////////////////
// Variables Iniciales

const base_url = "http://localhost:5050/v1"
const base_url_front = "http://localhost:5000"
let paymentBox = document.getElementById('box-payment');


/////////////////////////////////////////////////////////////
// Funciones


let main = () => {

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const token = params.token;
    
    // delete token
    urlSearchParams.delete('token');

    // TODO: remove token from url
    console.log(`token:${token}`);

    if (token) {
        getUserData(token);
        getAllOrders(token);
    }

    // else
    //    window.location.href = `/index.html`

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
                txtOut += `<p id="orderPrice">Total Price: <b>${totalPrice}</b><br/></p>`;
                txtOut += `<p id="orderAddress"> Address: <b>${data[k].direccion_entrega}</b><br/></p>`;

                txtOut += `<button class="btn btn-success btn-payment"  data-order-id="${data[k].id}" data-token-user="${token}">Pay the order</button><hr/>`
            }

            divOut.innerHTML = txtOut;

            //Seleccionamos todo lo que tenga la clase ".btn-payment"
            const buttonsPayment = document.querySelectorAll('.btn-payment')

            //Le agregamos eventos
            for (let i = 0; i < buttonsPayment.length; i++) {
                buttonsPayment[i].addEventListener('click', payment_event);
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

                txtOut += `<p id="userId"> User: <b>${data.userid}</b><br/></p>`;
                txtOut += `<p id="name">Name: <b>${data.nombre}</b><br/></p>`;
                txtOut += `<p id="name">Last Name: <b>${data.apellido}</b><br/></p>`;
                txtOut += `<p id="email"> Email: <b>${data.mail}</b><br/></p>`;

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



// 1) Función que consume los endpoints de paypL
let payment_event = (e) => {

    e.preventDefault();
    const orderId = e.target.getAttribute("data-order-id");
    const token = e.target.getAttribute("data-token-user");

    window.location.href = `${base_url_front}/payments.html?orderId=${orderId}&token=${token}`;


}