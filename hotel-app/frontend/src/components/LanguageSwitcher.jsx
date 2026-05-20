import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "sq", flag: "🇦🇱", label: "Shqip" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          style={{
            padding: "6px 14px",
            fontWeight: i18n.language === code ? "600" : "400",
            border: i18n.language === code ? "2px solid #333" : "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          <span style={{ fontSize: "20px" }}>{flag}</span>
          {label}
        </button>
      ))}
    </div>
  );
}