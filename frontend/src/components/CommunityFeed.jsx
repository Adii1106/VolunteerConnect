import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await api.get("/community");
    setPosts(res.data.posts || []);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!content) return;
    setLoading(true);
    try {
      await api.post("/community/create", { content });
      setContent("");
      load();
    } finally {
      setLoading(false);
    }
  };

  const comment = async (id, text) => {
    if (!text) return;
    await api.post(`/community/${id}/comment`, { content: text });
    load();
  };

  const like = async (id) => {
    await api.post(`/community/${id}/like`);
    load();
  };

  return (
    <div>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share something..." style={{ border: "2px solid #111", padding: "10px 12px", borderRadius: 8 }} />
        <button onClick={create} disabled={loading} style={{ border: "2px solid #111", padding: "8px 12px", borderRadius: 8 }}>{loading ? "Posting..." : "Post"}</button>
      </div>
      {posts.map(p => (
        <div key={p.id} style={{ border: "2px solid #111", borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><strong>{p.author?.name}</strong> ({p.author?.role})</div>
            <div>
              <button onClick={() => like(p.id)} style={{ border: '2px solid #111', borderRadius: 8, padding: '4px 8px' }}>Like ({p._count?.reactions || 0})</button>
            </div>
          </div>
          <div>{p.content}</div>
          <div style={{ marginTop: 8, borderTop: '1px solid #ddd', paddingTop: 8 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Comments ({p._count?.comments || 0})</div>
            {p.comments?.map(c => (
              <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '6px 0' }}>
                <div><strong>{c.author?.name}</strong> ({c.author?.role})</div>
                <div>{c.content}</div>
              </div>
            ))}
            <CommentInput onSubmit={(text) => comment(p.id, text)} />
          </div>
        </div>
      ))}
      {posts.length === 0 && <div>No posts yet</div>}
    </div>
  );
}

function CommentInput({ onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" style={{ border: '2px solid #111', borderRadius: 8, padding: '8px 10px', flex: 1 }} />
      <button onClick={()=>{ onSubmit(text); setText(""); }} style={{ border: '2px solid #111', borderRadius: 8, padding: '8px 12px' }}>Comment</button>
    </div>
  );
}
