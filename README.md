# Delilah Restó API 3.0.0

Este proyecto consiste en presentar en la nube de **Amazon AWS** una api que permite gestionar ordenes a los usuarios. Además, permite al administrador mantener los maestros. 


## Conectar al servidor
* Ingresar a la url https://aws.amazon.com/ y presionar Sign IN
* Seleccionar IAM User
* Ingresar Account Id: `archivo_account_id`
* Ingresar usuario: `archivo_user`
* Ingresar password: `archivo_password`


## Iniciar Instancias
* En el buscador de la barra superior ingresar EC2, seleccionarlo
* Acceder al menú Auto Scaling Groups en la sección derecha
* Hacer click sobre el grupo creado con nombre `ASGapp3`
* Presionar el botón edit en el primer cuadro
* Ingresar los siguientes valores:
	* Desired capacity: 2
	* Minimum capacity: 1
	* Maximum capacity: 3
* Presionar botón Update


## Chequear Instancias
* En el buscador de la barra superior ingresar EC2, seleccionarlo
* Acceder al menú Instances
* Verificar que al menos una instancian pase a estado Running


## Ingresar sitios
* Url dominio propio: https://www.gonzaloparra.tk o https://gonzaloparra.tk
* Url servicios api: https://api.gonzaloparra.tk
* Repositorio Git del proyecto actualizado: https://gitlab.com/pargon1/acamica-sprint-3


## Probar API 
* Ingresando a postman o similar
* Acceder a cada punto según documentación en https://api.gonzaloparra.tk/docs/


## Agregar rule para Acceder por SSH desde Mi PC
* En el buscador de la barra superior ingresar EC2, seleccionarlo
* Acceder al menú Security Groups
* Buscar en la lista y hacer click sobre `SGinstanciasApp3`
* Presionar botón Edit inbound rules
* Presionar botón Add rule
* Seleccionar Type SSH
* Seleccionar Source My IP y luego presionar Save Rules


## Acceder por SSH a Instancias
* En el buscador de la barra superior ingresar EC2, seleccionarlo
* Acceder al menú Instances
* Hacer click en una instancia con estado Running
* Presionar el botón Connect, en la solapa SSH muestra el instructivo para continuar
* El archivo PEM va adjunto con la entrega
