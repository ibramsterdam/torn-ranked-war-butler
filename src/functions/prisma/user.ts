import { PrismaClient } from "@prisma/client";

export async function upsertUserAndConnectFaction(
  prisma: PrismaClient,
  id: number,
  name: string,
  factionId: number
) {
  try {
    const result = await prisma.user.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        faction: {
          connect: { id: factionId },
        },
      },
      create: {
        id: id,
        name: name,
        faction: {
          connect: { id: factionId },
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: upsertUserAndConnectFaction");
    console.log("error", error);
  }
}

export async function getAllUsers(prisma: PrismaClient) {
  try {
    const result = await prisma.user.findMany();
    return result;
  } catch (error) {
    console.log("Failure: getAllUsers");
    console.log("error", error);
  }
}
// TODO: FIX THIS
export async function getAllUsersThatAreTrackedOnAServer(prisma: PrismaClient) {
  try {
    const result = await prisma.factionsOnDiscordServer.findMany({
      select: {
        faction: {
          select: {
            members: true,
            id: true,
          },
        },
      },
    });
    const filteredArray = [] as any;
    const idSeen = [] as any;

    // filter out duplicates
    result.forEach((item: any) => {
      if (!idSeen.includes(item.faction.id)) {
        filteredArray.push(item.faction.members);
        idSeen.push(item.faction.id);
      }
    });
    return filteredArray.flat();
  } catch (error) {
    console.log("Failure: getAllUsersThatAreTrackedOnAServer");
    console.log("error", error);
  }
}

export async function getUser(prisma: PrismaClient, id: number) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        apiKey: true,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUser");
    console.log("error", error);
  }
}

export async function upsertUser(
  prisma: PrismaClient,
  id: number,
  userData: any,
  factionId: number,
  profileLink: string,
  attackLink: string
) {
  try {
    const result = await prisma.user.upsert({
      where: {
        id: id,
      },
      update: {
        factionId: factionId,
        name: userData.name,
        lastActionRelative: userData.last_action.relative,
        lastActionStatus: userData.last_action.status,
        lastActionTimestamp: BigInt(userData.last_action.timestamp),
        statusDescription: userData.status.description,
        statusDetails: userData.status.details,
        statusState: userData.status.state,
        statusUntil: BigInt(userData.status.until),
        profileLink: profileLink,
        attackLink: attackLink,
      },
      create: {
        id: id,
        factionId: factionId,
        name: userData.name,
        lastActionRelative: userData.last_action.relative,
        lastActionStatus: userData.last_action.status,
        lastActionTimestamp: BigInt(userData.last_action.timestamp),
        statusDescription: userData.status.description,
        statusDetails: userData.status.details,
        statusState: userData.status.state,
        statusUntil: BigInt(userData.status.until),
        profileLink: profileLink,
        attackLink: attackLink,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: upsertUser");
    console.log("error", error);
  }
}
export async function getUsersByFactionId(
  prisma: PrismaClient,
  factionId: number
) {
  try {
    const result = await prisma.user.findMany({
      where: {
        factionId: factionId,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUsersByFactionId");
    console.log("error", error);
  }
}
export async function updateUserRetalliationTimer(
  prisma: PrismaClient,
  userId: number
) {
  const date = new Date();
  const fourMinutesLater = new Date(date.getTime() + 60000 * 4);

  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        retalliationUntil: fourMinutesLater,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: updateUserRetalliationTimer");
    console.log("error", error);
  }
}
export async function getUsersThatCanBeRetalliatedFromFaction(
  prisma: PrismaClient,
  factionId: number
) {
  try {
    const result = await prisma.user.findMany({
      where: {
        factionId: factionId,
        retalliationUntil: {
          gt: new Date(),
        },
        statusDetails: {
          contains: "<a href",
        },
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: getUsersThatCanBeRetalliatedFromFaction");
    console.log("error", error);
  }
}
export async function removeUserRelationWithFaction(
  prisma: PrismaClient,
  factionId: number
) {
  try {
    const result = await prisma.user.updateMany({
      where: {
        factionId: factionId,
      },
      data: {
        factionId: 0,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: removeUserRelationWithFaction");
    console.log("error", error);
  }
}

export async function updateUserPersonalStats(
  prisma: PrismaClient,
  userId: number,
  personalstats: {
    energydrinkused: number;
    refills: number;
    xantaken: number;
    networth: number;
  },
  age: number,
  revivable: number
) {
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        energydrinkTaken: personalstats.energydrinkused,
        energyRefills: personalstats.refills,
        xanaxTaken: personalstats.xantaken,
        networth: BigInt(personalstats.networth),
        age: age,
        revivable: revivable,
      },
    });
    return result;
  } catch (error) {
    console.log("Failure: updateUserPersonalStats");
    console.log("error", error);
  }
}
