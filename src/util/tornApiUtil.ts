import axios from "axios";
import { logApiCount } from "./logApiCount";

export const getFactionFromTornApi = async (
  factionID: number,
  apiKey: string
) => {
  logApiCount(apiKey);
  try {
    return axios.get(
      `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
export const getUserFromTornApi = async (apiKey: string) => {
  logApiCount(apiKey);

  try {
    return axios.get(
      `https://api.torn.com/user/?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
export const getUserFromTornApiById = async (
  apiKey: string,
  tornId: number
) => {
  logApiCount(apiKey);

  try {
    return axios.get(
      `https://api.torn.com/user/${tornId}?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
