const ErrorApi = require('./../exceptions/error.api');
const tokenService = require('./../services/token.service');
const userService = require('./../services/user.service');

module.exports = async function(req, res, next){
  try {
    const { authorization } = req.headers;
    if(!authorization){
      return next(ErrorApi.UnauthorizedError());
    }
    const accessToken = authorization.split(' ')[1];
    if(!accessToken){
      return next(ErrorApi.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if(userData){
      req.user = userData;
      return next();
    }

    const { refreshToken } = req.cookies;
    if(!refreshToken){
      next(ErrorApi.UnauthorizedError());
    }

    const tokens = await userService.refresh(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.JWT_REFRESH_COOKIE_LIVE, httpOnly: true } );
    return res.json(tokens.accessToken);

  }
  catch (e) {
    return next(ErrorApi.UnauthorizedError());
  }
};