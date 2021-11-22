'use strict';
module.exports = function(app) {
  var cryptoWork = require('../controllers/cryptoController');
  var accountController= require('../controllers/accountController');

  // cryptoWork Routes
  app.route('/api/topTokens')
    .get(cryptoWork.read_topToken_history);
    // .post(cryptoWork.create_topToken_history)
    // .delete(cryptoWork.delTopTokenHistory);
  
  // account Routes
  app.route('/api/register')
    .post(accountController.register);

  app.route('/api/login')
    .post(accountController.login);

  app.route('/api/tasks/:taskId')
    .get(cryptoWork.read_a_task)
    .put(cryptoWork.update_a_task)
    .delete(cryptoWork.delete_a_task);
};