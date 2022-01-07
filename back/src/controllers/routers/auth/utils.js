const passport = require('passport');


function passport_connect(strategy_name, strategy_scope, req, res, next) {

  const user_id = req.user.id;
  const state = `${user_id}`;  // state must be string

  // redirect to strategy to authenticate
  let passport_authenticate = passport.authenticate(
    strategy_name, { session:false, scope: strategy_scope, state: state }
  );
  passport_authenticate(req, res, next);
}

function passport_callback(strategy_name, provider_user_id, provider_email, user_id) {
  console.log(strategy_name, provider_user_id, provider_email, user_id)
  if (user_id){
    console.log(`Connect the linkedin account to the user ${user_id}`);
    // TODO: create the relation between user and provider for user_id and provider(linkedin_data)
  }else{
    console.log(`This is a login event. Check in the database if exists some user with this linkedin account.
      Login if exists, otherwise create a new user and connect with the linkedin account`);
    // TODO: Check if exists a user with this linkedin account and log in him.
    // TODO: If not exists, create the user and create the relation
    //       between user and provider for user_id and provider(linkedin_data)
  }

  const user = {id: 1, name: "Mauricio"};  // TODO: get the user data for the created or connected user

  // TODO: generate a new token for login
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  return token;
}


module.exports = { passport_connect, passport_callback };
