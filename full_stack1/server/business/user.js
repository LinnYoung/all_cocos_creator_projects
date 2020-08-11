/**
 * File: user.js
 *
 * function: 用户相关的逻辑t
 */

const redisDB = require("../db/redis_db");

const constData = require("../util/constData");
const { read } = require("fs");

class User {
  createUser(account, pwd, callback) {
    const create = (userID) => {
      // 获取到用户ID后创建用户
      const userKey = constData.GLOBAL_USER_ID + userID;
      const userData = JSON.stringify({
        name: account,
        password: pwd,
        coin: 0,
        diamond: 0,
        head: "",
        friends: [],
      });

      // 数据库创建用户
      redisDB.hmset(userKey, userData, (err, result) => {
        // 返回给用户数据
        let data = {
          userID: userID,
          name: account,
          token: "", // 暂且为空， 后续实现
        };
        if (err) {
          data = {
            error: err,
            note: "create user error!!",
          };
          return callback(data);
        }
        callback(data);
      });
    };

    redisDB.incrby(constData.GLOBAL_USER_ID, 1, (err, userID) => {
      if (err) {
        const data = {
          error: err,
          note: "create user error!!",
        };
        return callback(data);
      }
      create(userID);
    });
  }
}
module.exports = new User();
