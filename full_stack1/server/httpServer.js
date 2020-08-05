const http = require("http");

const server = http.createServer((req, res) => {
  console.log("req: ", req);
  const response = { info: "Hello World!" };
//   res.AddHeader("Access-Control-Allow-Origin", "http://127.0.0.1:7456");
  res.write(JSON.stringify(response));
  res.end();
});
server.listen(8182);
