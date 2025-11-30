import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function OpportunitiesList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category) params.set('category', category);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const res = await api.get(`/events?${params.toString()}`);
      setEvents(res.data.events || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const apply = async (id) => {
    setStatus("");
    try {
      await api.post(`/events/${id}/apply`);
      setStatus("Applied successfully");
    } catch (e) {
      setStatus(e?.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 1fr 1fr auto', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} style={inputStyle} />
        <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} style={inputStyle} />
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={inputStyle} />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={inputStyle} />
        <button onClick={load} style={buttonStyle}>Filter</button>
      </div>
      {status && <div style={{ marginBottom: 10 }}>{status}</div>}
      {loading ? <div>Loading...</div> : (
        <div>
          {events.map(ev => (
            <div key={ev.id} style={{ border: "2px solid #111", borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{ev.title}</div>
              <div>{ev.description}</div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => apply(ev.id)} style={{ border: "2px solid #111", padding: "6px 10px", borderRadius: 8 }}>Apply</button>
              </div>
            </div>
          ))}
          {events.length === 0 && <div>No events yet</div>}
        </div>
      )}
    </div>
  );
}

const inputStyle = { border: "2px solid #111", padding: "10px 12px", borderRadius: 8 };
const buttonStyle = { border: "2px solid #111", padding: "8px 12px", borderRadius: 8 };
