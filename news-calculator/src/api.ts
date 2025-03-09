import axios, { AxiosError } from "axios";

import { NewsRequest, NewsResponse } from "./types";

class Api {
  static instance = new Api();

  constructor() {
    axios.defaults.headers.patch["Content-Type"] = "application/json";
  }

  GetNewsCalculation = async (
    newsRequest: NewsRequest,
    // setErrorMessage: (value: React.SetStateAction<string | null>) => void
  ): Promise<NewsResponse> => {
    return axios
      .post<NewsResponse>("https://localhost:5013/news/score", newsRequest)
      .then((response) => {
        return response?.data;
      })
      .catch((error: AxiosError) => Promise.reject(error));
  };
}

export default Api.instance;
