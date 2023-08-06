import axios from "axios";
import { TornMember } from "../models";
import { logApiCount } from "./logApiCount";
import { Faction } from "../models/tornApi";

export const getFactionFromTornApi = async (
  factionID: number,
  apiKey: string
) => {
  logApiCount(apiKey);
  try {
    const result = await axios.get(
      `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
    );

    if (result.data.error) {
      console.log(result.data.error, "with apiKey: ", apiKey);
      return null;
    }
    if (result.data) {
      return result.data as Faction;
    }
    return null;
  } catch (error) {
    console.log("failure: getFactionFromTornApi");
    return null;
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
export const getUserFromTornApiById2 = async (
  apiKey: string,
  tornId: number
) => {
  logApiCount(apiKey);

  try {
    const result = await axios.get(
      `https://api.torn.com/user/${tornId}?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
    if (result.data) {
      return result.data as TornMember;
    }
    return null;
  } catch (error) {
    console.log("error in getUserFromTornApiById2");
  }
};
