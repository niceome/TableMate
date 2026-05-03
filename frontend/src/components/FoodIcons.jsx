// FoodType enum 매핑: KOREAN | CHINESE | JAPANESE | WESTERN

function IconKorean({ color = "#555", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16"/>
      <path d="M4 10c0 4.42 3.58 8 8 8s8-3.58 8-8"/>
      <path d="M9.5 6c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5"/>
    </svg>
  );
}

function IconChinese({ color = "#555", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <line x1="8" y1="3" x2="11" y2="21"/>
      <line x1="16" y1="3" x2="13" y2="21"/>
    </svg>
  );
}

function IconJapanese({ color = "#555", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconWestern({ color = "#555", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Fork */}
      <path d="M6 2v5c0 1.1.9 2 2 2s2-.9 2-2V2"/>
      <line x1="8" y1="9" x2="8" y2="22"/>
      {/* Knife */}
      <line x1="16" y1="2" x2="16" y2="22"/>
      <path d="M16 2c2 0 3 1.5 3 4 0 2-1 3.5-3 4"/>
    </svg>
  );
}

const FOOD_ICON_MAP = {
  KOREAN:   IconKorean,
  CHINESE:  IconChinese,
  JAPANESE: IconJapanese,
  WESTERN:  IconWestern,
};

export function FoodIcon({ type, color, size }) {
  const Icon = FOOD_ICON_MAP[type] ?? IconKorean;
  return <Icon color={color} size={size} />;
}

export const FOOD_TYPES = [
  { value: "KOREAN",   label: "한식", Icon: IconKorean },
  { value: "CHINESE",  label: "중식", Icon: IconChinese },
  { value: "JAPANESE", label: "일식", Icon: IconJapanese },
  { value: "WESTERN",  label: "양식", Icon: IconWestern },
];
