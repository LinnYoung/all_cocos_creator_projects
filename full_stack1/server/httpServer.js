const http = require("http");

const server = http.createServer((req, res) => {
  const response = { info: "Hello World!" };
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write(JSON.stringify(response));
  res.end();
});
server.listen(8182);
