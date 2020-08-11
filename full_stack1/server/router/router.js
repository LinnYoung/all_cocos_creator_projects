/**
 * File： route.js
 * function: 路由处理
 */
const url = require("url");
const User = require("../business/user");
class Router {
  getParams(req) {
    // 获取参数
    const params = url.parse(req.url).query;
    const paramList = params.split("&");
    let res = {};
    for (let i = 0, l = paramList.length; i < l; ++i) {
      let elements = paramList[i].split("=");
      res[elements[0]] = elements[1];
    }
    return res;
  }

  register(req, res, callback) {
    let params = this.getParams(req);
    // 参数校验，生成新的用户 todo ...
    User.createUser(params["userName"], params["passWorld"], (data) => {
      callback && callback(data);
    });
  }
}

module.exports = new Router();
