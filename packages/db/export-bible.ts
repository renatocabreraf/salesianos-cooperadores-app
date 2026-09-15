import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.bibleBook.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      chapters: {
        orderBy: { chapterNumber: "asc" },
        include: {
          verses: {
            orderBy: { verseNumber: "asc" },
          },
        },
      },
    },
  });

  const outPath = join(__dirname, "../../apps/mobile/assets/bible.json");
  writeFileSync(outPath, JSON.stringify(books, null, 2));
  console.log(`Exported ${books.length} books to ${outPath}`);

  const totalVerses = books.reduce(
    (sum, b) => sum + b.chapters.reduce((s, c) => s + c.verses.length, 0),
    0
  );
  console.log(`Total verses: ${totalVerses}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
