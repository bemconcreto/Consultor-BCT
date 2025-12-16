"use client";

export default function CopyReferralButton({ link }: { link: string }) {
  const copy = () => navigator.clipboard.writeText(link);

  return (
    <button
      onClick={copy}
      style={{
        padding: "10px 16px",
        background: "#101820",
        color: "white",
        borderRadius: 6,
        border: "none",
        cursor: "pointer"
      }}
    >
      Copiar link
    </button>
  );
}