"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  booking_id?: string;
  customer_name?: string;
  customer_phone?: string;
  pickup?: string;
  drop_location?: string;
  journey_date?: string;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_number?: string;
  fare?: number;
  advance?: number;
  net_payable?: number;
  driver_name?: string;
  created_at?: string;
};

type SummaryRow = {
  name: string;
  bookings: number;
  revenue: number;
  advance: number;
  pending: number;
};

function toNumber(value: unknown) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function formatMoney(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getBookingDate(booking: Booking) {
  const rawDate = booking.journey_date || booking.created_at || "";
  if (!rawDate) return null;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getYearKey(date: Date) {
  return String(date.getFullYear());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.toDateString() === b.toDateString()
  );
}

function buildSummary(bookings: Booking[], keyFn: (booking: Booking) => string) {
  const map = new Map<string, SummaryRow>();

  bookings.forEach((booking) => {
    const key = keyFn(booking) || "Not Available";
    const fare = toNumber(booking.fare);
    const advance = toNumber(booking.advance);
    const pending = Math.max(fare - advance, 0);

    const old = map.get(key) || {
      name: key,
      bookings: 0,
      revenue: 0,
      advance: 0,
      pending: 0,
    };

    old.bookings += 1;
    old.revenue += fare;
    old.advance += advance;
    old.pending += pending;
    map.set(key, old);
  });

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export default function ReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => getMonthKey(new Date()));
  const [selectedYear, setSelectedYear] = useState(() => getYearKey(new Date()));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const headers = useMemo(
    () => ({
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    }),
    [supabaseKey]
  );

  useEffect(() => {
    async function loadBookings() {
      if (!supabaseUrl || !supabaseKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc&limit=2000`,
          { headers }
        );

        if (response.ok) {
          setBookings(await response.json());
        }
      } catch (error) {
        console.log("Report load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [supabaseUrl, supabaseKey, headers]);

  const todayBookings = useMemo(() => {
    const today = new Date();
    return bookings.filter((booking) => {
      const date = getBookingDate(booking);
      return date ? isSameDay(date, today) : false;
    });
  }, [bookings]);

  const monthBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const date = getBookingDate(booking);
        return date ? getMonthKey(date) === selectedMonth : false;
      }),
    [bookings, selectedMonth]
  );

  const yearBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const date = getBookingDate(booking);
        return date ? getYearKey(date) === selectedYear : false;
      }),
    [bookings, selectedYear]
  );

  const todayRevenue = todayBookings.reduce((sum, b) => sum + toNumber(b.fare), 0);
  const monthRevenue = monthBookings.reduce((sum, b) => sum + toNumber(b.fare), 0);
  const yearRevenue = yearBookings.reduce((sum, b) => sum + toNumber(b.fare), 0);
  const monthAdvance = monthBookings.reduce((sum, b) => sum + toNumber(b.advance), 0);
  const monthPending = monthBookings.reduce(
    (sum, b) => sum + Math.max(toNumber(b.fare) - toNumber(b.advance), 0),
    0
  );

  const vehicleReport = buildSummary(
    monthBookings,
    (booking) =>
      booking.vehicle_number ||
      [booking.vehicle_type, booking.vehicle_model].filter(Boolean).join(" - ") ||
      "Vehicle Not Entered"
  );

  const customerReport = buildSummary(
    monthBookings,
    (booking) => booking.customer_name || booking.customer_phone || "Customer Not Entered"
  );

  const availableMonths = Array.from(
    new Set(
      bookings
        .map(getBookingDate)
        .filter(Boolean)
        .map((date) => getMonthKey(date as Date))
    )
  ).sort((a, b) => b.localeCompare(a));

  const availableYears = Array.from(
    new Set(
      bookings
        .map(getBookingDate)
        .filter(Boolean)
        .map((date) => getYearKey(date as Date))
    )
  ).sort((a, b) => b.localeCompare(a));

  return (
    <main style={{ minHeight: "100vh", background: "#f1f5f9", padding: 16 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ background: "#0b2d6b", color: "white", padding: 20, borderRadius: 18, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Sales Report Dashboard</h1>
          <p style={{ margin: "6px 0 0" }}>Daily, Monthly, Yearly, Vehicle aur Customer Business Report</p>
        </header>

        <section style={{ background: "white", padding: 16, borderRadius: 18, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            <label style={labelStyle}>
              Month Report
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={inputStyle}>
                {[selectedMonth, ...availableMonths.filter((m) => m !== selectedMonth)].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Year Report
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={inputStyle}>
                {[selectedYear, ...availableYears.filter((y) => y !== selectedYear)].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {loading ? (
          <section style={cardStyle}>Loading reports...</section>
        ) : (
          <>
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 }}>
              <ReportCard title="Today Sale" value={formatMoney(todayRevenue)} note={`${todayBookings.length} bookings`} />
              <ReportCard title="Monthly Sale" value={formatMoney(monthRevenue)} note={`${monthBookings.length} bookings`} />
              <ReportCard title="Yearly Sale" value={formatMoney(yearRevenue)} note={`${yearBookings.length} bookings`} />
              <ReportCard title="Advance Received" value={formatMoney(monthAdvance)} note="Selected month" />
              <ReportCard title="Pending Amount" value={formatMoney(monthPending)} note="Selected month" />
            </section>

            <ReportTable
              title="Vehicle Wise Monthly Business"
              rows={vehicleReport}
              emptyText="Is month vehicle report available nahi hai."
            />

            <ReportTable
              title="Customer Wise Monthly Business"
              rows={customerReport}
              emptyText="Is month customer report available nahi hai."
            />
          </>
        )}
      </div>
    </main>
  );
}

function ReportCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div style={cardStyle}>
      <p style={{ margin: 0, color: "#64748b", fontWeight: "bold" }}>{title}</p>
      <h2 style={{ margin: "8px 0", color: "#0b2d6b", fontSize: 28 }}>{value}</h2>
      <p style={{ margin: 0, color: "#475569" }}>{note}</p>
    </div>
  );
}

function ReportTable({ title, rows, emptyText }: { title: string; rows: SummaryRow[]; emptyText: string }) {
  return (
    <section style={{ background: "white", padding: 16, borderRadius: 18, marginBottom: 16 }}>
      <h2 style={{ color: "#0b2d6b", marginTop: 0 }}>{title}</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
          <thead>
            <tr style={{ background: "#0b2d6b", color: "white" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Bookings</th>
              <th style={thStyle}>Total Business</th>
              <th style={thStyle}>Advance</th>
              <th style={thStyle}>Pending</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.bookings}</td>
                <td style={tdStyle}>{formatMoney(row.revenue)}</td>
                <td style={tdStyle}>{formatMoney(row.advance)}</td>
                <td style={tdStyle}>{formatMoney(row.pending)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 18, textAlign: "center", color: "#64748b" }}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: 16,
  borderRadius: 18,
  boxShadow: "0 8px 20px rgba(15,23,42,.06)",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "#0b2d6b",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  width: "100%",
};

const thStyle: React.CSSProperties = {
  padding: 10,
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #e2e8f0",
};
