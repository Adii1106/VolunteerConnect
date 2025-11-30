import React, { useState } from "react";
import api from "../services/api";

export default function EventCreateForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [locationText, setLocationText] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState(10);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setStatus("");
    if (!title || !description || !date || !locationText) { setStatus("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await api.post('/events', { title, description, category: 'General', date, locationText, maxVolunteers });
      setStatus("Event created");
      setTitle(""); setDescription(""); setDate(""); setLocationText(""); setMaxVolunteers(10);
      onCreated && onCreated(res.data.event);
    } catch (e) {
      setStatus(e?.response?.data?.error || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {status && <div>{status}</div>}
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle} />
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{...inputStyle, minHeight: 80}} />
      <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} />
      <input placeholder="Location" value={locationText} onChange={e=>setLocationText(e.target.value)} style={inputStyle} />
      <input type="number" min={1} value={maxVolunteers} onChange={e=>setMaxVolunteers(Number(e.target.value))} style={inputStyle} />
      <button onClick={submit} disabled={loading} style={buttonStyle}>{loading? 'Creating...' : 'Create Event'}</button>
    </div>
  );
}

const inputStyle = { border: "2px solid #111", padding: "10px 12px", borderRadius: 8 };
const buttonStyle = { border: "3px solid #111", boxShadow: "6px 6px 0 #111", padding: "10px 14px", borderRadius: 8, cursor: "pointer" };
