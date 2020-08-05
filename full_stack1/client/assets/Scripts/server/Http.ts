export interface RequestObj {
  url: string;
  data?: {};
  method?: string;
  success?: (T: any) => void;
}

class Http {
  request(obj: RequestObj) {
    const httpRequest = new XMLHttpRequest();
    const time = 5 * 1000;
    let timeout = false;
    // 超时设置
    const timer = setTimeout(() => {
      timeout = true;
      console.log("lllllll");
      httpRequest.abort();
    }, time);

    let url = obj.url;

    // 组织请求参数
    if (typeof obj.data === "object") {
      console.info("obj.data = ", JSON.stringify(obj.data));
      let kvs = [];
      for (let k in obj.data) {
        kvs.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj.data[k]));
      }
      url += "?";
      url += kvs.join("&");
    }

    httpRequest.onreadystatechange = function () {
      const response = httpRequest.response;
      console.log(
        "http url cb: " +
          url +
          " readyState: " +
          httpRequest.readyState +
          " status: " +
          httpRequest.status
      );
      clearTimeout(timer);

      if (
        httpRequest.readyState == 4 &&
        httpRequest.status >= 200 &&
        httpRequest.status < 400
      ) {
        console.log("http success: " + url + "resp: " + response);
        if (typeof obj.success === "function") {
          obj.success(JSON.parse(response));
        }
      }
    };

    httpRequest.open(obj.method ? obj.method : "GET", url, true);
    httpRequest.send();
  }
}

export default new Http() as Http;
