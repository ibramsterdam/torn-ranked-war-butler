import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { getRandomItemFromArray } from "./randomItemFromArray";
import csv from "csv-parser";
import { getBrainSurgeonApiKeys } from "../functions/prisma/apiKey";
import { getUserFromTornApiById } from "./tornApiUtil";
import {
  getShortUrlAttackLink,
  getShortUrlProfileLink,
} from "./urlShortenerUtil";
import { prisma } from "..";

const csvFilePath = "/home/bram/Personal/torn-ranked-war-butler/spies.csv";

/**
 * 1. get csv
 * 2. run script
 * 3. todo -> make script run in multiple threads
 */

export async function nowQuery() {
  console.log("Called");
  const dataArray: any = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      dataArray.push(data);
    })
    .on("end", () => {
      updateUser(dataArray);

      console.log("CSV file successfully processed");
    });
}
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function updateUser(list: any) {
  const keys = await getBrainSurgeonApiKeys(prisma);
  let count = 0;
  for (const user of list) {
    console.log("Updating:", user.Name, `| ${count}/${list.length} users`);

    try {
      const randomApiKeyObject = getRandomItemFromArray(keys);
      const id: any = getNumber(user.Name);
      const [day, month, year] = user["Last Update"].split("-").map(Number); // Split the date string into an array of day, month and year values
      console.log(day, month, year, user["Last Update"]);
      const date = new Date(year + 2000, month - 1, day); // Create a new Date object using the year, month and day values
      const userFromTorn: any = await getUserFromTornApiById(
        randomApiKeyObject.value,
        id
      );
      console.log(date);
      const attackLink: any = await getShortUrlAttackLink(id);
      const profileLink: any = await getShortUrlProfileLink(id);

      // upserting the faction
      await prisma.faction.upsert({
        where: {
          id: userFromTorn.data.faction.faction_id,
        },
        update: {},
        create: {
          id: userFromTorn.data.faction.faction_id,
          name: userFromTorn.data.faction.faction_name,
        },
      });

      // upserting the user
      await prisma.user.upsert({
        where: {
          id: id,
        },
        update: {
          defense: BigInt(user.Defense.replace(/,/g, "")),
          dexterity: BigInt(user.Dexterity.replace(/,/g, "")),
          speed: BigInt(user.Speed.replace(/,/g, "")),
          strength: BigInt(user.Strength.replace(/,/g, "")),
          statTotal: BigInt(user.Total.replace(/,/g, "")),
          ffBonus: parseFloat(user["FF Bonus"]),
          spyReportDate: date,
        },
        create: {
          id: id,
          name: userFromTorn.data.name,
          factionId: userFromTorn.data.faction.faction_id,
          age: userFromTorn.data.age,
          revivable: userFromTorn.data.revivable,
          attackLink: attackLink.data.shortUrl,
          profileLink: profileLink.data.shortUrl,

          energydrinkTaken: userFromTorn.data.personalstats.energydrinkused,
          energyRefills: userFromTorn.data.personalstats.refills,
          xanaxTaken: userFromTorn.data.personalstats.xantaken,
          networth: BigInt(userFromTorn.data.personalstats.networth),

          defense: BigInt(user.Defense.replace(/,/g, "")),
          dexterity: BigInt(user.Dexterity.replace(/,/g, "")),
          speed: BigInt(user.Speed.replace(/,/g, "")),
          strength: BigInt(user.Strength.replace(/,/g, "")),
          statTotal: BigInt(user.Total.replace(/,/g, "")),
          ffBonus: parseFloat(user["FF Bonus"]),
          spyReportDate: date,
        },
      });

      count++;
    } catch (error) {
      console.log(error);
    }
  }
}

function getNumber(str: any) {
  const match = str.match(/\[(\d+)\]/);
  if (match) {
    return parseInt(match[1]);
  } else {
    return null;
  }
}
