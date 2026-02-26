import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, ShieldAlert, ShieldCheck, Target } from "lucide-react";

const cx = (...a) => a.filter(Boolean).join(" ");

function Card({ className, children }) {
  return <div className={cx("card", className)}>{children}</div>;
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function badgeFromScore(score) {
  if (score >= 16) return { label: "HIGH", cls: "sev high" };
  if (score >= 9) return { label: "MED", cls: "sev med" };
  return { label: "LOW", cls: "sev low" };
}

function Score({ likelihood, impact }) {
  const score = likelihood * impact;
  const b = badgeFromScore(score);
  return (
    <div className="score">
      <span className={b.cls}>{b.label}</span>
      <span className="scoreNum">{likelihood}×{impact} = {score}</span>
    </div>
  );
}

export default function ThreatModel() {
  // Unique model: your portfolio as a "system"
  const model = useMemo(
    () => ({
      title: "Interactive Threat Model — Personal Portfolio System",
      subtitle:
        "Click an asset to see related STRIDE threats, risk scoring, and mitigations. This demonstrates real security thinking.",
      assets: [
        { id: "frontend", name: "Frontend (React UI)", type: "App Surface" },
        { id: "api", name: "API / Backend (Optional)", type: "Service" },
        { id: "auth", name: "Auth / Admin Access", type: "Identity" },
        { id: "data", name: "Content Data (Projects/Blog)", type: "Data" },
        { id: "third", name: "Third-Party Integrations", type: "Dependency" },
        { id: "deploy", name: "Deployment Pipeline", type: "Supply Chain" },
      ],
      threats: [
        // Frontend
        {
          id: "t1",
          asset: "frontend",
          stride: "Tampering",
          title: "XSS via unsafe rendering",
          likelihood: 3,
          impact: 4,
          evidence: "User-controlled content injected into DOM without sanitization.",
          mitigations: ["Avoid dangerouslySetInnerHTML", "Validate/sanitize any dynamic HTML", "Use CSP headers"],
        },
        {
          id: "t2",
          asset: "frontend",
          stride: "Information Disclosure",
          title: "Leaking secrets in client bundle",
          likelihood: 2,
          impact: 5,
          evidence: "API keys accidentally committed or embedded in frontend env.",
          mitigations: ["Never store secrets in client", "Use server-side proxy for secret calls", "Rotate exposed keys"],
        },

        // API
        {
          id: "t3",
          asset: "api",
          stride: "Elevation of Privilege",
          title: "Broken access control on write endpoints",
          likelihood: 3,
          impact: 5,
          evidence: "Missing authz checks for create/update/delete operations.",
          mitigations: ["Enforce RBAC/ABAC", "Server-side authz checks", "Write tests for permissions"],
        },
        {
          id: "t4",
          asset: "api",
          stride: "Denial of Service",
          title: "Unbounded requests / no rate limiting",
          likelihood: 4,
          impact: 3,
          evidence: "No throttling, potentially expensive endpoints.",
          mitigations: ["Rate limit + WAF rules", "Caching", "Input size limits + timeouts"],
        },

        // Auth
        {
          id: "t5",
          asset: "auth",
          stride: "Spoofing",
          title: "Credential stuffing on admin login",
          likelihood: 3,
          impact: 4,
          evidence: "Password-only auth for admin panel.",
          mitigations: ["MFA", "Rate limiting", "IP reputation / lockouts", "Strong password policy"],
        },
        {
          id: "t6",
          asset: "auth",
          stride: "Repudiation",
          title: "No audit trail for admin actions",
          likelihood: 3,
          impact: 3,
          evidence: "No logs for content edits or deployments.",
          mitigations: ["Audit logs", "Signed commits", "Immutable log storage (basic)"],
        },

        // Data
        {
          id: "t7",
          asset: "data",
          stride: "Tampering",
          title: "Unauthorized content modification",
          likelihood: 2,
          impact: 4,
          evidence: "Weak controls on CMS/write channel.",
          mitigations: ["Signed content changes", "PR review workflow", "Least privilege write access"],
        },
        {
          id: "t8",
          asset: "data",
          stride: "Information Disclosure",
          title: "PII exposure in public repo",
          likelihood: 3,
          impact: 3,
          evidence: "Accidental upload of personal documents or private data.",
          mitigations: ["Repo scanning", "Pre-commit hooks", "Review before push", "Use .gitignore properly"],
        },

        // Third-party
        {
          id: "t9",
          asset: "third",
          stride: "Tampering",
          title: "Dependency supply-chain compromise",
          likelihood: 2,
          impact: 5,
          evidence: "Installing packages without lockfile hygiene.",
          mitigations: ["Pin versions + lockfile", "npm audit + review", "Use trusted packages", "SCA scanning"],
        },

        // Deployment
        {
          id: "t10",
          asset: "deploy",
          stride: "Elevation of Privilege",
          title: "CI token leakage → repo takeover",
          likelihood: 2,
          impact: 5,
          evidence: "Secrets printed in logs or stored in repo.",
          mitigations: ["Secret masking", "Least privilege tokens", "Rotate secrets", "Separate envs"],
        },
        {
          id: "t11",
          asset: "deploy",
          stride: "Denial of Service",
          title: "Build pipeline disruption",
          likelihood: 3,
          impact: 2,
          evidence: "No fallback deploy strategy or cache invalidation issues.",
          mitigations: ["Rollback strategy", "Cache controls", "Build timeouts + alerts"],
        },
      ],
    }),
    []
  );

  const [activeAsset, setActiveAsset] = useState(model.assets[0].id);
  const [minSev, setMinSev] = useState("LOW");
  const [stride, setStride] = useState("ALL");

  const threatsForAsset = model.threats.filter((t) => t.asset === activeAsset);

  const filtered = threatsForAsset.filter((t) => {
    const score = t.likelihood * t.impact;
    const sev = badgeFromScore(score).label; // LOW/MED/HIGH

    const sevOk =
      minSev === "LOW" ? true : minSev === "MED" ? sev === "MED" || sev === "HIGH" : sev === "HIGH";

    const strideOk = stride === "ALL" ? true : t.stride === stride;

    return sevOk && strideOk;
  });

  const activeAssetObj = model.assets.find((a) => a.id === activeAsset);

  const strideOptions = ["ALL", "Spoofing", "Tampering", "Repudiation", "Information Disclosure", "Denial of Service", "Elevation of Privilege"];

  return (
    <div className="page">
      <header className="nav">
        <div className="navInner">
          <Link className="btn" to="/">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="brandInline">
            <Target size={18} />
            <span className="brandText">Threat Model</span>
          </div>

          <div />
        </div>
      </header>

      <main className="container">
        <div className="tmHead">
          <div>
            <div className="kicker">Interactive</div>
            <h1 className="h1">{model.title}</h1>
            <p className="muted lead">{model.subtitle}</p>
          </div>

          <Card className="tmFilters">
            <div className="filterTop">
              <Filter size={16} />
              <div className="h3">Filters</div>
            </div>

            <div className="filterGrid">
              <label className="field">
                <span className="muted small">Minimum Severity</span>
                <select value={minSev} onChange={(e) => setMinSev(e.target.value)}>
                  <option value="LOW">LOW+</option>
                  <option value="MED">MED+</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </label>

              <label className="field">
                <span className="muted small">STRIDE</span>
                <select value={stride} onChange={(e) => setStride(e.target.value)}>
                  {strideOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Card>
        </div>

        <div className="tmGrid">
          {/* Asset map */}
          <Card className="assetMap">
            <div className="assetHeader">
              <div className="h3">Assets</div>
              <div className="muted small">Click an asset</div>
            </div>

            <div className="assetList">
              {model.assets.map((a) => (
                <button
                  key={a.id}
                  className={cx("assetBtn", a.id === activeAsset && "active")}
                  onClick={() => setActiveAsset(a.id)}
                  type="button"
                >
                  <div className="assetName">{a.name}</div>
                  <div className="muted small">{a.type}</div>
                </button>
              ))}
            </div>

            <div className="assetFooter">
              <div className="muted small">Selected</div>
              <div className="assetSelected">{activeAssetObj?.name}</div>
            </div>
          </Card>

          {/* Threats */}
          <div className="threatCol">
            <Card className="threatHeader">
              <div>
                <div className="kicker">Threats</div>
                <div className="h3">{activeAssetObj?.name}</div>
                <div className="muted small">{filtered.length} item(s) match filters</div>
              </div>
              <div className="legend">
                <span className="sev low">LOW</span>
                <span className="sev med">MED</span>
                <span className="sev high">HIGH</span>
              </div>
            </Card>

            <div className="threatList">
              {filtered.map((t) => (
                <Card key={t.id} className="threatCard">
                  <div className="threatTop">
                    <div className="threatTitleRow">
                      <div className="h3">{t.title}</div>
                      <Score likelihood={t.likelihood} impact={t.impact} />
                    </div>

                    <div className="pillRow">
                      <Pill>{t.stride}</Pill>
                      <Pill>Asset: {activeAssetObj?.type}</Pill>
                    </div>
                  </div>

                  <div className="threatBody">
                    <div className="split">
                      <div className="block">
                        <div className="blockTitle">
                          <ShieldAlert size={16} /> Evidence / Concern
                        </div>
                        <p className="muted p">{t.evidence}</p>
                      </div>

                      <div className="block">
                        <div className="blockTitle">
                          <ShieldCheck size={16} /> Mitigations
                        </div>
                        <ul className="list">
                          {t.mitigations.map((m) => (
                            <li key={m} className="muted">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {!filtered.length && (
                <Card className="threatCard">
                  <div className="h3">No threats match your filters</div>
                  <p className="muted p">Try lowering the minimum severity or changing STRIDE filter.</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Card className="tmNote">
          <div className="h3">How to use this in interviews</div>
          <p className="muted p">
            Tell them: “I structure projects with assets, threats (STRIDE), likelihood/impact scoring,
            and mitigations — the same way real teams do threat modeling.”
          </p>
        </Card>
      </main>
    </div>
  );
}