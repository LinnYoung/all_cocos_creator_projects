class Server {
  request(obj) {
    const httpRequest = new XMLHttpRequest();
    const time = 5 * 1000;
    let timeout = false;

    // 超时设置
    const timer = setTimeout(() => {
      timeout = true;
      httpRequest.abort();
    }, time);

    let url = obj.url;

    // 组织请求命令
    if (typeof obj.data === "object") {
      console.info("obj.data: ", JSON.stringify(obj.data));

      const kvs = [];
      for (let k in obj.data) {
        kvs.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj.data[k]));
      }
      url += "?";
      url += kvs.join("&");
    }

    httpRequest.open(obj.method ? obj.method : "GET", url, true);

    httpRequest.onreadystatechange = () => {
      const response = httpRequest.responseText;
      console.info(
        "http url cb: " +
          url +
          "readyState: " +
          httpRequest.readyState +
          "status: ",
        httpRequest.status
      );
      clearTimeout(timer);

      if (httpRequest.readyState === 4) {
        console.info("http success: " + url + "resp: ", response);
        if (typeof obj.success == "function") {
          obj.success(response);
        }
      } else {
        console.info("http fail:", url);
        if (typeof obj.fail == "function") {
          obj.fail(response);
        }
      }
    };
    httpRequest.send();
  }
}

const server = new Server();
export default server as Server;
