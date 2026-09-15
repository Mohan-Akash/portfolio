import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Send, Sparkles, X } from "lucide-react";
import "./chatbot.css";

const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || "http://127.0.0.1:8000";
const suggestions = ["Why should we hire Akash?", "Tell me about his AI work", "What projects has Akash built?", "What technologies does he use?"];

function Inline({ text }) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}
function Content({ text }) {
  return text.split("\n").map((line, i) => <span key={i} className={/^[-*]\s+/.test(line) ? "chat-bullet" : ""}>{/^[-*]\s+/.test(line) && "• "}<Inline text={line.replace(/^[-*]\s+/, "")} />{i < text.split("\n").length - 1 && <br />}</span>);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false), [messages, setMessages] = useState([]), [input, setInput] = useState(""), [streaming, setStreaming] = useState(false), [follow, setFollow] = useState(true);
  const scrollRef = useRef(null), abortRef = useRef(null), conversationId = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { if (follow && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, streaming, follow]);
  const close = () => { if (streaming) abortRef.current?.abort(); setOpen(false); };
  const send = async (value = input) => {
    const message = value.trim(); if (!message || streaming) return;
    const history = messages.filter(m => !m.pending && m.content).map(({ role, content }) => ({ role, content }));
    const assistantId = crypto.randomUUID();
    setMessages(current => [...current, { id: crypto.randomUUID(), role: "user", content: message }, { id: assistantId, role: "assistant", content: "", pending: true }]);
    setInput(""); setStreaming(true); setFollow(true);
    const controller = new AbortController(); abortRef.current = controller;
    const update = (data) => setMessages(current => current.map(m => m.id === assistantId ? { ...m, ...data } : m));
    try {
      const payload = { message, history }; if (conversationId.current) payload.conversation_id = conversationId.current;
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error("Request failed");
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = "";
      const frame = (raw) => {
        const event = raw.match(/^event:\s*(.+)$/m)?.[1]?.trim(), json = raw.match(/^data:\s*(.*)$/m)?.[1]; if (!event || json === undefined) return;
        let data; try { data = JSON.parse(json); } catch { return; }
        if (event === "token" && typeof data.text === "string") setMessages(current => current.map(m => m.id === assistantId ? { ...m, content: m.content + data.text, pending: false } : m));
        if (event === "sources" && Array.isArray(data.sources)) update({ sources: data.sources });
        if (event === "done") { if (data.conversation_id) conversationId.current = data.conversation_id; update({ pending: false, complete: true }); }
        if (event === "error") throw new Error("Stream error");
      };
      while (true) { const { value, done } = await reader.read(); buffer += decoder.decode(value || new Uint8Array(), { stream: !done }).replace(/\r\n/g, "\n"); const parts = buffer.split("\n\n"); buffer = parts.pop(); parts.forEach(frame); if (done) break; }
      if (buffer.trim()) frame(buffer);
    } catch (error) {
      if (error.name === "AbortError") update({ pending: false, complete: true, content: "Response cancelled." });
      else update({ pending: false, complete: true, content: "Sorry, I couldn't complete that response. Please try again." });
    } finally { setStreaming(false); abortRef.current = null; }
  };
  return <div className="chat-widget">
    <AnimatePresence>{open && <motion.section className="chat-window" aria-label="Akash AI portfolio assistant" initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .97 }} transition={{ duration: .22 }}>
      <header className="chat-header"><div className="chat-avatar"><Sparkles size={16}/></div><div><h2>Akash AI</h2><p><i /> AI Assistant · Ask about work & skills</p></div><button onClick={close} aria-label="Close chat"><X size={18}/></button></header>
      <div className="chat-messages" ref={scrollRef} onScroll={() => { const e = scrollRef.current; setFollow(e.scrollHeight - e.scrollTop - e.clientHeight < 72); }} aria-live="polite">
        {!messages.length && <div className="chat-welcome"><Bot size={24}/><h3>Hi 👋</h3><p>I'm Akash's AI portfolio assistant. Ask me about his projects, AI experience, technical skills, or current work.</p><div className="chat-suggestions">{suggestions.map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}</div></div>}
        {messages.map(m => <motion.div className={`chat-message ${m.role}`} key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><div className="chat-bubble">{m.pending && !m.content ? <span className="chat-typing"><i/><i/><i/></span> : <Content text={m.content}/>}</div>{m.sources?.length > 0 && <details className="chat-sources"><summary>Sources <ChevronDown size={13}/></summary>{m.sources.map((s, i) => <span key={i}>{s.title || s.file || "Portfolio context"}</span>)}</details>}</motion.div>)}
      </div>
      <form className="chat-input" onSubmit={e => { e.preventDefault(); send(); }}><textarea aria-label="Ask Akash AI a question" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask about Akash's work…" rows="1" disabled={streaming}/><button type="submit" aria-label="Send message" disabled={!input.trim() || streaming}><Send size={16}/></button></form>
    </motion.section>}</AnimatePresence>
    <motion.button className="chat-launcher" onClick={() => setOpen(value => !value)} aria-label={open ? "Close Akash AI" : "Open Akash AI"} aria-expanded={open} whileHover={{ scale: 1.07 }} whileTap={{ scale: .94 }}>{open ? <X size={23}/> : <Bot size={23}/>}</motion.button>
  </div>;
}
