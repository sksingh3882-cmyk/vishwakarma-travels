"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function AppMenu() {
  const [open, setOpen] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const pathname = usePathname();
useEffect(() => {
  setAdminLoggedIn(localStorage.getItem("vt_admin_login") === "yes");
}, [pathname, open]);
  

    const isRatingPage = pathname?.startsWith("/rating/");
  const isAdmin = pathname?.startsWith("/admin");
  const isReports = pathname?.startsWith("/reports");

  if (isRatingPage) return null;

  const links = adminLoggedIn && isAdmin
  ? [
      { href: "/reports", label: "Sales Report" },
      { href: "/vehicle-reports", label: "Vehicle Reports" },
      { href: "/total-bookings", label: "Total Bookings" },
      { href: "/", label: "Customer Page" },
    ]
  : adminLoggedIn && isReports
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
        width: 34,
        height: 34,
        border: "none",
        background: "transparent",
        color: "#111",
        fontSize: 28,
        fontWeight: 900,
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      ☰
    </button>
    

      {open && (
        <div
          style={{
            marginTop: 2,
            width: 170,
            background: "transparent",
            boxShadow: "none",
            border: "none",
            }}
          >
            
        

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "8px 0",
                color: "#111",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
                borderBottom: "1px solid rgba(0,0,0,.25)",
                background: "transparent",
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
