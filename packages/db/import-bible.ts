import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const BOOK_MAP: Record<string, { name: string; testament: string }> = {
  GEN: { name: "Génesis", testament: "AT" },
  EXO: { name: "Éxodo", testament: "AT" },
  LEV: { name: "Levítico", testament: "AT" },
  NUM: { name: "Números", testament: "AT" },
  DEU: { name: "Deuteronomio", testament: "AT" },
  JOS: { name: "Josué", testament: "AT" },
  JDG: { name: "Jueces", testament: "AT" },
  RUT: { name: "Rut", testament: "AT" },
  "1SA": { name: "1 Samuel", testament: "AT" },
  "2SA": { name: "2 Samuel", testament: "AT" },
  "1KI": { name: "1 Reyes", testament: "AT" },
  "2KI": { name: "2 Reyes", testament: "AT" },
  "1CH": { name: "1 Crónicas", testament: "AT" },
  "2CH": { name: "2 Crónicas", testament: "AT" },
  EZR: { name: "Esdras", testament: "AT" },
  NEH: { name: "Nehemías", testament: "AT" },
  EST: { name: "Ester", testament: "AT" },
  JOB: { name: "Job", testament: "AT" },
  PSA: { name: "Salmos", testament: "AT" },
  PRO: { name: "Proverbios", testament: "AT" },
  ECC: { name: "Eclesiastés", testament: "AT" },
  SNG: { name: "Cantares", testament: "AT" },
  ISA: { name: "Isaías", testament: "AT" },
  JER: { name: "Jeremías", testament: "AT" },
  LAM: { name: "Lamentaciones", testament: "AT" },
  EZK: { name: "Ezequiel", testament: "AT" },
  DAN: { name: "Daniel", testament: "AT" },
  HOS: { name: "Oseas", testament: "AT" },
  JOL: { name: "Joel", testament: "AT" },
  AMO: { name: "Amós", testament: "AT" },
  OBA: { name: "Abdías", testament: "AT" },
  JON: { name: "Jonás", testament: "AT" },
  MIC: { name: "Miqueas", testament: "AT" },
  NAM: { name: "Nahúm", testament: "AT" },
  HAB: { name: "Habacuc", testament: "AT" },
  ZEP: { name: "Sofonías", testament: "AT" },
  HAG: { name: "Hageo", testament: "AT" },
  ZEC: { name: "Zacarías", testament: "AT" },
  MAL: { name: "Malaquías", testament: "AT" },
  MAT: { name: "Mateo", testament: "NT" },
  MRK: { name: "Marcos", testament: "NT" },
  LUK: { name: "Lucas", testament: "NT" },
  JHN: { name: "Juan", testament: "NT" },
  ACT: { name: "Hechos", testament: "NT" },
  ROM: { name: "Romanos", testament: "NT" },
  "1CO": { name: "1 Corintios", testament: "NT" },
  "2CO": { name: "2 Corintios", testament: "NT" },
  GAL: { name: "Gálatas", testament: "NT" },
  EPH: { name: "Efesios", testament: "NT" },
  PHP: { name: "Filipenses", testament: "NT" },
  COL: { name: "Colosenses", testament: "NT" },
  "1TH": { name: "1 Tesalonicenses", testament: "NT" },
  "2TH": { name: "2 Tesalonicenses", testament: "NT" },
  "1TI": { name: "1 Timoteo", testament: "NT" },
  "2TI": { name: "2 Timoteo", testament: "NT" },
  TIT: { name: "Tito", testament: "NT" },
  PHM: { name: "Filemón", testament: "NT" },
  HEB: { name: "Hebreos", testament: "NT" },
  JAS: { name: "Santiago", testament: "NT" },
  "1PE": { name: "1 Pedro", testament: "NT" },
  "2PE": { name: "2 Pedro", testament: "NT" },
  "1JN": { name: "1 Juan", testament: "NT" },
  "2JN": { name: "2 Juan", testament: "NT" },
  "3JN": { name: "3 Juan", testament: "NT" },
  JUD: { name: "Judas", testament: "NT" },
  REV: { name: "Apocalipsis", testament: "NT" },
};

async function main() {
  console.log("📖 Importando Biblia...");

  const filePath = join(process.cwd(), "bible.json");
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  console.log(`📚 Encontrados ${data.books.length} libros`);

  await prisma.bibleVerse.deleteMany();
  await prisma.bibleChapter.deleteMany();
  await prisma.bibleBook.deleteMany();
  console.log("🗑️  Datos anteriores eliminados");

  let totalVerses = 0;
  let sortOrder = 1;

  for (const book of data.books) {
    const bookInfo = BOOK_MAP[book.book_usfm] || {
      name: book.name,
      testament: "AT",
    };

    const createdBook = await prisma.bibleBook.create({
      data: {
        name: bookInfo.name,
        abbreviation: book.book_usfm,
        testament: bookInfo.testament,
        sortOrder: sortOrder,
      },
    });

    sortOrder++;

    for (const chapter of book.chapters) {
      const chapterNumber = parseInt(chapter.chapter_usfm.split(".")[1]);

      const createdChapter = await prisma.bibleChapter.create({
        data: {
          bookId: createdBook.id,
          chapterNumber: chapterNumber,
        },
      });

      const insertedVerses = new Set<number>();

      for (const item of chapter.items) {
        if (item.type === "verse" && item.verse_numbers?.length > 0) {
          const verseNumber = item.verse_numbers[0];
          const text = item.lines ? item.lines.join(" ") : "";

          if (text.trim() && !insertedVerses.has(verseNumber)) {
            insertedVerses.add(verseNumber);
            await prisma.bibleVerse.create({
              data: {
                chapterId: createdChapter.id,
                verseNumber: verseNumber,
                text: text.trim(),
              },
            });
            totalVerses++;
          }
        }
      }
    }

    process.stdout.write(`  ✅ ${bookInfo.name}\n`);
  }

  console.log(`\n🎉 Importación completada:`);
  console.log(`   📚 ${data.books.length} libros`);
  console.log(`   📝 ${totalVerses} versículos`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
