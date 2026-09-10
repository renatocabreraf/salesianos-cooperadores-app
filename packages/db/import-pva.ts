import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 150);
}

async function main() {
  console.log("📖 Importando PVA...");

  const filePath = join(process.cwd(), "pva.txt");
  const raw = readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  await prisma.pvaSection.deleteMany();
  console.log("🗑️  Datos anteriores eliminados");

  let currentChapter = 0;
  let currentArticle = 0;
  let currentTitle = "";
  let currentContent: string[] = [];
  let sortOrder = 0;
  let inContent = false;

  const sections: Array<{
    title: string;
    slug: string;
    content: string;
    chapter: number;
    article: number | null;
    sortOrder: number;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^\d+$/.test(line)) continue;

    if (line === "PROEMIO") {
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          slug: slugify(currentTitle) + `-c${currentChapter}-a${currentArticle}`,
          content: currentContent.join("\n").trim(),
          chapter: currentChapter,
          article: currentArticle || null,
          sortOrder: sortOrder++,
        });
      }
      currentChapter = 0;
      currentArticle = 0;
      currentTitle = "Proemio";
      currentContent = [];
      inContent = true;
      continue;
    }

    if (line === "ESTATUTO" || line.includes("REGLAMENTO")) {
      continue;
    }

    const chapterMatch = line.match(/^Capítulo\s+([IVXLCDM]+)/i);
    if (chapterMatch) {
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          slug: slugify(currentTitle) + `-c${currentChapter}-a${currentArticle}`,
          content: currentContent.join("\n").trim(),
          chapter: currentChapter,
          article: currentArticle || null,
          sortOrder: sortOrder++,
        });
      }
      currentChapter++;
      currentArticle = 0;
      currentTitle = "";
      currentContent = [];
      inContent = false;
      continue;
    }

    const artMatch = line.match(/^Art\.\s*(\d+)\.\s*(.*)/);
    if (artMatch) {
      if (currentTitle && currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          slug: slugify(currentTitle) + `-c${currentChapter}-a${currentArticle}`,
          content: currentContent.join("\n").trim(),
          chapter: currentChapter,
          article: currentArticle || null,
          sortOrder: sortOrder++,
        });
      }
      currentArticle = parseInt(artMatch[1]);
      currentTitle = artMatch[2] ? `Art. ${artMatch[1]}. ${artMatch[2]}`.trim() : `Art. ${artMatch[1]}`;
      currentContent = [];
      inContent = true;
      continue;
    }

    if (inContent && currentTitle) {
      if (
        line.includes("Proyecto de Vida Apostólica") ||
        line.includes("ESTATUTO") ||
        line.includes("REGLAMENTO") ||
        line === "ASOCIACIÓN DE SALESIANOS COOPERADORES" ||
        line.startsWith("DIREZIONE GENERALE")
      ) {
        continue;
      }
      currentContent.push(line);
    }
  }

  if (currentTitle && currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      slug: slugify(currentTitle) + `-c${currentChapter}-a${currentArticle}`,
      content: currentContent.join("\n").trim(),
      chapter: currentChapter,
      article: currentArticle || null,
      sortOrder: sortOrder++,
    });
  }

  console.log(`📝 Encontradas ${sections.length} secciones`);

  for (const section of sections) {
    await prisma.pvaSection.create({
      data: {
        title: section.title,
        slug: section.slug,
        content: section.content,
        chapter: section.chapter,
        article: section.article,
        sortOrder: section.sortOrder,
      },
    });
  }

  console.log(`\n🎉 Importación del PVA completada:`);
  console.log(`   📄 ${sections.length} secciones importadas`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
