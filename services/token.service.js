const jwt = require('jsonwebtoken');
const tokenModel = require('./../models/token.model');

class TokenService {

  generateToken(payload){
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {expiresIn: process.env.JWT_ACCESS_TOKEN_LIVE});
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {expiresIn: process.env.JWT_REFRESH_TOKEN_LIVE});
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token){
    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
        return userData;
    } catch (e) {
        return null;
    }
  }

  validateRefreshToken(token){
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
      return userData;
    } catch (e) {
        return null;
    }
  }

  async saveToken(user, refreshToken){
    const token = await tokenModel.findOne({user});
    if(token){
      token.refreshToken = refreshToken;
      return token.save();
    }
    const newToken = await tokenModel.create({user, refreshToken});
    return newToken;
  }

  async removeToken( refreshToken ){
    const tokenData = await tokenModel.deleteOne({refreshToken});
    return tokenData;
  }

  async removeAllToken( ){
    const tokenData = await tokenModel.deleteMany();
    return tokenData;
  }

  async findToken( refreshToken ){
    const tokenData = await tokenModel.findOne({refreshToken});
    return tokenData;
  }

}

module.exports = new TokenService();