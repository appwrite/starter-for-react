import React, { useEffect, useMemo, useRef, useState } from "react";
import profileImg from "./assets/profile.jpg";
import heroLogo from "./assets/profile.jpg"; // ✅ using your profile as the logo above name (change later if you want)
import GitHubProjects from "./GitHubProjects.jsx";
import BlogSection from "./blog/BlogSection.jsx";

const NAME = "KAJAN SIVARAJA";
const ROLE = "Cyber Security | Blue Team • Pentesting • Secure Coding";
const TAGLINE =
  "I build secure systems, break insecure ones, and translate risk into action.";

const LINKS = [
  { label: "GitHub", href: "https://github.com/sksivakajan" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Email", href: "mailto:you@example.com" },
];

const SKILLS = [
  {
    group: "Security",
    items: ["SOC", "SIEM", "Threat Hunting", "Incident Response", "Vulnerability Management"],
  },
  { group: "Offense", items: ["Web Pentest", "Recon", "Burp Suite", "OWASP Top 10", "Nmap"] },
  { group: "Dev", items: ["Secure Coding", "React", "Node.js", "Python", "API Security"] },
  { group: "Tools", items: ["Wireshark", "ELK/Splunk", "Git", "Docker", "Linux"] },
];

const CERTS = [
  { name: "BSc (Hons) IT", meta: "Specializing in Cyber Security" },
  { name: "eJPT", meta: "Junior Penetration Tester" },
  { name: "ICCA", meta: "Cybersecurity Certification" },
];

function useRevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function formatPrompt(cmd) {
  return `kaju@security-lab:~$ ${cmd}`;
}

/* ✅ NEW: Animated hoodie hacker SVG block */
function HoodieHackerArt() {
  return (
    <div className="heroArt" aria-hidden="true">
      <svg className="hackerSvg" viewBox="0 0 520 260">
        <defs>
          <radialGradient id="glow" cx="70%" cy="60%" r="70%">
            <stop offset="0%" stopColor="rgba(0,255,200,.55)" />
            <stop offset="45%" stopColor="rgba(0,170,255,.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <linearGradient id="hood" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,.10)" />
            <stop offset="50%" stopColor="rgba(255,255,255,.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,.10)" />
          </linearGradient>

          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <pattern id="scanlines" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="1" fill="rgba(255,255,255,.06)" />
          </pattern>
        </defs>

        {/* background glow */}
        <circle cx="360" cy="150" r="190" fill="url(#glow)" filter="url(#soft)" />

        {/* floating hoodie hacker */}
        <g className="hackerFloat">
          {/* shadow */}
          <ellipse cx="360" cy="224" rx="130" ry="20" fill="rgba(0,0,0,.35)" />

          {/* hood outer */}
          <path
            d="M275 225c6-66 33-136 85-162 52-26 110-5 142 42 26 38 33 87 25 120-2 10-10 17-20 17H295c-12 0-21-8-20-17z"
            fill="rgba(255,255,255,.06)"
            stroke="rgba(255,255,255,.10)"
          />
          {/* hood inner */}
          <path
            d="M300 223c3-52 24-107 67-128 43-21 92-4 118 33 22 31 28 70 22 96H300z"
            fill="url(#hood)"
          />

          {/* face void */}
          <path
            d="M336 182c0-40 20-72 52-72s52 32 52 72c0 10-4 18-14 18h-76c-10 0-14-8-14-18z"
            fill="rgba(0,0,0,.60)"
            stroke="rgba(0,255,200,.18)"
          />

          {/* visor */}
          <rect
            x="344"
            y="150"
            width="96"
            height="42"
            rx="14"
            fill="rgba(10,15,18,.85)"
            stroke="rgba(0,255,200,.35)"
          />

          {/* eye lights (blink) */}
          <rect className="eye1" x="354" y="161" width="30" height="8" rx="4" fill="rgba(0,255,200,.55)" />
          <rect className="eye2" x="390" y="161" width="40" height="8" rx="4" fill="rgba(0,170,255,.40)" />

          {/* code text */}
          <g opacity=".85" className="codeFlicker">
            <text
              x="60"
              y="78"
              fill="rgba(0,255,200,.20)"
              fontSize="14"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              01001010 01000001 01001010 01010101
            </text>
            <text
              x="60"
              y="102"
              fill="rgba(0,170,255,.16)"
              fontSize="14"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              auth() • detect() • harden() • respond()
            </text>
            <text
              x="60"
              y="126"
              fill="rgba(255,255,255,.10)"
              fontSize="14"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              threat_radar: active — anomalies: scanning…
            </text>
          </g>
        </g>

        {/* scanlines */}
        <rect className="scanOverlay" x="0" y="0" width="520" height="260" fill="url(#scanlines)" />

        {/* moving sweep */}
        <rect className="scanSweep" x="-80" y="0" width="120" height="260" fill="rgba(0,255,200,.10)" />
      </svg>
    </div>
  );
}

function Terminal() {
  const [history, setHistory] = useState([
    { type: "out", text: "KAJU Terminal v2.6 — Type: help" },
    { type: "out", text: "Tip: try `skills`, `projects`, `certs`, `blog`, `contact`" },
  ]);
  const [value, setValue] = useState("");
  const endRef = useRef(null);

  const commands = useMemo(
    () => ({
      help: () => [
        "Available commands:",
        " - about",
        " - skills",
        " - projects",
        " - certs",
        " - blog",
        " - contact",
        " - clear",
      ],
      about: () => [TAGLINE, "Focus: security engineering, detection, and practical pentesting."],
      skills: () => SKILLS.flatMap((g) => [`${g.group}: ${g.items.join(", ")}`]),
      projects: () => ["Projects are auto-loaded from GitHub in the Projects section."],
      certs: () => CERTS.map((c) => `• ${c.name} — ${c.meta}`),
      blog: () => ["Blog posts live in src/blog/posts/*.md"],
      contact: () => [
        "Email: you@example.com",
        "GitHub: https://github.com/sksivakajan",
        "LinkedIn: https://linkedin.com/",
      ],
      clear: () => "__CLEAR__",
    }),
    []
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const run = (cmdRaw) => {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    setHistory((h) => [...h, { type: "in", text: formatPrompt(cmd) }]);

    const key = cmd.split(" ")[0].toLowerCase();
    const fn = commands[key];

    if (!fn) {
      setHistory((h) => [...h, { type: "out", text: `Command not found: ${key} (try help)` }]);
      return;
    }

    const res = fn();
    if (res === "__CLEAR__") {
      setHistory([{ type: "out", text: "KAJU Terminal v2.6 — Type: help" }]);
      return;
    }

    setHistory((h) => [...h, ...res.map((t) => ({ type: "out", text: t }))]);
  };

  return (
    <div className="terminal" data-reveal>
      <div className="terminalTop">
        <div className="dots">
          <span className="dot r" />
          <span className="dot y" />
          <span className="dot g" />
        </div>
        <div className="termTitle">interactive_shell</div>
        <div className="termMeta">secure • fast • minimal</div>
      </div>

      <div className="terminalBody" role="log" aria-live="polite">
        {history.map((line, idx) => (
          <div key={idx} className={`termLine ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="terminalInput"
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span className="prompt">›</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type a command…"
          spellCheck={false}
        />
        <button type="submit" className="btn mini">
          Run
        </button>
      </form>
    </div>
  );
}

function ThreatRadar() {
  const [level, setLevel] = useState(72);

  useEffect(() => {
    const t = setInterval(() => {
      setLevel((v) => clamp(v + (Math.random() * 10 - 5), 35, 96));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  const status = level > 80 ? "ELEVATED" : level > 60 ? "MONITORING" : level > 45 ? "STABLE" : "LOW";

  return (
    <div className="radarCard" data-reveal>
      <div className="radarHeader">
        <div>
          <div className="radarTitle">Threat Radar</div>
          <div className="radarSub">signal integrity • anomaly awareness</div>
        </div>
        <div className="radarStat">
          <div className="radarNum">{Math.round(level)}%</div>
          <div className={`radarBadge ${status.toLowerCase()}`}>{status}</div>
        </div>
      </div>

      <div className="radar">
        <div className="radarGrid" />
        <div className="radarSweep" />
        <div className="radarBlips">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={`blip b${i + 1}`} />
          ))}
        </div>
        <div className="radarCenter" />
      </div>

      <div className="radarFooter">
        <div className="miniLine">
          <span className="k">Mode:</span> Adaptive Scan
        </div>
        <div className="miniLine">
          <span className="k">Telemetry:</span> Active
        </div>
        <div className="miniLine">
          <span className="k">Last update:</span> just now
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="navInner">
        <a className="brand" href="#top" aria-label="Home">
          <span className="brandMark" />
          <span className="brandText">KAJU_SEC</span>
        </a>

        <nav className="navLinks" aria-label="Primary">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#certs">Certs</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="btn" href="#contact">
          Hire / Collab
        </a>
      </div>
    </header>
  );
}

function Section({ id, title, eyebrow, children }) {
  return (
    <section className="section" id={id}>
      <div className="sectionHead" data-reveal>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="heroLeft" data-reveal>
        <div className="pill">
          <span className="pulseDot" />
          Available for internships • projects • research
        </div>

        {/* ✅ NEW: logo above your name */}
        <div className="heroLogoRow">
          <img className="heroLogo" src={heroLogo} alt="Kaju logo" />
          <div className="heroLogoMeta">KAJU • Neon Ops</div>
        </div>

        <h1 className="glitch" data-text={NAME}>
          {NAME}
        </h1>

        <p className="role">{ROLE}</p>
        <p className="tagline">{TAGLINE}</p>

        <div className="ctaRow">
          <a className="btn primary" href="#projects">
            View Projects
          </a>
          <a className="btn ghost" href="#blog">
            Read Blog
          </a>
        </div>

        <div className="linkRow">
          {LINKS.map((l) => (
            <a key={l.label} className="chip" href={l.href} target="_blank" rel="noreferrer">
              <span className="chipDot" />
              {l.label}
            </a>
          ))}
        </div>

        {/* ✅ NEW: fill empty space with hacker art */}
        <HoodieHackerArt />

        <div className="metrics">
          <div className="metric">
            <div className="metricNum">01</div>
            <div className="metricText">Security mindset</div>
          </div>
          <div className="metric">
            <div className="metricNum">02</div>
            <div className="metricText">Hands-on projects</div>
          </div>
          <div className="metric">
            <div className="metricNum">03</div>
            <div className="metricText">Fast learning</div>
          </div>
        </div>
      </div>

      <div className="heroRight">
        <div className="profileCard" data-reveal>
          <div className="profileTop">
            <img className="profileImg" src={profileImg} alt="Kajan profile" />
            <div>
              <div className="profileName">{NAME}</div>
              <div className="profileMeta">GitHub: sksivakajan</div>
              <div className="profileMeta">Focus: SOC • AppSec • Pentest</div>
            </div>
          </div>
          <div className="profileLine" />
          <div className="profileStats">
            <div className="statBox">
              <div className="statK">Theme</div>
              <div className="statV">Neon Glass</div>
            </div>
            <div className="statBox">
              <div className="statK">Mode</div>
              <div className="statV">Stealth</div>
            </div>
            <div className="statBox">
              <div className="statK">Signal</div>
              <div className="statV">Active</div>
            </div>
          </div>
        </div>

        <ThreatRadar />
        <Terminal />
      </div>
    </section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Skills that ship real security" eyebrow="CAPABILITIES">
      <div className="grid2">
        {SKILLS.map((g) => (
          <div className="card" key={g.group} data-reveal>
            <div className="cardTitle">{g.group}</div>
            <div className="pillWrap">
              {g.items.map((s) => (
                <span className="pillSkill" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Projects from GitHub" eyebrow="AUTO LOADED">
      <GitHubProjects username="sksivakajan" limit={6} />
    </Section>
  );
}

function Blog() {
  return (
    <Section id="blog" title="Blog / Writeups" eyebrow="MY POSTS">
      <BlogSection />
    </Section>
  );
}

function Certs() {
  return (
    <Section id="certs" title="Education & Certifications" eyebrow="CREDENTIALS">
      <div className="grid3">
        {CERTS.map((c) => (
          <div className="card cert" key={c.name} data-reveal>
            <div className="certName">{c.name}</div>
            <div className="certMeta">{c.meta}</div>
            <div className="certLine" />
            <div className="certFoot">Verified • Practical • Skill-first</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Contact" eyebrow="LET’S BUILD">
      <div className="grid2">
        <div className="card" data-reveal>
          <div className="cardTitle">Send a message</div>
          <p className="cardBody">
            Want a security review, secure coding advice, or collaboration? Send a message.
          </p>

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo form: connect this to EmailJS / Formspree / your backend API.");
            }}
          >
            <div className="row">
              <input placeholder="Your name" required />
              <input placeholder="Email" type="email" required />
            </div>
            <textarea placeholder="Message" rows={5} required />
            <button className="btn primary" type="submit">
              Send
            </button>
          </form>
        </div>

        <div className="card" data-reveal>
          <div className="cardTitle">Quick links</div>
          <div className="stack" style={{ marginTop: 12 }}>
            {LINKS.map((l) => (
              <a key={l.label} className="quick" href={l.href} target="_blank" rel="noreferrer">
                <span className="quickIcon" />
                <div>
                  <div className="quickTitle">{l.label}</div>
                  <div className="quickMeta">{l.href}</div>
                </div>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerLeft">
          <span className="brandMark sm" />
          <span>
            © {new Date().getFullYear()} {NAME}
          </span>
        </div>
        <div className="footerRight">
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useRevealOnScroll();

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mx", x.toFixed(4));
      document.documentElement.style.setProperty("--my", y.toFixed(4));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="app">
      <div className="fx">
        <div className="grid" />
        <div className="scan" />
        <div className="noise" />
        <div className="vignette" />
      </div>

      <Nav />
      <main className="wrap">
        <Hero />
        <Skills />
        <Projects />
        <Blog />
        <Certs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}