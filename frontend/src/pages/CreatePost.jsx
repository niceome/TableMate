import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FOOD_TYPES } from "../components/FoodIcons";

const CAFETERIAS = [
  { value: "CHEONJI",  label: "천지관" },
  { value: "BAENGNO",  label: "백록관" },
  { value: "KNUTERIA", label: "크누테리아" },
];

const TIME_SLOTS = ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM"];

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h3 style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 12 }}>
      {icon}{children}
    </h3>
  );
}

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle]                         = useState("");
  const [selectedFood, setSelectedFood]           = useState(null);
  const [selectedTime, setSelectedTime]           = useState(null);
  const [selectedCafeteria, setSelectedCafeteria] = useState(null);
  const [customLocation, setCustomLocation]       = useState("");
  const [maxParticipants, setMaxParticipants]     = useState(4);
  const [description, setDescription]             = useState("");

  const locationFilled = selectedCafeteria || customLocation.trim();
  const canSubmit = title.trim() && selectedFood && selectedTime && locationFilled;

  const iconClockSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  const iconPinSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
  const iconPeopleSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  const iconEditSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
  const iconUtensilsSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/>
    </svg>
  );
  const iconMessageSvg = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );

  return (
    <div style={{ minHeight: "100svh", paddingBottom: 88, backgroundColor: "#fff" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, color: "#111", display: "flex" }}>
          <IconBack />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>Create Post</span>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconEditSvg}>제목</SectionTitle>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예) 오늘 점심 같이 먹어요!"
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: 12, border: "1.5px solid #e8e8e8",
              fontSize: 14, color: "#111", backgroundColor: "#fff",
            }}
          />
        </div>

        {/* Food */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconUtensilsSvg}>What do you want to eat?</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {FOOD_TYPES.map(({ value, label, Icon }) => {
              const active = selectedFood === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedFood(value)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "14px 6px", borderRadius: 14, gap: 8,
                    backgroundColor: active ? "#111" : "#fff",
                    border: `1.5px solid ${active ? "#111" : "#e0e0e0"}`,
                    transition: "all 0.15s",
                  }}
                >
                  <Icon color={active ? "#fff" : "#555"} size={28} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "#fff" : "#555" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconClockSvg}>When?</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIME_SLOTS.map(time => {
              const active = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: "9px 14px", borderRadius: 20,
                    backgroundColor: active ? "#111" : "#f5f5f5",
                    color: active ? "#fff" : "#555",
                    fontSize: 13, fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconPinSvg}>Where?</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {CAFETERIAS.map(caf => {
              const active = selectedCafeteria === caf.value;
              return (
                <button
                  key={caf.value}
                  onClick={() => setSelectedCafeteria(active ? null : caf.value)}
                  style={{
                    flex: 1, padding: "10px 4px", borderRadius: 12,
                    backgroundColor: active ? "#111" : "#fff",
                    color: active ? "#fff" : "#555",
                    fontSize: 13, fontWeight: 500,
                    border: `1.5px solid ${active ? "#111" : "#e0e0e0"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {caf.label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={customLocation}
            onChange={e => setCustomLocation(e.target.value)}
            placeholder="또는 직접 입력 (e.g., 공학관 1층)"
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: 12, border: "1.5px solid #e8e8e8",
              fontSize: 14, color: "#111", backgroundColor: "#fff",
            }}
          />
        </div>

        {/* Max participants */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconPeopleSvg}>Max participants</SectionTitle>
          <div style={{ display: "flex", gap: 10 }}>
            {[2, 3, 4].map(n => {
              const active = maxParticipants === n;
              return (
                <button
                  key={n}
                  onClick={() => setMaxParticipants(n)}
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    backgroundColor: active ? "#111" : "#f5f5f5",
                    color: active ? "#fff" : "#555",
                    fontSize: 16, fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* About this meal */}
        <div style={{ marginBottom: 28 }}>
          <SectionTitle icon={iconMessageSvg}>About this meal</SectionTitle>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="모임에 대해 자유롭게 적어주세요 :)"
            rows={4}
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: 12, border: "1.5px solid #e8e8e8",
              fontSize: 14, color: "#111", backgroundColor: "#fff",
              resize: "none", lineHeight: 1.6,
            }}
          />
        </div>

      </div>

      {/* Create button */}
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        padding: "12px 16px",
        backgroundColor: "#fff",
        borderTop: "1px solid #f0f0f0",
      }}>
        <button
          disabled={!canSubmit}
          style={{
            width: "100%", padding: "16px",
            borderRadius: 14,
            backgroundColor: canSubmit ? "#111" : "#ccc",
            color: "#fff",
            fontSize: 16, fontWeight: 600,
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "background 0.15s",
          }}
        >
          Create Post ✨
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
