let redisDB = {};

const redis = require("redis");
const { read } = require("fs");
const constData = require("../util/constData");

const client = redis.createClient(8182,'127.0.0.1');

client.on("ready", (error) => {
  if (error) {
    console.log("redis client on ready error = ", error);
  }

  if (
    redisDB.get(constData.GLOBAL_USER_ID, (err, result) => {
      if (err) {
        console.error("get global_user_id err", err);
        return;
      }
      if (result) {
        //已经设置过了，退出
        return;
      }
      // 设置其实用户ID
      const startUserID = 10001;
      redisDB.set(constData.GLOBAL_USER_ID, startUserID, null);
    })
  );
});

client.on("error", function (error) {
  if (error) {
    console.log("redis client on console.error error = ", error);
  }
});

client.on("connect", function () {
  console.log("redis client on connect");
});

// 获取字符串的设置操作
redisDB.set = (key, value, expire, callback) => {
  client.set(key, value, function (err, result) {
    if (err) {
      console.log("redis client set val error = " + err);
      callback && callback(err);
      return;
    }

    if (expire && !isNaN(expire) && expire > 0) {
      client.expire(key, parseInt(expire));
    }

    callback && callback(result);
  });
};

// 获取字符串数据
redisDB.get = function (key, callback) {
  client.get(key, function (err, result) {
    if (err) {
      console.log("redis client get key error, info: ", err);
      callback && callback(err);
      return;
    }

    callback && callback(result);
  });
};

// 哈希操作
redisDB.hset = function (key, filed, val, callback) {
  client.hset(key, filed, val, function (err, result) {
    if (err) {
      console.log("redis client hset ser val error = ", err);
      callback && callback(err);
      return;
    }
    callback && callback(result);
  });
};

redisDB.incrby = (key, incrNum, callback) => {
  client.incrby(key, incrNum, function (number) {
    callback && callback(number);
  });
};

redis.hget = function (key, filed, callback) {
  client.hget(key, filed, function (err, result) {
    if (err) {
      console.log("redis client hget val err = ", err);
      callback && callback(err);
      return;
    }
    callback && callback(result);
  });
};

module.exports = redisDB;
