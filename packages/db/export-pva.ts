import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.pvaSection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const outPath = join(__dirname, "../../apps/mobile/assets/pva.json");
  writeFileSync(outPath, JSON.stringify(sections, null, 2));
  console.log(`Exported ${sections.length} PVA sections to ${outPath}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
