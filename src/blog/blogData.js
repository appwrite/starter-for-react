import { marked } from "marked";

const modules = import.meta.glob("./posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: raw };

  const fmBlock = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trimStart();

  const data = {};
  for (const line of fmBlock.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key === "tags") {
      try {
        const arr = JSON.parse(value.replace(/'/g, '"'));
        data.tags = Array.isArray(arr) ? arr.map(String) : [];
      } catch {
        data.tags = value
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      continue;
    }

    data[key] = value;
  }

  return { data, content };
}

export function getPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const slug = path.split("/").pop().replace(".md", "");

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      html: marked.parse(content),
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}