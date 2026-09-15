import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, ArrowUpRight, BrainCircuit, Check, ChevronRight, CloudCog,
  Code2, Database, Github, Linkedin, Mail, Menu, Moon, Network,
  ScanText, ServerCog, Sparkles, Sun, X, Zap
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ChatWidget from "./components/chatbot/ChatWidget";
import "./styles.css";

const oldProjects = [
  {
    title: "Generative AI Text Summarizer",
    category: "GENAI / NLP",
    description: "Abstractive summarization using Hugging Face Transformers with BART/T5 and a Streamlit interface for interactive text summarization.",
    stack: ["Python", "BART", "Transformers", "Streamlit"],
    link: "https://github.com/Mohan-Akash/genai-text-summarizer",
    featured: true,
    icon: Sparkles
  },
  {
    title: "Fake News Analysis in Social Media",
    category: "NLP / ML",
    description: "Flask application that classifies fake and real news using text preprocessing, TF-IDF and machine learning.",
    stack: ["Python", "Flask", "NLP", "Scikit-learn"],
    link: "https://github.com/Mohan-Akash/Fake-News-Analysis-in-Social-Media",
    icon: BrainCircuit
  },
  {
    title: "Malaria Detection using CNN",
    category: "COMPUTER VISION",
    description: "CNN-based image classification project using TensorFlow and OpenCV to detect malaria from cell images.",
    stack: ["TensorFlow", "OpenCV", "CNN"],
    link: "https://github.com/Mohan-Akash",
    icon: ScanText
  },
  {
    title: "COVID-19 Data Dashboard",
    category: "ANALYTICS",
    description: "Interactive Power BI dashboard for global COVID-19 cases, deaths, recovery and country-level comparisons.",
    stack: ["Power BI", "Excel", "Data Viz"],
    link: "https://github.com/Mohan-Akash/Covid19_Analysis-Using-Power-Bi",
    icon: Database
  },
  {
    title: "Car Price Prediction",
    category: "MACHINE LEARNING",
    description: "Regression project covering exploratory analysis, feature engineering, model training and evaluation.",
    stack: ["Python", "Scikit-learn", "EDA"],
    link: "https://github.com/Mohan-Akash",
    icon: Code2
  },
  {
    title: "Sugarcane Production Analysis",
    category: "DATA ANALYTICS",
    description: "Data analysis of global sugarcane production trends using Python data tools and visualization.",
    stack: ["Pandas", "Matplotlib", "Seaborn"],
    link: "https://github.com/Mohan-Akash",
    icon: Database
  },
  {
    title: "Expense Tracker",
    category: "BACKEND / WEB",
    description: "Flask application for adding, filtering, deleting and analyzing daily expenses with CSV-backed storage.",
    stack: ["Flask", "Python", "CSV"],
    link: "https://github.com/Mohan-Akash",
    icon: ServerCog
  }
];

const currentWork = [
  {
    number: "01",
    title: "Enterprise RAG & Document Intelligence",
    description: "Building document retrieval workflows with ingestion, indexing and retrieval using Azure AI Search and Blob Storage.",
    tags: ["RAG", "Azure AI Search", "Blob Storage"],
    icon: Network
  },
  {
    number: "02",
    title: "OCR & Document Processing",
    description: "Working on document-processing workflows involving OCR, chunking and downstream retrieval/AI pipelines.",
    tags: ["OCR", "Chunking", "Document AI"],
    icon: ScanText
  },
  {
    number: "03",
    title: "Azure AI Foundry & LLM Workflows",
    description: "Using Azure AI Foundry, LLM integrations and Hugging Face Transformers to build and experiment with Generative AI workflows.",
    tags: ["AI Foundry", "LLMs", "Transformers"],
    icon: CloudCog
  },
  {
    number: "04",
    title: "LLM Observability & Evaluation",
    description: "Using Langfuse for tracing, monitoring and evaluating LLM-powered application behavior.",
    tags: ["Langfuse", "Tracing", "Evaluation"],
    icon: Zap
  },
  {
    number: "05",
    title: "Backend & ETL Engineering",
    description: "Developing Python/FastAPI services and ETL pipelines for structured data processing and internal workflows.",
    tags: ["Python", "FastAPI", "ETL"],
    icon: ServerCog
  }
];

const skills = [
  ["AI / Generative AI", "Generative AI · RAG · LLMs · NLP · Transformers · Machine Learning · Deep Learning"],
  ["Azure AI", "Azure AI Foundry · Azure AI Search · Azure Blob Storage"],
  ["Backend & Data", "Python · FastAPI · Flask · SQL · ETL · Pandas · NumPy"],
  ["ML / CV", "Scikit-learn · TensorFlow · OpenCV · NLTK"],
  ["Engineering Tools", "Langfuse · Git · Streamlit · Jupyter · VS Code · Power BI"]
];

function CustomCursor() {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [hover, setHover] = React.useState(false);
  const [click, setClick] = React.useState(false);

  React.useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => { setClick(true); setTimeout(() => setClick(false), 180); };
    const over = (e) => {
      const interactive = e.target.closest("a, button, .project, .work-card, .skill-row");
      setHover(Boolean(interactive));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    document.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div className={`cursor-dot ${hover ? "cursor-hover" : ""} ${click ? "cursor-click" : ""}`}
           style={{ left: pos.x, top: pos.y }} />
      <div className={`cursor-ring ${hover ? "ring-hover" : ""}`}
           style={{ left: pos.x, top: pos.y }} />
    </>
  );
}

function Magnetic({ children, strength = 0.18 }) {
  const ref = React.useRef(null);
  const [style, setStyle] = React.useState({});
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setStyle({ transform: `translate(${x * strength}px, ${y * strength}px)` });
  };
  const reset = () => setStyle({ transform: "translate(0,0)" });
  return <span ref={ref} className="magnetic" style={style} onMouseMove={onMove} onMouseLeave={reset}>{children}</span>;
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [menu, setMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const visibleProjects = showAll ? oldProjects : oldProjects.slice(0, 4);

  return (
    <div className="app">
      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="logo" href="#home">
          <span>MA</span>
          <b>Mohan Akash</b>
        </a>

        <nav className={menu ? "nav-links open" : "nav-links"}>
          {["About", "Work", "Projects", "Skills", "Education"].map((x) => (
            <a key={x} href={`#${x.toLowerCase()}`} onClick={() => setMenu(false)}>{x}</a>
          ))}
          <a href="#contact" onClick={() => setMenu(false)} className="nav-talk">Let's talk <ArrowUpRight size={14}/></a>
        </nav>

        <div className="nav-tools">
          <button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
            {menu ? <X size={19}/> : <Menu size={19}/>}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="eyebrow">
              <span className="pulse" /> ARTIFICIAL INTELLIGENCE ENGINEER · KSHema
            </motion.div>
            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.1}}>
              I build <span>AI systems</span><br/>for real workflows.
            </motion.h1>
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.2}}>
              Generative AI, RAG, OCR, backend engineering and Azure — turning documents,
              data and LLMs into useful applications.
            </motion.p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}} className="hero-actions">
              <Magnetic><a className="btn primary" href="#work">Explore my work <ArrowDown size={15}/></a></Magnetic>
              <Magnetic><a className="btn" href="https://github.com/Mohan-Akash" target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a></Magnetic>
              <Magnetic><a className="btn" href="https://www.linkedin.com/in/mohan-akash-a765412a9/" target="_blank" rel="noreferrer"><Linkedin size={15}/> LinkedIn</a></Magnetic>
            </motion.div>
            <div className="hero-stats">
              <div><strong>GenAI</strong><span>RAG · LLMs · OCR</span></div>
              <div><strong>Backend</strong><span>Python · FastAPI · ETL</span></div>
              <div><strong>Cloud</strong><span>Azure AI · Search</span></div>
            </div>
          </div>

          <motion.div className="hero-visual" style={{y:orbY}}>
            <div className="grid-ring ring-a" />
            <div className="grid-ring ring-b" />
            <div className="grid-ring ring-c" />
            <motion.div className="ai-core" animate={{rotate:360}} transition={{duration:35,repeat:Infinity,ease:"linear"}}>
              <div className="core-inner"><BrainCircuit size={38}/><span>AI</span></div>
            </motion.div>
            <motion.div className="floating-card fc-1" animate={{y:[0,-10,0]}} transition={{duration:4,repeat:Infinity}}>
              <Network size={15}/><span>RAG</span>
            </motion.div>
            <motion.div className="floating-card fc-2" animate={{y:[0,10,0]}} transition={{duration:4.5,repeat:Infinity}}>
              <ScanText size={15}/><span>OCR</span>
            </motion.div>
            <motion.div className="floating-card fc-3" animate={{y:[0,-7,0]}} transition={{duration:5,repeat:Infinity}}>
              <CloudCog size={15}/><span>Azure AI</span>
            </motion.div>
            <div className="orbit-dot dot-a" /><div className="orbit-dot dot-b" />
          </motion.div>
        </section>

        <div className="ticker">
          <div className="ticker-track">
            <span>PYTHON</span><i>✦</i><span>GENERATIVE AI</span><i>✦</i><span>RAG</span><i>✦</i>
            <span>OCR</span><i>✦</i><span>AZURE AI FOUNDRY</span><i>✦</i><span>FASTAPI</span><i>✦</i>
            <span>LLMs</span><i>✦</i><span>LANGFUSE</span><i>✦</i>
            <span>PYTHON</span><i>✦</i><span>GENERATIVE AI</span><i>✦</i><span>RAG</span><i>✦</i>
            <span>OCR</span><i>✦</i><span>AZURE AI FOUNDRY</span><i>✦</i><span>FASTAPI</span>
          </div>
        </div>

        <section className="section story-section" id="about">
          <SectionHead num="01" title="About" />
          <div className="about-layout">
            <motion.div className="big-copy" initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:.2}}>
              I work where <em>AI meets engineering</em> — taking documents and data
              through ingestion, OCR, retrieval, LLM orchestration and evaluation to create useful systems.
            </motion.div>
            <div className="about-side">
              <p>My current focus is production-oriented Generative AI: RAG pipelines, document intelligence, Azure AI services, Python/FastAPI backends and LLM observability.</p>
              <div className="mini-tags"><span>Build</span><span>Retrieve</span><span>Evaluate</span><span>Automate</span></div>
            </div>
          </div>

          <div className="rag-showcase">
            <div className="rag-copy">
              <span className="eyebrow">HOW I THINK ABOUT RAG</span>
              <h2>From a document<br/><em>to an answer.</em></h2>
              <p>Scroll through the pipeline. Each stage represents a practical part of a document-intelligence workflow.</p>
            </div>
            <div className="rag-pipeline">
              {[
                ["01","DOCUMENT","PDF / IMAGE"],
                ["02","OCR","TEXT EXTRACTION"],
                ["03","CHUNK","CONTEXT WINDOWS"],
                ["04","EMBED","VECTOR REPRESENTATION"],
                ["05","RETRIEVE","AZURE AI SEARCH"],
                ["06","GENERATE","LLM RESPONSE"]
              ].map(([n,title,sub], i) => (
                <motion.div
                  className="rag-node"
                  key={n}
                  initial={{opacity:0,x:30}}
                  whileInView={{opacity:1,x:0}}
                  viewport={{once:false, amount:.2}}
                  transition={{delay:i*.1}}
                >
                  <span className="rag-num">{n}</span>
                  <div className="rag-node-main">
                    <div className="rag-icon"><span /></div>
                    <div><b>{title}</b><small>{sub}</small></div>
                  </div>
                  {i < 5 && <motion.div className="rag-connector" initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:false, amount:.2}} transition={{delay:i*.1+.15}} />}
                </motion.div>
              ))}
              <motion.div className="rag-answer" initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{once:false, amount:.2}} transition={{delay:.7}}>
                <Check size={16}/><span>Relevant context → grounded answer</span>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section" id="work">
          <SectionHead num="02" title="Current Work" />
          <div className="work-intro">
            <h2>What I'm<br/><span>building now.</span></h2>
            <p>Selected areas from my professional AI engineering work. Public descriptions stay intentionally high-level while showing the engineering problems I work on.</p>
          </div>
          <div className="work-grid">
            {currentWork.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.number} className="work-card"
                  initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:.2}} transition={{delay:i*.08}}>
                  <div className="work-top"><span>{item.number}</span><Icon size={18}/></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div>
                </motion.article>
              );
            })}
          </div>

          <div className="career-story">
            <div className="career-story-head">
              <span className="eyebrow">THE PATH</span>
              <h2>Learning → building →<br/><em>shipping AI.</em></h2>
            </div>
            <div className="career-story-track">
              <div className="career-progress"></div>
              {[
                ["2024","AI Intern","SmartInternz","AI / ML foundations"],
                ["FEB 2026","IT Intern","Kshema General Insurance","ETL · FastAPI · RAG"],
                ["AUG 2026","AI Software Engineer","Kshema General Insurance","GenAI · OCR · Azure · LLMs"]
              ].map(([year,role,company,focus], i) => (
                <motion.div className="career-story-item" key={year}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:.2}} transition={{delay:i*.12}}>
                  <div className="career-story-dot"></div>
                  <span>{year}</span>
                  <div><h3>{role}</h3><p>{company}</p><small>{focus}</small></div>
                  <b>0{i+1}</b>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="career">
            <div className="career-line" />
            <div className="career-item">
              <span>Aug 2026 — Present</span>
              <div><h3>Artificial Intelligence Engineer</h3><p>Kshema General Insurance Limited · Full-time</p></div>
              <b>01</b>
            </div>
            <div className="career-item">
              <span>Feb 2026 — Aug 2026</span>
              <div><h3>Information Technology Intern</h3><p>Kshema General Insurance Limited · Internship</p></div>
              <b>02</b>
            </div>
            <div className="career-item">
              <span>Jun 2024 — Nov 2024</span>
              <div><h3>Artificial Intelligence Intern</h3><p>SmartInternz · Remote</p></div>
              <b>03</b>
            </div>
          </div>
        </section>

        <section className="section projects" id="projects">
          <SectionHead num="03" title="Projects" />
          <div className="project-heading">
            <div><h2>Things I built<br/><span>before production.</span></h2></div>
            <p>My earlier projects cover Generative AI, NLP, computer vision, machine learning, analytics and backend development.</p>
          </div>
          <div className="project-grid">
            {visibleProjects.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.article className={p.featured ? "project featured" : "project"} key={p.title}
                  initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:.2}} transition={{delay:(i%3)*.07}}>
                  <div className="project-head"><span>{p.category}</span><a href={p.link} target="_blank" rel="noreferrer"><ArrowUpRight size={17}/></a></div>
                  <div className="project-icon"><Icon size={23}/></div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tags">{p.stack.map(s=><span key={s}>{s}</span>)}</div>
                </motion.article>
              );
            })}
          </div>
          <button className="show-more" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "Show all projects"} <ChevronRight size={15}/>
          </button>
        </section>

        <section className="section skills" id="skills">
          <SectionHead num="04" title="Skills" />
          <div className="skills-wrap">
            {skills.map(([name, text], i) => (
              <motion.div className="skill-row" key={name} initial={{opacity:0,x:-15}} whileInView={{opacity:1,x:0}} viewport={{once:false, amount:.2}} transition={{delay:i*.08}}>
                <span>0{i+1}</span><h3>{name}</h3><p>{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section education" id="education">
          <SectionHead num="07" title="Education & Credentials" />
          <div className="edu-grid">
            <div className="edu-main">
              <span>2021 — 2025</span>
              <h2>B.Tech — Computer Science & Engineering</h2>
              <p>Kallam Haranadhareddy Institute of Technology · Guntur, Andhra Pradesh</p>
              <strong>8.22 <small>/ 10 CGPA</small></strong>
            </div>
            <div className="edu-secondary">
              <div><span>2021</span><p>Class XII · CBSE · <b>82%</b></p></div>
              <div><span>2019</span><p>Class X · CBSE · <b>89%</b></p></div>
            </div>
          </div>
          <div className="certs">
            <div><span>ORACLE · 2025</span><h3>Cloud Infrastructure Data Science Professional</h3></div>
            <div><span>ORACLE · 2025</span><h3>Cloud Infrastructure Generative AI Professional</h3></div>
            <div><span>TATA FORAGE</span><h3>GenAI Powered Data Analytics Job Simulation</h3></div>
          </div>
        </section>

        <section className="principles section">
          <SectionHead num="06" title="Engineering Principles" />
          <div className="principles-grid">
            <div><span>01</span><h3>Useful over flashy</h3><p>AI should solve a real workflow, not just produce a demo.</p></div>
            <div><span>02</span><h3>Grounded over guessed</h3><p>Retrieval, context and evaluation matter when answers need to be trusted.</p></div>
            <div><span>03</span><h3>Measured over assumed</h3><p>Observability and evaluation make LLM applications easier to improve.</p></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:.2}}>
            <span className="eyebrow">OPEN TO GOOD PROBLEMS</span>
            <h2>Let's build something<br/><em>intelligent.</em></h2>
            <div className="contact-links">
              <a href="mailto:mohanakash48@gmail.com"><Mail size={16}/> mohanakash48@gmail.com <ArrowUpRight size={14}/></a>
              <a href="https://www.linkedin.com/in/mohan-akash-a765412a9/" target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={14}/></a>
              <a href="https://github.com/Mohan-Akash" target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ArrowUpRight size={14}/></a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} Mohan Akash</span><span>AI · RAG · OCR · Azure · Backend</span></footer>
      <ChatWidget />
    </div>
  );
}

function SectionHead({num, title}) {
  return <div className="section-head"><span>{num}</span><h2>{title}</h2><div /></div>;
}


// Pointer spotlight for cards
document.addEventListener("mousemove", (e) => {
  const el = e.target.closest(".work-card, .project");
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
});

createRoot(document.getElementById("root")).render(<App />);
