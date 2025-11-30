import React from "react";
import { getUser, clearAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import CommunityFeed from "../components/CommunityFeed";
import DMList from "../components/DMList";
import EventCreateForm from "../components/EventCreateForm";
import OrganiserEvents from "../components/OrganiserEvents";

export default function OrganiserDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const logout = () => {
    clearAuth();
    navigate("/");
  };
  const [tab, setTab] = React.useState('events');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '2px solid #111', padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Menu</h3>
        <NavButton active={tab==='events'} onClick={()=>setTab('events')}>My Events</NavButton>
        <NavButton active={tab==='create'} onClick={()=>setTab('create')}>Add Event</NavButton>
        <NavButton active={tab==='community'} onClick={()=>setTab('community')}>Community</NavButton>
        <NavButton active={tab==='dm'} onClick={()=>setTab('dm')}>DMs</NavButton>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>Welcome {user?.name}</div>
          <button onClick={logout} style={{ border: "2px solid #111", padding: "8px 12px", borderRadius: 8 }}>Logout</button>
        </div>
      </aside>
      <main style={{ padding: 24 }}>
        {tab==='events' && <OrganiserEvents />}
        {tab==='create' && <EventCreateForm onCreated={() => setTab('events')} />}
        {tab==='community' && <CommunityFeed />}
        {tab==='dm' && <DMList />}
      </main>
    </div>
  );
}

function NavButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left', marginBottom: 8,
      border: '2px solid #111', borderRadius: 8, padding: '10px 12px',
      background: active ? '#e5eefe' : '#fff'
    }}>{children}</button>
  );
}
