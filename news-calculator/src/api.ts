import axios from "axios";

import { NewsRequest, NewsResponse } from "./types";

class Api {
  static instance = new Api();

  constructor() {
    axios.defaults.headers.patch["Content-Type"] = "application/json";
  }

  GetNewsCalculation = async (
    newsRequest: NewsRequest
  ): Promise<NewsResponse | void> => {
    return axios
      .post<NewsResponse>("https://localhost:5013/news/score", newsRequest)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => Promise.reject(error.response));
  };
}

export default Api.instance;
