const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function query() {
  try {
    console.log(await prisma.discordChannel.findMany());
  } catch (error) {
    console.log(error);
  }
}

// query();
