import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==========================================
  // CATEGORÍAS PRINCIPALES
  // ==========================================
  const asociacion = await prisma.category.upsert({
    where: { slug: "asociacion-salesianos-cooperadores" },
    update: {},
    create: {
      name: "Asociación de Salesianos Cooperadores",
      slug: "asociacion-salesianos-cooperadores",
      description: "Documentos oficiales de la Asociación",
      icon: "users",
      sortOrder: 1,
    },
  });

  const pvaCategory = await prisma.category.upsert({
    where: { slug: "pva" },
    update: {},
    create: {
      name: "PVA - Proyecto de Vida Apostólica",
      slug: "pva",
      description: "Proyecto de Vida Apostólica de los Salesianos Cooperadores",
      icon: "book-open",
      parentId: asociacion.id,
      sortOrder: 1,
    },
  });

  const estatuto = await prisma.category.upsert({
    where: { slug: "estatuto" },
    update: {},
    create: {
      name: "Estatuto",
      slug: "estatuto",
      description: "Estatuto de la Asociación de Salesianos Cooperadores",
      icon: "scroll",
      parentId: asociacion.id,
      sortOrder: 2,
    },
  });

  const reglamento = await prisma.category.upsert({
    where: { slug: "reglamento" },
    update: {},
    create: {
      name: "Reglamento",
      slug: "reglamento",
      description: "Reglamento de la Asociación",
      icon: "clipboard-list",
      parentId: asociacion.id,
      sortOrder: 3,
    },
  });

  const directorios = await prisma.category.upsert({
    where: { slug: "directorios" },
    update: {},
    create: {
      name: "Directorios",
      slug: "directorios",
      description: "Directorios de la Asociación",
      icon: "address-book",
      parentId: asociacion.id,
      sortOrder: 4,
    },
  });

  // Congregación Salesiana
  const congregacion = await prisma.category.upsert({
    where: { slug: "congregacion-salesiana" },
    update: {},
    create: {
      name: "Congregación Salesiana",
      slug: "congregacion-salesiana",
      description: "Documentos de la Congregación Salesiana",
      icon: "church",
      sortOrder: 2,
    },
  });

  const rectorMayor = await prisma.category.upsert({
    where: { slug: "rector-mayor" },
    update: {},
    create: {
      name: "Mensajes del Rector Mayor",
      slug: "rector-mayor",
      description: "Mensajes, cartas y documentos del Rector Mayor",
      icon: "message-circle",
      parentId: congregacion.id,
      sortOrder: 1,
    },
  });

  const aguinaldos = await prisma.category.upsert({
    where: { slug: "aguinaldos" },
    update: {},
    create: {
      name: "Aguinaldos",
      slug: "aguinaldos",
      description: "Aguinaldos del Rector Mayor",
      icon: "gift",
      parentId: congregacion.id,
      sortOrder: 2,
    },
  });

  const coordinadorMundial = await prisma.category.upsert({
    where: { slug: "coordinador-mundial" },
    update: {},
    create: {
      name: "Coordinador Mundial",
      slug: "coordinador-mundial",
      description: "Mensajes y comunicaciones del Coordinador Mundial",
      icon: "globe",
      parentId: congregacion.id,
      sortOrder: 3,
    },
  });

  // Región
  const region = await prisma.category.upsert({
    where: { slug: "region-interamerica" },
    update: {},
    create: {
      name: "Región Interamérica",
      slug: "region-interamerica",
      description: "Documentos de la Región Interamérica",
      icon: "map",
      sortOrder: 3,
    },
  });

  // Provincia
  const provincia = await prisma.category.upsert({
    where: { slug: "provincia" },
    update: {},
    create: {
      name: "Provincia",
      slug: "provincia",
      description: "Documentos provinciales",
      icon: "building",
      sortOrder: 4,
    },
  });

  const dirProvincial = await prisma.category.upsert({
    where: { slug: "directorio-provincial" },
    update: {},
    create: {
      name: "Directorio Provincial",
      slug: "directorio-provincial",
      description: "Directorio de la Provincia",
      icon: "map-pin",
      parentId: provincia.id,
      sortOrder: 1,
    },
  });

  const comunicados = await prisma.category.upsert({
    where: { slug: "comunicados-provinciales" },
    update: {},
    create: {
      name: "Comunicados Provinciales",
      slug: "comunicados-provinciales",
      description: "Comunicados oficiales de la Provincia",
      icon: "megaphone",
      parentId: provincia.id,
      sortOrder: 2,
    },
  });

  // Centro Local
  const centroLocal = await prisma.category.upsert({
    where: { slug: "centro-local" },
    update: {},
    create: {
      name: "Centro Local",
      slug: "centro-local",
      description: "Documentos del Centro Local",
      icon: "home",
      sortOrder: 5,
    },
  });

  // Formación
  const formacion = await prisma.category.upsert({
    where: { slug: "formacion" },
    update: {},
    create: {
      name: "Formación",
      slug: "formacion",
      description: "Materiales de formación inicial y permanente",
      icon: "graduation-cap",
      sortOrder: 6,
    },
  });

  const formacionInicial = await prisma.category.upsert({
    where: { slug: "formacion-inicial" },
    update: {},
    create: {
      name: "Formación Inicial",
      slug: "formacion-inicial",
      description: "Materiales de formación inicial de Cooperadores",
      icon: "book-reader",
      parentId: formacion.id,
      sortOrder: 1,
    },
  });

  const formacionPermanente = await prisma.category.upsert({
    where: { slug: "formacion-permanente" },
    update: {},
    create: {
      name: "Formación Permanente",
      slug: "formacion-permanente",
      description: "Materiales de formación permanente",
      icon: "book",
      parentId: formacion.id,
      sortOrder: 2,
    },
  });

  // Biblia
  const biblia = await prisma.category.upsert({
    where: { slug: "biblia" },
    update: {},
    create: {
      name: "Biblia",
      slug: "biblia",
      description: "Santa Biblia - Reina Valera 1960",
      icon: "book",
      sortOrder: 7,
    },
  });

  console.log("✅ Categorías creadas:");
  console.log("  - Asociación de Salesianos Cooperadores");
  console.log("  - Congregación Salesiana");
  console.log("  - Región Interamérica");
  console.log("  - Provincia");
  console.log("  - Centro Local");
  console.log("  - Formación");
  console.log("  - Biblia");

  // ==========================================
  // SEED DEL PVA (Ejemplo inicial)
  // ==========================================
  await prisma.pvaSection.upsert({
    where: { slug: "estatuto-capitulo-i-articulo-1" },
    update: {},
    create: {
      title: "Artículo 1 - Naturaleza de la Asociación",
      slug: "estatuto-capitulo-i-articulo-1",
      content:
        "La Asociación de Salesianos Cooperadores es una asociación de fieles de derecho diocesano, erigida canónicamente según los cánones 298-311 y 321-329 del Código de Derecho Canónico, que tiene por objeto la santificación personal de sus miembros mediante el ejercicio de las obras de apostolado salesiano.",
      chapter: 1,
      article: 1,
      sortOrder: 1,
    },
  });

  console.log("✅ PVA seed inicial creado");

  console.log("🎉 Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
