# App
Acamica sprint 1

# Instrucciones
a. Abrir zip y descomprimir archivo

b. Ejecutar npm init

c. Ejecutar npm i express swagger-jsdoc swagger-ui-express

d. Correr con nodemon server.js

# Endpoint de alta de Producto
Se ejecuta un POST a http://localhost:5050/productos

Con el id de sesión en el header con nombre "sesionid"

Y cuyo body tenga en formato Json un texto como el siguiente:

{

  "codproducto": "PROD1",
  
  "descripcion": "Galletitas Trio",
  
  "precio": "102"
  
}
