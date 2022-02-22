const chalk = require('chalk');
const db = require('../../');


async function addRelation(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname) {

  return null;
}

async function getUserByProvider(strategy_name, provider_user_id, provider_email, user_name, user_lastname) {

  // get modelos
  const Provider = db.getModel('ProviderModel');
  const User = db.getModel('UserModel');

  // buscar por providerId y userproviderId
  const current = await Provider.findOne({
    where: {
      providerid: strategy_name,
    },
    include: {
      model: User,
      through: { where: { externaluserid: provider_user_id } },
    },
  });
  console.log(JSON.stringify(current));

  if (current) {
    // por cada producto en detalle
    if (current.users.length > 0){
      return current.users[0];      
    }
  }

  return createUserByProvider(strategy_name, provider_user_id, provider_email, user_name, user_lastname);
}


async function createUserByProvider(strategy_name, provider_user_id, provider_email, user_name, user_lastname) {

  try {

    // get provider or create
    const currProvider = await getProvider(strategy_name);

    // nuevo user id autogenerado
    const userid = `user_${strategy_name}_${provider_user_id}`;
    const currUser = await getUser(userid, user_name, user_lastname, provider_email);

    console.log(chalk.redBright(JSON.stringify(currProvider)));

    // agrega usuario con relación al proveedor
    await currProvider.addUser(currUser, {
      through: {
        externaluserid: provider_user_id,
        nombre: currUser.nombre,
        apellido: currUser.apellido,
        mail: currUser.mail,
        telefono: currUser.telefono,
        activo: true
      }
    });
    return currUser;

  } catch (error) {
    global.console.log(error);
    return null;
  }
}

async function getUser(user_id, user_name, user_lastname, provider_email) {

  // get modelo  
  const User = db.getModel('UserModel');
  const isAdmin = (user_id === 'admin');

  // buscar user
  let currUser = await User.findOne({
    where: {
      userid: user_id,
    },
  });

  if (!currUser) {

    // inserta base
    currUser = await User.create({
      userid: user_id,
      nombre: user_name,
      apellido: user_lastname,
      mail: provider_email,
      activo: true,
      admin: isAdmin,
    });
  }
  return currUser;
}

async function getProvider(strategy_name) {
  // get modelo
  const Provider = db.getModel('ProviderModel');

  // buscar proveedor
  let currProvider = await Provider.findOne({
    where: {
      providerid: strategy_name,
    },
  });

  if (!currProvider) {
    currProvider = await Provider.create({
      providerid: strategy_name,
      nombre: strategy_name,
      activo: true,
    });
  }
  return currProvider;
}

module.exports = {
  addRelation,
  getUserByProvider
};
