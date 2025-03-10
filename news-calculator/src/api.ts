import axios, { AxiosError } from "axios";

import { NewsErrorData, NewsRequest, NewsResponse } from "./types";

class Api {
  static instance = new Api();

  constructor() {
    axios.defaults.headers.patch["Content-Type"] = "application/json";
    axios.defaults.headers.patch["Accept"] = "application/json";
  }

  GetNewsCalculation = async (
    newsRequest: NewsRequest,
  ): Promise<NewsResponse> => {
    return axios
      .post<NewsResponse>(`${process.env.REACT_APP_API_URL}/news/score`, newsRequest)
      .then((response) => {
        return response?.data;
      })
      .catch((error: AxiosError<NewsErrorData>) => Promise.reject(error));
  };
}

export default Api.instance;
