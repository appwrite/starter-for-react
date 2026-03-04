import React, { useEffect, useMemo, useState } from "react";

export default function GitHubProjects({ username = "sksivakajan", limit = 6 }) {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  const pinnedLikeSort = useMemo(() => {
    return (a, b) => {
      const stars = (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
      if (stars !== 0) return stars;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus({ loading: true, error: "" });

        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );

        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

        const data = await res.json();

        const filtered = (Array.isArray(data) ? data : [])
          .filter((r) => !r.fork)
          .sort(pinnedLikeSort)
          .slice(0, limit);

        if (!alive) return;
        setRepos(filtered);
        setStatus({ loading: false, error: "" });
      } catch (e) {
        if (!alive) return;
        setStatus({ loading: false, error: e?.message || "Failed to load repos" });
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [username, limit, pinnedLikeSort]);

  return (
    <div className="grid3">
      {status.loading && (
        <div className="card">
          <div className="cardTitle">Loading projects…</div>
          <p className="cardBody">Fetching from GitHub API.</p>
        </div>
      )}

      {status.error && (
        <div className="card">
          <div className="cardTitle">Couldn’t load GitHub projects</div>
          <p className="cardBody">{status.error}</p>
          <p className="cardBody">Tip: GitHub rate limit may be hit. Refresh later.</p>
        </div>
      )}

      {!status.loading &&
        !status.error &&
        repos.map((r) => (
          <article className="card proj" key={r.id}>
            <div className="projTop">
              <div className="projTitle">{r.name}</div>
              <div className="projBadge">★ {r.stargazers_count ?? 0}</div>
            </div>

            <p className="projDesc">{r.description || "No description provided."}</p>

            <div className="tagRow">
              {r.language ? <span className="tag">{r.language}</span> : null}
              <span className="tag">
                Updated: {new Date(r.updated_at).toLocaleDateString()}
              </span>
            </div>

            <div className="projActions">
              <a className="btn mini" href={r.html_url} target="_blank" rel="noreferrer">
                View Repo
              </a>
              {r.homepage ? (
                <a className="btn mini ghost" href={r.homepage} target="_blank" rel="noreferrer">
                  Live
                </a>
              ) : null}
            </div>
          </article>
        ))}
    </div>
  );
}