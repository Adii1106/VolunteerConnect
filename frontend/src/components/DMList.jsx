import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DMList() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const res = await api.get("/messages/me");
    setMessages(res.data.messages || []);
  };

  useEffect(() => { load(); }, []);

  const search = async (q) => {
    setQuery(q);
    if (!q) { setResults([]); return; }
    const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
    setResults(res.data.users || []);
  };

  const send = async () => {
    if (!recipient || !content) return;
    setSending(true);
    try {
      await api.post("/messages/send", { recipientId: recipient.id, content });
      setContent("");
      load();
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ border: '2px solid #111', borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>New Message</div>
        <input value={query} onChange={e=>search(e.target.value)} placeholder="Search users by name or email" style={inputStyle} />
        {results.length > 0 && (
          <div style={{ border: '1px solid #ddd', borderRadius: 8, marginTop: 6 }}>
            {results.map(u => (
              <div key={u.id} onClick={()=>{ setRecipient(u); setResults([]); setQuery(`${u.name} (${u.email})`); }} style={{ padding: 8, cursor: 'pointer' }}>{u.name} ({u.email})</div>
            ))}
          </div>
        )}
        <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Type a message" style={{...inputStyle, marginTop: 8}} />
        <button onClick={send} disabled={sending || !recipient} style={buttonStyle}>{sending? 'Sending...' : 'Send'}</button>
      </div>
      {messages.map(m => (
        <div key={m.id} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <div><strong>{m.sender?.name}</strong> → {m.recipient?.name}</div>
          <div>{m.content}</div>
        </div>
      ))}
      {messages.length === 0 && <div>No direct messages yet</div>}
    </div>
  );
}

const inputStyle = { border: "2px solid #111", padding: "10px 12px", borderRadius: 8 };
const buttonStyle = { border: "2px solid #111", padding: "8px 12px", borderRadius: 8, marginTop: 8 };
