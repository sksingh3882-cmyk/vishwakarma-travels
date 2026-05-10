"use client";

const phone = "917667989203";

const vehicles = [
  {
    name: "Dzire / Etios / Similar",
    shortName: "Dzire",
    price: "₹2,999",
    seats: "4 Seats",
    bags: "2 Bags",
    fuel: "Petrol / Diesel",
    tags: ["AC", "Comfortable", "Budget Friendly"],
    image: "/cars/dzire.png",
  },
  {
    name: "Ertiga / Similar",
    shortName: "Ertiga",
    price: "₹4,499",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Petrol / Diesel",
    tags: ["AC", "Spacious", "Family Car"],
    image: "/cars/ertiga.jpg",
  },
  {
    name: "Innova Crysta / Similar",
    shortName: "Crysta",
    price: "₹6,499",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Diesel",
    tags: ["AC", "Spacious", "Premium"],
    image: "/cars/crysta.png",
  },
  {
    name: "Innova / Similar",
    shortName: "Innova",
    price: "₹5,999",
    seats: "6 Seats",
    bags: "4 Bags",
    fuel: "Diesel",
    tags: ["AC", "Comfort", "Outstation"],
    image: "/cars/innova.png",
  },
];

export default function AirportDropPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-3 shadow-sm md:px-10">
        <a href="/" className="flex items-center gap-3 no-underline">
          <div className="grid h-12 w-12 -skew-x-12 place-items-center rounded-br-md rounded-tl-2xl rounded-tr-md rounded-bl-md bg-gradient-to-br from-slate-950 to-red-700 text-3xl font-black text-white">
            V
          </div>
          <div>
            <h1 className="m-0 text-xl font-black leading-none tracking-wide text-red-700 md:text-3xl">VISHWAKARMA</h1>
            <p className="m-0 text-base font-black leading-none tracking-[0.28em] text-slate-950 md:text-xl">TRAVELS</p>
          </div>
        </a>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-bold md:gap-7 md:text-base">
          <a href="/" className="text-slate-950 no-underline">Home</a>
          <a href="#vehicles" className="text-slate-950 no-underline">Fleet</a>
          <a href={`tel:+${phone}`} className="rounded-md bg-red-700 px-5 py-3 font-black text-white no-underline shadow-lg shadow-red-700/20">Call Now</a>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-black via-slate-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <h2 className="m-0 text-5xl font-black leading-none md:text-7xl">One Way Drop</h2>
          <div className="my-5 h-1.5 w-16 bg-red-600" />
          <p className="m-0 text-lg font-semibold md:text-2xl">Book your one way drop taxi at affordable rates.</p>
          <p className="m-0 mt-1 text-lg font-semibold md:text-2xl">Comfortable rides to your destination.</p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 grid max-w-7xl gap-3 rounded-xl bg-slate-900 p-4 text-white shadow-2xl md:grid-cols-4">
        <div className="flex items-center gap-3 px-3 py-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-red-700">↗</span><b>One Way Trip</b></div>
        <div className="flex items-center gap-3 px-3 py-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-red-700">🛡</span><b>Professional Drivers</b></div>
        <div className="flex items-center gap-3 px-3 py-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-red-700">🏷</span><b>No Hidden Charges</b></div>
        <div className="flex items-center gap-3 px-3 py-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-red-700">✓</span><b>Safe & Comfortable</b></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-7 lg:grid-cols-[340px_1fr]">
        <aside className="grid content-start gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
            <h3 className="mb-5 text-2xl font-black">Search One Way Drop</h3>
            <label className="mb-2 block font-bold">From</label>
            <div className="mb-4 flex h-12 items-center gap-3 rounded-lg border border-slate-300 px-3 text-slate-500">
              <span>⌖</span><input className="w-full border-0 bg-transparent text-sm outline-none" placeholder="Enter pickup location" />
            </div>
            <label className="mb-2 block font-bold">To</label>
            <div className="mb-4 flex h-12 items-center gap-3 rounded-lg border border-slate-300 px-3 text-slate-500">
              <span>⌖</span><input className="w-full border-0 bg-transparent text-sm outline-none" placeholder="Enter drop location" />
            </div>
            <label className="mb-2 block font-bold">Travel Date</label>
            <div className="mb-5 flex h-12 items-center gap-3 rounded-lg border border-slate-300 px-3 text-slate-500">
              <span>▣</span><input className="w-full border-0 bg-transparent text-sm outline-none" type="date" />
            </div>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hello Vishwakarma Travels, I want to search one way drop vehicles.")}`} className="block rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-5 py-4 text-center font-black text-white no-underline">Search Vehicles</a>
          </div>

          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-md">
            <h3 className="mb-3 text-lg font-black">ⓘ Important Note</h3>
            <ul className="m-0 space-y-2 pl-5 text-slate-700">
              <li>This is a one way drop service.</li>
              <li>Return journey is not included.</li>
              <li>Toll, Parking, State Tax as applicable.</li>
            </ul>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-2xl font-black text-red-700">☎</div>
            <div>
              <b>Need Help?</b>
              <p className="my-1 text-slate-600">Call us anytime</p>
              <a href={`tel:+${phone}`} className="text-xl font-black text-red-700 no-underline">+91 76679 89203</a>
            </div>
          </div>
        </aside>

        <section id="vehicles" className="grid content-start gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div>
              <h3 className="m-0 text-2xl font-black">Available Vehicles</h3>
              <p className="m-0 mt-2 text-slate-500">Showing best options for your one way trip</p>
            </div>
            <select className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold" defaultValue="low" aria-label="Sort vehicles">
              <option value="low">Sort by: Price (Low to High)</option>
              <option value="high">Sort by: Price (High to Low)</option>
            </select>
          </div>

          {vehicles.map((vehicle) => {
            const message = `Hello Vishwakarma Travels,\n\nI would like to book a one way drop cab.\nVehicle: ${vehicle.name}\nFare shown: ${vehicle.price}\n\nPlease share confirmation details.\n\nThank you.`;
            return (
              <article key={vehicle.name} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-md md:grid-cols-[190px_1fr_150px] md:items-center">
                <div className="grid h-32 place-items-center overflow-hidden rounded-xl bg-white">
                  <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-black text-slate-950">{vehicle.name}</h3>
                  <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-700">
                    <span>👤 {vehicle.seats}</span>
                    <span>🧳 {vehicle.bags}</span>
                    <span>⛽ {vehicle.fuel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.tags.map((tag) => <span key={tag} className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">{tag}</span>)}
                  </div>
                </div>
                <div className="grid justify-items-start gap-2 text-left md:justify-items-center md:text-center">
                  <div className="text-3xl font-black text-red-700">{vehicle.price}</div>
                  <p className="m-0 text-slate-700">One Way<br />All Inclusive</p>
                  <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} className="rounded-md bg-gradient-to-r from-red-700 to-red-800 px-7 py-3 font-black text-white no-underline">Book Now</a>
                </div>
              </article>
            );
          })}
        </section>
      </section>

      <footer className="px-4 pb-9 pt-2 text-center text-slate-500">
        <b>Vishwakarma Travels</b>
        <p className="m-0 mt-1">Jugsalai, Jamshedpur</p>
      </footer>
    </main>
  );
}
