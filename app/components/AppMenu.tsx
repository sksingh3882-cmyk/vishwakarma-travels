"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AppMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isReports = pathname?.startsWith("/reports");

  const links = isAdmin
    ? [
        { href: "/reports", label: "Sales Report" },
      { href: "/vehicle-reports", label: "Vehicle Reports" },
      { href: "/total-bookings", label: "Total Bookings" },
        { href: "/", label: "Customer Page" },
      ]
    : isReports
    ? [
        { href: "/admin", label: "Admin Dashboard" },
        { href: "/", label: "Customer Page" },
      ]
    : [{ href: "/admin", label: "Admin Login" }];

  return (
    <div style={{ position: "fixed", top: 14, right: 14, zIndex: 9999 }}>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,.45)",
          background: "#0b2d6b",
          color: "white",
          fontSize: 25,
          fontWeight: "bold",
          boxShadow: "0 10px 25px rgba(15,23,42,.25)",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {open && (
        <div
          style={{
            marginTop: 8,
            width: 210,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 18px 45px rgba(15,23,42,.25)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              background: "#0b2d6b",
              color: "white",
              padding: "12px 14px",
              fontWeight: "bold",
            }}
          >
            Vishwakarma Travels
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "13px 14px",
                color: "#0f172a",
                textDecoration: "none",
                fontWeight: "bold",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
