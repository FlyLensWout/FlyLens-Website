import { createClient } from "@sanity/client";
import { readdir } from "fs/promises";
import { resolve } from "path";

const client = createClient({
  projectId: "odzqgd33",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const videosDir = resolve("public/videos-mp4");

// Extract title from filename (e.g. "zeebrugge_sunset_7.mp4" -> "zeebrugge sunset 7")
function getTitle(fileName) {
  return fileName.replace(".mp4", "").replace(/_/g, " ");
}

// Extract location name from filename (e.g. "Ramskapelle_1.mp4" -> "Ramskapelle")
function getLocationName(fileName) {
  const name = fileName.replace(".mp4", "");
  // Remove the trailing _number
  return name.replace(/_\d+$/, "").replace(/_/g, " ");
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_API_TOKEN. Run with:");
    console.error("  SANITY_API_TOKEN=your-token node scripts/seed-portfolio.mjs");
    process.exit(1);
  }

  const files = (await readdir(videosDir)).filter((f) => f.endsWith(".mp4"));
  console.log(`Found ${files.length} videos\n`);

  // Delete all existing portfolio documents
  const existing = await client.fetch(
    `*[_type == "portfolio"]{ _id }`
  );
  console.log(`Deleting ${existing.length} existing portfolio documents...`);
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`DELETED: ${doc._id}`);
  }

  // Recreate all portfolio documents with cinematic tag
  let created = 0;

  for (const file of files) {
    const title = getTitle(file);
    const location = getLocationName(file);

    const doc = {
      _type: "portfolio",
      title: {
        nl: title,
        en: title,
      },
      videoFileName: file,
      tags: [location, "cinematic"],
      order: created + 1,
    };

    await client.create(doc);
    console.log(`CREATED: ${file} -> "${title}"`);
    created++;
  }

  console.log(`\nDone! Deleted: ${existing.length}, Created: ${created}`);
}

main().catch(console.error);
