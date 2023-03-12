import { EmbedBuilder } from "discord.js";

export async function sendTravelStatusEmbed(
  membersListNew: any,
  factionInfo: any
) {
  let travelMessageList: any = [];
  const travelList = membersListNew.filter(
    (member: any) => member.statusState === "Traveling"
  );

  // Create the message list
  travelList.forEach((member: any, index: number) => {
    travelMessageList.push(
      `**[${member.name}](${member.profileLink}) [${index + 1}]** is ${
        member.statusDescription
      }• [Attack!](${member.attackLink}) \n`
    );
  });

  const list = travelMessageList.join("");
  const response = new EmbedBuilder().setColor("Red");
  response.setTitle(`🛩 Travel List of ${factionInfo.name} 🛩`);
  response.setDescription(
    `List was updated <t:${Math.round(Date.now() / 1000)}:R>.
        
        ${list}`
  );

  return [response];
}
