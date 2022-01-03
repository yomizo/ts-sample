import axios, { AxiosResponse } from "axios";
import { JSDOM } from "jsdom";

export const fetchHtml = async (url: string): Promise<Document> => {
  const res: AxiosResponse = await axios.get(encodeURI(url));
  const { window } = new JSDOM(res.data);
  const { document } = window;
  return document;
};
