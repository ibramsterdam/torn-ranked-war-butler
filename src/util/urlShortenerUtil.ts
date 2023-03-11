import axios from "axios";

export const getShortUrlAttackLink = async (tornId: number) => {
  try {
    return axios.post(`https://xa.up.railway.app/api/generate`, {
      url: `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=$${tornId}`,
    });
  } catch (error) {
    return "error";
  }
};
j;
export const getShortUrlProfileLink = async (tornId: number) => {
  try {
    return axios.post(`https://xa.up.railway.app/api/generate`, {
      url: `https://www.torn.com/profiles.php?XID=${tornId}`,
    });
  } catch (error) {
    return "error";
  }
};
