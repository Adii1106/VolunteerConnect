import React, { useState } from "react";

import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";
import { setAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [openVolunteer, setOpenVolunteer] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#111]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-[6vw] py-5 bg-white border-b-0">
        <div className="text-2xl font-bold text-[#2362ef]">Volunteer Connect</div>

        <div className="hidden md:flex items-center space-x-6">
          {["Events", "NGOs", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="inline-block px-4 py-2 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111] font-medium text-[#222] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="px-7 py-2 border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111]"
            onClick={() => setOpenVolunteer(true)}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-center justify-between px-[7vw] pt-[70px] max-w-[1400px] mx-auto min-h-[600px] gap-8">
        {/* Left Section */}
        <div className="flex-1.2 max-w-[550px] w-full">
          <h1 className="text-5xl md:text-[3.1rem] font-extrabold text-[#222] mb-6 leading-[1.16]">
            Connecting Volunteers <span className="text-[#2362ef]">with</span>
            <br />
            <span className="text-[#2362ef]">Opportunities</span>
          </h1>
          <p className="text-[#616161] text-xl mb-9">
            Join volunteers making an impact. Discover events, connect with NGOs, and contribute to meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-8 py-3 rounded-lg text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-[#2362ef] text-white transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
              onClick={() => setOpenVolunteer(true)}
            >
              Register as Volunteer
            </button>
            <button
              className="px-8 py-3 rounded-lg text-lg border-[3px] border-[#111] shadow-[6px_6px_0_#111] font-bold bg-white text-[#111] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111]"
              onClick={() => setOpenOrg(true)}
            >
              Register as Organisation
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Volunteer"
            className="w-[250px] h-[250px] object-cover bg-white rounded-[38px] border-[3px] border-[#111] shadow-[12px_12px_0_#111]"
          />
        </div>
      </main>

      <footer className="text-center py-6 text-[#999] text-base mt-8">
        © 2025 Volunteer Connect — Built with <span className="text-[#e83e8c] text-xl">♥</span>
      </footer>

      <SignupModal role="volunteer" open={openVolunteer} onClose={() => setOpenVolunteer(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate('/volunteer'); }} onSwitchToLogin={() => { setOpenVolunteer(false); setOpenLogin(true); }} />
      <SignupModal role="organisation" open={openOrg} onClose={() => setOpenOrg(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate('/organiser'); }} onSwitchToLogin={() => { setOpenOrg(false); setOpenLogin(true); }} />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} onSuccess={(data) => { setAuth(data.token, data.user); setUser(data.user); navigate(data.user.role === 'VOLUNTEER' ? '/volunteer' : '/organiser'); }} />
      {user && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, background: '#fff', border: '2px solid #111', boxShadow: '6px 6px 0 #111', borderRadius: 10, padding: '10px 14px' }}>
          Signed in as {user.name} ({user.role})
        </div>
      )}
    </div>
  );
}

export default LandingPage;
