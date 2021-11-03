const chalk = require('chalk');
const CryptoJS = require('crypto-js');
const { getModel } = require('../model');

async function initialize() {
  //createUser();
  // createPayMeth();
  // createProduct();
  // createOrder();
}

async function createUser() {
  const User = getModel('UserModel');
  const current = await User.findOne({
    where: {
      userid: 'admin',
    },
  });
  if (!current) {

    const { CRYPTO_KEY } = process.env;
    const password = 'Mimamamemimamemimamimama123';
    // encripta pass
    const passwordCryp = CryptoJS.AES.encrypt(password, CRYPTO_KEY).toString();

    await User.create({
      userid: 'admin',
      nombre: 'admin',
      apellido: 'admin',
      mail: 'admin@parra.com.ar',
      direenvio: 'direccion gon 123',
      telefono: '1122334455',
      password: passwordCryp,
      admin: true
    });
  }
}

async function createPayMeth() {
  const PayMeth = getModel('PayMethModel');
  const current = await PayMeth.findOne({
    where: {
      descripcion: 'Efectivo',
    },
  });
  if (!current) {
    await PayMeth.create({
      descripcion: 'Efectivo',
    });
  }
}

async function createProduct() {
  const Product = getModel('ProductModel');

  const current = await Product.findOne({
    where: {
      descripcion: 'Coca Cola',
    },
  });
  if (!current) {
    await Product.create({
      descripcion: 'Coca Cola',
      precio: 180,
    });
  }

  const current2 = await Product.findOne({
    where: {
      descripcion: 'Pepsi Cola',
    },
  });
  if (!current2) {
    await Product.create({
      descripcion: 'Pepsi Cola',
      precio: 170,
    });
  }

  const current3 = await Product.findOne({
    where: {
      descripcion: 'Hamburguesa',
    },
  });
  if (!current3) {
    await Product.create({
      descripcion: 'Hamburguesa',
      precio: 320,
    });
  }
}

async function createOrder() {
  const Order = getModel('OrderModel');
  const Product = getModel('ProductModel');
  const User = getModel('UserModel');
  const PayMeth = getModel('PayMethModel');

  if (!current) {
    await Order.create({
      fecha: '20210826',
      estado: 'Pendiente',
      direccion_entrega: 'nada',
      paymethDescripcion: 'Efectivo',
      userUserid: 'admin',
    });

    current = await Order.findOne({
      where: {
        numero: num,
      },
    });
    const prdcurrent = await Product.findOne({
      where: {
        descripcion: 'Hamburguesa',
      },
    });
    if (prdcurrent) {
      await current.addProduct(prdcurrent, { through: { cantidad: 3 } });
    } else {
      console.log(chalk.redBright('no existe prd'));
    }

    // asocia usuario
    // const userCurrent = await User.findOne({
    //   where:{
    //     userid: 'admin'
    //   }
    // });
    // if (userCurrent){
    //   await current.setUser(userCurrent);
    // }else{
    //   console.log(chalk.redBright('no existe user'));
    // }

    // // asocia pay curr
    // const payCurrent = await PayMeth.findOne({
    //   where: {
    //     descripcion: 'Efectivo'
    //   }
    // });
    // if (payCurrent){
    //   console.log(chalk.red(current));
    //   console.log(chalk.red(payCurrent));
    //   await current.setPayMeth(payCurrent);
    // }else{
    //   console.log(chalk.redBright('no existe met.pago'));
    // }
  }
}

module.exports = {
  initialize,
};
