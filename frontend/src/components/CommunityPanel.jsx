import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function CommunityPanel() {
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/messages/me");
      setMessages(res.data.messages || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!recipientId || !content) return;
    setLoading(true);
    try {
      await api.post("/messages/send", { recipientId: Number(recipientId), content });
      setContent("");
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "2px solid #111", borderRadius: 12, padding: 16, boxShadow: "6px 6px 0 #111", background: "#fff" }}>
      <h3 style={{ marginTop: 0 }}>Community</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <a href="https://discord.com/" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ border: "2px solid #111", borderRadius: 10, padding: 12, boxShadow: "4px 4px 0 #111" }}>Join our Discord</div>
        </a>
        <div>
          <h4 style={{ margin: "12px 0" }}>Direct Messages</h4>
          <div style={{ display: "grid", gap: 8 }}>
            <input placeholder="Recipient user ID" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} style={inputStyle} />
            <input placeholder="Type a message" value={content} onChange={(e) => setContent(e.target.value)} style={inputStyle} />
            <button onClick={send} disabled={loading} style={buttonStyle}>{loading ? "Sending..." : "Send"}</button>
          </div>
          <div style={{ marginTop: 12 }}>
            {messages.map(m => (
              <div key={m.id} style={{ borderBottom: "1px solid #ddd", padding: "6px 0" }}>
                <div><strong>{m.sender?.name}</strong> → {m.recipient?.name}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { border: "2px solid #111", padding: "10px 12px", borderRadius: 8 };
const buttonStyle = { border: "3px solid #111", boxShadow: "6px 6px 0 #111", padding: "10px 14px", borderRadius: 8, cursor: "pointer" };
