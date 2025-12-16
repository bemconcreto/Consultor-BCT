"use client";

export default function MobileMenuButton() {
  function toggleMenu() {
    document.querySelector(".sidebar")?.classList.toggle("open");
  }

  return (
    <button className="mobile-menu-btn" onClick={toggleMenu}>
      ☰
    </button>
  );
}