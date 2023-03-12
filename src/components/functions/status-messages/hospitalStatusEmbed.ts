// @ts-nocheck
//TODO investigate this file

const { EmbedBuilder } = require("discord.js");
const { roundBigNum, generateHospitalMessageList } = require("./helpers");

async function sendHospitalStatusEmbed(membersListNew, factionInfo) {
  const sortedHospitalList = membersListNew
    .filter((member) => member.statusState === "Hospital")
    .sort((a, b) => Number(a.statusUntil) - Number(b.statusUntil));

  const hospitalMessageList = generateHospitalMessageList(sortedHospitalList);

  const responseList = [];
  for (let i = 0; i < membersListNew.length; i += 15) {
    const response = new EmbedBuilder().setColor("Blue");
    const list = hospitalMessageList.slice(i, i + 15).join("");
    response.setDescription(`
    ${list.length === 0 ? "placeholder" : list}`);
    if (i < 15) {
      response.setTitle(`🔫  Hospital List of ${factionInfo.name} 🔫`);
      response.setDescription(`
    Updated <t:${Math.round(Date.now() / 1000)}:R>
    **Hospital List**: (**${hospitalMessageList.length} / ${
        membersListNew.length
      }** members in hospital)\n
    ${list}`);
    }
    responseList.push(response);
  }

  return responseList;
}

module.exports = { sendHospitalStatusEmbed };
