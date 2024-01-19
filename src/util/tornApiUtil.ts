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
      // transform so it matches model
      result.data.members = Object.entries(result.data.members).map(
        ([id, member]: [string, any]) => {
          return {
            id: Number(id),
            ...member,
          };
        }
      );
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
    console.error("failure: getUserFromTornApi");

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
    console.error("failure: getUserFromTornApiById");

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

export const getUserFromTornApiByIdNew = async (
  apiKey: string,
  tornId: number
) => {
  try {
    const response = await axios.get(
      `https://api.torn.com/user/${tornId}?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );

    // Check if the response status is not successful (e.g., 502 Bad Gateway)
    if (response.status !== 200) {
      console.error(`Request failed with status code ${response.status}`);
      return {
        data: null,
        error: `Request failed with status code ${response.status}`,
      };
    }

    // If the response is successful, return the data
    return { data: response.data, error: null };
  } catch (error) {
    console.error("An error occurred in getUserFromTornApiById:", error);

    // Return an error object or message
    return {
      data: null,
      error: "An error occurred while fetching data from the API",
    };
  }
};
