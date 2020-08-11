const http = require("http");
const url = require("url");
const Router = require("./router/router");

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;

  // 正则 去掉/
  pathname = pathname.replace(/\//g, "");
  const response = {
    error: 1,
    note: "Not found path",
  };
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (Router[pathname]) {
    Router[pathname](req, res, (resData) => {
      console.log("data: ", resData);
      res.write(JSON.stringify(resData));
    });
  } else {
    res.write(JSON.stringify(response));
  }
  res.end();
});
server.listen(8181);
