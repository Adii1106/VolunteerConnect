import React from "react";
import { getUser, clearAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import CommunityFeed from "../components/CommunityFeed";
import OpportunitiesList from "../components/OpportunitiesList";
import DMList from "../components/DMList";

export default function VolunteerDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const logout = () => {
    clearAuth();
    navigate("/");
  };
  const [tab, setTab] = React.useState('opportunities');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '2px solid #111', padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Menu</h3>
        <NavButton active={tab==='opportunities'} onClick={()=>setTab('opportunities')}>Opportunities</NavButton>
        <NavButton active={tab==='community'} onClick={()=>setTab('community')}>Community</NavButton>
        <NavButton active={tab==='dm'} onClick={()=>setTab('dm')}>DMs</NavButton>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>Welcome {user?.name}</div>
          <button onClick={logout} style={{ border: "2px solid #111", padding: "8px 12px", borderRadius: 8 }}>Logout</button>
        </div>
      </aside>
      <main style={{ padding: 24 }}>
        {tab==='opportunities' && <OpportunitiesList />}
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
