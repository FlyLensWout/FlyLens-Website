import { createClient } from "@sanity/client";
import { readdir } from "fs/promises";
import { resolve } from "path";

const client = createClient({
  projectId: "usrk6gtp",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const videosDir = resolve("public/videos-mp4");

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

  // Check existing documents to avoid duplicates
  const existing = await client.fetch(
    `*[_type == "portfolio"]{ videoFileName }`
  );
  const existingFiles = new Set(existing.map((d) => d.videoFileName));

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    if (existingFiles.has(file)) {
      console.log(`SKIP: ${file} (already exists)`);
      skipped++;
      continue;
    }

    const location = getLocationName(file);

    const doc = {
      _type: "portfolio",
      title: {
        nl: location,
        en: location,
      },
      description: {
        nl: `${file}`,
        en: `${file}`,
      },
      videoFileName: file,
      tags: [location],
      order: created + skipped + 1,
    };

    await client.create(doc);
    console.log(`CREATED: ${file} -> "${location}"`);
    created++;
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
}

main().catch(console.error);
