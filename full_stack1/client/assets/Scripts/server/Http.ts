export interface RequestObj {
  url: string;
  data?: {};
  method?: string;
  fail?: (T) => void;
  success?: (T: any) => void;
}

class Http {
  private httpRequest = new XMLHttpRequest();

  request(obj: RequestObj) {
    const time = 5 * 1000;
    let timeout = false;
    // 超时设置
    const timer = setTimeout(() => {
      timeout = true;
      console.log("中断连接。。。");
      this.httpRequest.abort();
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

    this.httpRequest.onreadystatechange = () => {
      const response = this.httpRequest.response;
      console.log(
        "http url cb: " +
          url +
          " readyState: " +
          this.httpRequest.readyState +
          " status: " +
          this.httpRequest.status
      );
      clearTimeout(timer);

      if (
        this.httpRequest.readyState == 4 &&
        this.httpRequest.status >= 200 &&
        this.httpRequest.status < 400
      ) {
        console.log("http success: " + url + " resp: " + response);
        if (typeof obj.success === "function") {
          obj.success(JSON.parse(response));
        }
      }
    };

    this.httpRequest.open(obj.method ? obj.method : "GET", url, true);
    this.httpRequest.send();
  }
}

export default new Http() as Http;
