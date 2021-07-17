const ErrorApi = require('./../exceptions/error.api');
const validator = require('validator');

module.exports = function (req, res, next){
  const {id, password} = req.body;
  const errors = [];

  const flagEmpty = validator.isEmpty(id) || validator.isEmpty(password);
  if(flagEmpty){
    return next( ErrorApi.BadRequest('Fields must not be empty', []) );
  }

  const flagId = validator.isEmail(id) || validator.isMobilePhone(id);
  if(!flagId){
    return next( ErrorApi.BadRequest('Invalid value in Id', []) );
  }

  next();
};
