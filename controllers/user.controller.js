const userService = require ('./../services/user.service');
const serverService = require ('./../services/server.service');

class UserController {

  async signUp(req, res, next){
    try {
        const { id, password } = req.body;
        const userResult = await userService.signUp( id, password );

        res.cookie('refreshToken', userResult.refreshToken, { maxAge: process.env.JWT_REFRESH_COOKIE_LIVE, httpOnly: true } );
        return res.json(userResult.accessToken);
    } catch (e){
        next(e)
    }
  }

  async signIn(req, res, next){
    try {
        const {id, password} = req.body;
        const userResult = await userService.signIn( id, password );

        res.cookie('refreshToken', userResult.refreshToken, { maxAge: process.env.JWT_REFRESH_COOKIE_LIVE, httpOnly: true } );
        return res.json(userResult.accessToken);

    } catch (e){
      next(e)
    }
  }

  async getInfo(req, res, next){
    try {
        const { refreshToken } = req.cookies;
        const user = await userService.getUser( refreshToken );
        return res.json(user);
    } catch (e){
        next(e)
    }
  }

  async latency(req, res, next){
    try {
        const valueLatency = await serverService.getLatencyServer();
        return res.json (`Latency for google.com = ${valueLatency} ms`);
    } catch (e){
        next(e)
    }
  }

  async logout(req, res, next){
    try {
        const params = req.query;
        const { refreshToken } = req.cookies;

        const token = await userService.logout(refreshToken, params);
        res.clearCookie('refreshToken');

        return res.json('logout');
    }
     catch (e){
        next(e)
    }
  }

}

module.exports = new UserController();