const { Router } = require('express');
const CryptoJS = require('crypto-js');
const db = require('../../model');
const { chkNewUser, login, chkAdmin, chkUserActive } = require('../midds/users');
const { newToken, chkToken } = require('../midds/token');

function createRouter() {
  const router = Router();

  /**
 * @swagger
 * /api/v1/users:
 *  post:
 *    summary: Crear usuario
 *    description: Permite crear una cuenta de usuario.
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - name: body
 *      description: Cuerpo de una persona.
 *      in: body
 *      required: true
 *      type: string
 *      example: { nombre: String, apellido: String, mail: String, telefono: String, userid: String, password: String, direcciones: {direccion: String}}
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: Usuario Creado.
 *        type: string
 *        example: { nombre: String, apellido: String, mail: String, direccionenvio: String, telefono: String, userid: String, password: String, direcciones: {direccion: String}}
 */
  router.post('/', chkNewUser, async (req, res) => {
    const { CRYPTO_KEY } = process.env;
    const User = db.getModel('UserModel');
    const Address = db.getModel('AddressModel');
    const {
      userid,
      nombre,
      apellido,
      mail,
      telefono,
      password,
      direcciones,
    } = req.body;
    const direcc = direcciones
    // encripta pass
    const passwordCryp = CryptoJS.AES.encrypt(password, CRYPTO_KEY).toString();

    const isAdmin = (userid === 'admin');

    try {
      // inserta base
      const newUser = await User.create({
        userid,
        nombre,
        apellido,
        mail,
        telefono,
        password: passwordCryp,
        activo: true,
        admin: isAdmin,
        addresses: direcciones,
      }, {
        include: [Address],
      });
      // devuelvo ok el endpoint
      res.status(200).json(newUser);

    } catch (error) {
      global.console.log(error);
      res.status(406).json(error);
    }
  });

  /**
 * @swagger
 * /api/v1/users/unable:
 *  post:
 *    summary: Suspender usuario
 *    description: Permite suspender una cuenta de usuario. Se puede ingresar usuario o mail y se toma el primer ingresado.
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - name: body
 *      description: Cuerpo de una persona.
 *      in: body
 *      required: true
 *      type: string
 *      example: { mail: String, userid: String}
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: Usuario Suspendido.
 *      403:
 *        description: Invalid Token
 *      404:
 *        description: Usuario no encontrado
*/
  router.post('/unable', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    const User = db.getModel('UserModel');
    const { userid, mail } = req.body;

    let users;

    // ingresaron userid
    if (userid) {
      users = await User.findOne({
        where: {
          userid,
        },
      });
    } else {
      // ingresaron mail
      users = await User.findOne({
        where: {
          mail,
        },
      });
    }

    // recupero algo
    if (users) {

      // cambia estado usuario
      users.activo = false;

      // guarda instancia
      users.save();

      res
        .status(200)
        .json({message: "Usuario Suspendido"});
    } else {
      res
        .status(404);
    }
  });

  /**
   * @swagger
   * /api/v1/users/login:
   *  post:
   *    summary: Login del usuario
   *    description: Permite iniciar sesión al usuario.
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de una persona.
   *      in: body
   *      required: true
   *      type: string
   *      example: {userid: String, password: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Token
   *      401:
   *        description: Password incorrecto
   *      404:
   *        description: Usuario no encontrado
   */
  router.post('/login', login, chkUserActive, newToken, async (req, res) => {
    if (req.token) {
      return res.status(200).json({ token: req.token });
    }
    return res.status(404);
  });

  /**
   * @swagger
   * /api/v1/users/addresses:
   *  get:
   *    summary: Direcciones del usuario
   *    description: Obtener un listado de todas las direcciones del usuario logueado
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Peticion exitosa
   *
   */
  router.get('/addresses', chkToken, chkUserActive, async (req, res) => {
    const User = db.getModel('UserModel');
    const Address = db.getModel('AddressModel');
    const { userid } = req.user;

    const users = await User.findOne({
      where: {
        userid,
      },
      include: [Address]
    });

    if (users) {
      const addres = users.addresses;
      res
        .status(200)
        .json(addres);
    } else {
      const addresEmpty = {};
      res
        .status(200)
        .json(addresEmpty);
    }
  });

  router.get('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    const User = db.getModel('UserModel');
    const Address = db.getModel('AddressModel');
    global.console.time('GET Users');
    const users = await User.findAll({ include: [Address] });
    global.console.timeEnd('GET Users');
    res.json(users);
  });

  return router;
}

module.exports = {
  createRouter,
};
