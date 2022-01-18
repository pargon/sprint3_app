const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const dbaccess = require('../auth/accessDB');


function passport_connect(strategy_name, strategy_scope, req, res, next) {

  const user_id = req.user.id;
  const state = `${user_id}`;  // state must be string

  // redirect to strategy to authenticate
  let passport_authenticate = passport.authenticate(
    strategy_name, { session: false, scope: strategy_scope, state: state }
  );
  passport_authenticate(req, res, next);
}

function createToken(userid){
  const { JWT_PASS } = process.env;

  try {
    const newtoken = jwt.sign({ userid }, JWT_PASS, { expiresIn: '1h' });    
    return newtoken;

  } catch (error) {
    console.log(error);
  };

  return null;  
}

function passport_callback(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname) {
  console.log(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname);

  let user = { id: 1, name: "Mauricio" };  // TODO: get the user data for the created or connected user

  if (user_id) {
    console.log(`Connect the ${strategy_name} account to the user ${user_id}`);
    // TODO: create the relation between user and provider for user_id and provider(${strategy_name}_data)
    user = dbaccess.addRelation(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname);

  } else {
    console.log(`This is a login event. Check in the database if exists some user with this ${strategy_name} account.
      Login if exists, otherwise create a new user and connect with the ${strategy_name} account`);
    // TODO: Check if exists a user with this ${strategy_name} account and log in him.
    // TODO: If not exists, create the user and create the relation
    //       between user and provider for user_id and provider(${strategy_name}_data)
    user = dbaccess.getUserByProvider(strategy_name, provider_user_id, provider_email, user_name, user_lastname);
  }

  console.log(chalk.bgCyan( JSON.stringify( user)));

  // TODO: generate a new token for login
  const token = createToken(user.userid);
  return token;
}


module.exports = {
  passport_connect,
  passport_callback
};
