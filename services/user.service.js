const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const validator = require('validator');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');
const ErrorApi = require('./../exceptions/error.api');

class UserService {

  async newTokens(newUser) {
    const userDto = new UserDto(newUser);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.db_id, tokens.refreshToken);
    return { ...tokens }
  }

  async signUp(id, password){

    const user = await UserModel.findOne({id});
    if(user){
      throw ErrorApi.BadRequest(`User with ${id} already registered.`)
    }

    const id_type = validator.isEmail(id) ? 'Email' : 'Phone number';
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
    const newUser = await UserModel.create({ id, password: hashPassword, id_type });

    return await this.newTokens(newUser);
  }

  async signIn(id, password){
    const user = await UserModel.findOne({id});

    if(!user){
      throw ErrorApi.BadRequest('User not found');
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
      throw ErrorApi.BadRequest('Password error');
    }

    return await this.newTokens(user);
  }

  async logout(refreshToken, params) {
    const { all } = params;

    if(!all){
      return null;
    }

    if ( all === 'true' ){
      const token = await tokenService.removeAllToken();
      return token;
    }

    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh ( refreshToken ) {
    if(!refreshToken){
      throw ErrorApi.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const token = await tokenService.findToken(refreshToken);
    if(!userData || !token){
      throw ErrorApi.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.db_id);

    return await this.newTokens(user);
  }

  async getUser( refreshToken ) {
    if(!refreshToken){
      throw ErrorApi.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const {id, id_type} = userData;
    return {id, id_type};
  }


}

module.exports = new UserService();