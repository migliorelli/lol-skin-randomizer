import axios from "axios";

export const cdnClient = axios.create({
  baseURL: "https://ddragon.leagueoflegends.com/cdn",
  responseType: "json",
});
