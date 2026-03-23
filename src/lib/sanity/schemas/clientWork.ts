import { defineType, defineField } from "sanity";

export const clientWork = defineType({
  name: "clientWork",
  title: "Client Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),
    defineField({
      name: "videoFileName",
      title: "Video File Name",
      type: "string",
      description: "Optional: mp4 filename on Cloudflare R2 (e.g. Ramskapelle_1.mp4)",
    }),
    defineField({
      name: "images",
      title: "Project Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Project Date",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Date, New",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
