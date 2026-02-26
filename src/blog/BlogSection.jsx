import React, { useMemo, useState } from "react";
import { getPosts } from "./blogData";

export default function BlogSection() {
  const posts = useMemo(() => getPosts(), []);
  const [active, setActive] = useState(posts[0]?.slug || "");
  const current = posts.find((p) => p.slug === active);

  return (
    <div className="grid2">
      <div className="card">
        <div className="cardTitle">Blog / Writeups</div>
        <p className="cardBody">
          Create posts as Markdown files in <code>src/blog/posts</code>.
        </p>

        <div className="stack" style={{ marginTop: 12 }}>
          {posts.map((p) => (
            <button
              key={p.slug}
              className="quick"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => setActive(p.slug)}
              type="button"
            >
              <div>
                <div className="quickTitle">{p.title}</div>
                <div className="quickMeta">
                  {p.date} {p.tags?.length ? ` • ${p.tags.join(", ")}` : ""}
                </div>
              </div>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="cardTitle">{current?.title || "No posts yet"}</div>

        <div className="tagRow" style={{ marginBottom: 10 }}>
          {current?.tags?.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        {current ? (
          <div className="blogHtml" dangerouslySetInnerHTML={{ __html: current.html }} />
        ) : (
          <p className="cardBody">
            Add your first post: <code>src/blog/posts/my-first-post.md</code>
          </p>
        )}
      </div>
    </div>
  );
}