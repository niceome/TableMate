import { useNavigate, useParams } from "react-router-dom";

const mockPost = {
  id: 2,
  food: "Pizza",
  emoji: "🍕",
  authorName: "Yuna P.",
  time: "12:30 PM",
  location: "Campus Pizza House",
  current: 1,
  max: 3,
  description: "Anyone want to grab a pizza? Thinking pepperoni or margherita!",
  participants: [
    { confirmed: true },
    { confirmed: false },
    { confirmed: false },
  ],
};

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPerson() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{value}</p>
    </div>
  );
}

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPost; // API 연동 시 id로 fetch

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100svh", paddingBottom: 88 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: 4, color: "#111", display: "flex" }}>
          <IconBack />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>Post Details</span>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Food hero */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 12,
          backgroundColor: "#fff", padding: "16px", borderRadius: 16,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 14,
            backgroundColor: "#f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38, flexShrink: 0,
          }}>
            {post.emoji}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 4 }}>{post.food}</h2>
            <p style={{ fontSize: 14, color: "#888" }}>by {post.authorName}</p>
          </div>
        </div>

        {/* Time + Spots */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <InfoCard icon={<IconClock />} label="Time"  value={post.time} />
          <InfoCard icon={<IconPeople />} label="Spots" value={`${post.current}/${post.max}`} />
        </div>

        {/* Location */}
        <InfoCard icon={<IconPin />} label="Location" value={post.location} />

        {/* About */}
        <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 8 }}>About this meal</h4>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{post.description}</p>
        </div>

        {/* Participants */}
        <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 }}>Participants</h4>
          <div style={{ display: "flex", gap: 10 }}>
            {post.participants.map((p, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {p.confirmed
                  ? <IconPerson />
                  : <span style={{ fontSize: 16, color: "#bbb", fontWeight: 500 }}>?</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        padding: "12px 16px",
        backgroundColor: "#fff",
        borderTop: "1px solid #f0f0f0",
      }}>
        <button style={{
          width: "100%", padding: "16px",
          borderRadius: 14,
          backgroundColor: "#111",
          color: "#fff",
          fontSize: 16, fontWeight: 600,
        }}>
          Apply to Join 🙋
        </button>
      </div>
    </div>
  );
}

export default PostDetail;
