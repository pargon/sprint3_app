
# Delilah Restó API 2.0.0

Este proyecto consiste en presentar una api que permite gestionar ordenes a los usuarios. Además, permite al administrador mantener los maestros.


## Requerimientos

- Servidor MySQL
- Servidor Redis
- Node
## Pasos

- Abrir zip y descomprimir archivo
- Ejecutar script `create_database.sql` en servidor MySql
- Instalar paquetes en Node (sección Instalación de paquetes)
- Cambiar variables de entorno (sección Variables de Entorno)
- Para probar el test (sección Correr Tests)
- Para iniciar la api (sección Correr Api)
- Para probar la api acceder a la documentación en Api-Docs](http://localhost:5050/api-docs/#/)

## Instalación de paquetes

Ejecutar siguiente comando para iniciar

```bash
  npm install 
```
    
## Variables de Entorno

Para ejecutar el proyecto hay que actualizar las variables en el archivo `.env`

`MYSQL_DATABASE` nombre de la base en MySql

`MYSQL_HOST` servidor MySql

`MYSQL_PORT` puerto del servidor MySql

`MYSQL_USER` usuario que conecta con permisos de insert/update/delete a la base de MySql

`MYSQL_PASS` contraseña del usuario

`EXPRESS_PORT` puerto del servidor express a publicar (por defecto 5050)

`JWT_PASS` key para armar validación por JWT (cualquier valor sirve)

`CRYPTO_KEY` key para encriptar password (cualquier valor sirve)

`REDIS_HOST` servidor Redis 

`REDIS_PORT` puerto del servidor Redis
  
## Correr Tests

Ejecutar siguiente comando

```bash
  npm run test
```
## Correr Api

Ejecutar siguiente comando 

```bash
  npm run dev
```