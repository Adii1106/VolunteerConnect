import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function OrganiserEvents() {
  const [events, setEvents] = useState([]);
  const [signups, setSignups] = useState({});

  const load = async () => {
    const res = await api.get('/events/mine');
    setEvents(res.data.events || []);
  };

  useEffect(()=>{ load(); }, []);

  const viewSignups = async (id) => {
    const res = await api.get(`/events/${id}/signups`);
    setSignups(s => ({ ...s, [id]: res.data.signups || [] }));
  };

  return (
    <div>
      {events.map(ev => (
        <div key={ev.id} style={{ border: "2px solid #111", borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>{ev.title}</div>
          <div>{ev.description}</div>
          <div style={{ marginTop: 6 }}>Volunteers: {ev.currentVolCount} / {ev.maxVolunteers}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => viewSignups(ev.id)} style={{ border: '2px solid #111', borderRadius: 8, padding: '6px 10px' }}>View Applicants</button>
          </div>
          {signups[ev.id] && (
            <div style={{ marginTop: 10 }}>
              {signups[ev.id].length === 0 && <div>No applicants yet</div>}
              {signups[ev.id].map(su => (
                <div key={su.id} style={{ borderBottom: '1px solid #ddd', padding: '6px 0' }}>
                  <div><strong>{su.volunteer?.name}</strong> ({su.volunteer?.email})</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {events.length === 0 && <div>No events yet</div>}
    </div>
  );
}
