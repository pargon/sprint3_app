# Delilah Restó API 4.0.0

Este proyecto consiste en presentar en la nube de **Amazon AWS** una api que permite gestionar ordenes a los usuarios y  mantener maestros por parte del administrador. 
Permite autenticación mediante proveedores tales como Google, Facebook, etc. 
El pago de las ordenes se pueden efectuar tanto con Mercado Pago como PayPal.

## Ingresar sitios
* Url dominio propio: https://www.gnparra.tk o https://gnparra.tk
* Url servicios api: https://api.gnparra.tk
* Repositorio Git del proyecto actualizado: https://github.com/pargon/sprint3_app/tree/sprint4

## Documentación API 
* Ingresando a postman o similar
* Acceder a cada punto según documentación en https://api.gnparra.tk/docs/

## Crear ordenes
* Generar usuario: acceder a la api mediante postman o similar para crear usuario
* Hacer login: acceder a la api mediante postman o similar para loguear usuario y recuperar el token. De ahora en más para el uso del resto de los endpoints debe agregar el token en **Header Authorization type Bearer Token** 
* Generar productos: acceder a la api mediante postman o similar para crear productos (sólo por usuario admin)
* Generar método de pago: acceder a la api mediante postman o similar para crear métodos de pago (sólo por usuario admin)
* Generar ordenes pendientes: acceder a la api mediante postman o similar para crear ordenes con dirección que se usó para crear usuario, método de pago y productos.

## Pagar ordenes
* Loguear en app: acceder a la [Delilah Resto](https://www.gnparra.tk), puede ingresar con usuario y contraseña creados en el instructivo anterior, o bien por medio de otros proveedores detallados en cada botón
* Pagar ordenes pendientes: si el usuario generó ordenes aparecerán en esta pantalla, donde por cada una hay un botón de Mercado Pago y otro de Paypal.

## Docker
* El archivo zip contiene la carpeta con el código fuente y los archivos necesarios para crear el entorno
* Con visual studio o bash situarse en la carpeta `back` y luego ejecutar
```
docker-compose up --build
```
* Acceder a rutas locales [API](http://localhost:4567/docs/)

