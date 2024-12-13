import service from "axios";

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const defaultHeaders = {
  "Content-Type": "application/json",
};

const createConfig = (method, url,data = {}, headers = {}, config = {}) => ({
  method,
  url,
  ...(method === HttpMethod.GET || method === HttpMethod.DELETE
    ? { params: data }
    : { data }),
  headers: { ...defaultHeaders, ...headers },
  ...config, // 支持额外的配置选项
});

const handleResponse = async (requestPromise, method, url) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    console.error(
      `Error occurred while making ${method} request to ${url}:`,
      error.response
        ? `${error.response.status} - ${error.response.data.message}`
        : error.message
    );
    throw error; // 重新抛出错误，以便调用者可以处理
  }
};

const http = {
  request(method, url, data = {}, headers = {}, config = {}) {
    const requestConfig = createConfig(method, url, data, headers, config);
    //console.log("request config",requestConfig)
    return handleResponse(service(requestConfig), method, url); // 传入报错时可定位到method 和 url
  },
  get(url, params = {}, headers = {}, config = {}) {
    config={"baseURL":"api/"}
    return this.request(HttpMethod.GET, url, params, headers, config);
  },
  post(url, data = {}, headers = {}, config = {}) {
    return this.request(HttpMethod.POST, url, data, headers, config);
  },
  put(url, data = {}, headers = {}, config = {}) {
    return this.request(HttpMethod.PUT, url, data, headers, config);
  },
  delete(url, params = {}, headers = {}, config = {}) {
    return this.request(HttpMethod.DELETE, url, params, headers, config);
  },
};

export default http;
