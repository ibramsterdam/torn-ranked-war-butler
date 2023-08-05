import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const getShortUrlAttackLink = async (tornId: number) => {
  try {
    if(!process.env.URL_SHORTENER_URL) return console.log("no url defined");

      return axios.post(process.env.URL_SHORTENER_URL, {
        url: `https://www.torn.com/loader.php?sid=attack&user2ID=${tornId}`,
      });
  } catch (error) {
    return "error: getShortUrlAttackLink";
  }
};

export const getShortUrlProfileLink = async (tornId: number) => {
  try {
    if(!process.env.URL_SHORTENER_URL) return console.log("no url defined");

    return axios.post(process.env.URL_SHORTENER_URL, {
      url: `https://www.torn.com/profiles.php?XID=${tornId}`,
    });
  } catch (error) {
    return "error: getShortUrlProfileLink";
  }
};
