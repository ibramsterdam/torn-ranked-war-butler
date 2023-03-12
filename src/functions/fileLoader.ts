import { glob } from "glob";
const { promisify } = require("util");
const proGlob = promisify(glob);

export async function loadFiles(dirName: string) {
  const Files = await proGlob(
    `${process.cwd().replace(/\\/g, "/")}/src/${dirName}/**/*.ts`
  );

  Files.forEach((file: any) => delete require.cache[require.resolve(file)]);
  return Files;
}
