import { EmbedBuilder } from "discord.js";
import { generateAttackMessageList } from "./helpers";

export async function sendAttackStatusEmbed(
  membersListNew: any,
  factionInfo: any
) {
  const sortedAttackList = membersListNew
    .filter((member: any) => member.statusState === "Okay")
    .sort(
      (a: any, b: any) =>
        Number(a.lastActionTimestamp) - Number(b.lastActionTimestamp)
    );

  const attackMessageList = generateAttackMessageList(sortedAttackList);

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 15) {
    const response = new EmbedBuilder().setColor("Green");
    const list = attackMessageList.slice(i, i + 15).join("");
    response.setDescription(`
    ${list.length === 0 ? "placeholder" : list}`);
    if (i < 15) {
      response.setTitle(`🔫  Attack List of ${factionInfo.name} 🔫`);
      response.setDescription(`
    Updated <t:${Math.round(Date.now() / 1000)}:R>
    ${list}`);
    }
    responseList.push(response);
  }

  return responseList;
}
