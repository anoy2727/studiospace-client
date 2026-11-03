"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiXCircle } from "react-icons/fi";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

function Explore() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMin] = useState("");
  const [maxPrice, setMax] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debounced, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    let live = true;
    setData(null);
    setError("");
    const q = new URLSearchParams({ sort, page, limit: 9 });
    if (debounced) q.set("search", debounced);
    if (category) q.set("category", category);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    api(`/studios?${q}`).then((d) => live && setData(d)).catch((e) => live && (setError(e.message), setData({ studios: [], total: 0, pages: 1 })));
    return () => { live = false; };
  }, [debounced, category, sort, minPrice, maxPrice, page]);

  const filtered = search || category || minPrice || maxPrice;
  const reset = () => { setSearch(""); setCategory(""); setMin(""); setMax(""); setSort("newest"); };

  return (
    <div className="wrap page-pad">
      <h1 className="section-title">Explore studios</h1>
      <p className="section-sub">Search every listed space and narrow it down by category, price and rating.</p>

      <div className="card-surface mt-8 grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-12">
        <label className="relative lg:col-span-4">
          <span className="sr-only">Search studios</span>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, city or amenity" className="input input-bordered w-full pl-10" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className="select select-bordered w-full lg:col-span-2">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-2 lg:col-span-3">
          <input type="number" min="0" value={minPrice} onChange={(e) => setMin(e.target.value)} placeholder="Min $/hr" aria-label="Minimum price per hour" className="input input-bordered w-full" />
          <input type="number" min="0" value={maxPrice} onChange={(e) => setMax(e.target.value)} placeholder="Max $/hr" aria-label="Maximum price per hour" className="input input-bordered w-full" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="select select-bordered w-full lg:col-span-3">
          <option value="newest">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-base-content/70">
        <p>{data ? `${data.total} ${data.total === 1 ? "studio" : "studios"} found` : "Searching…"}</p>
        {filtered && <button onClick={reset} className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FiXCircle /> Clear filters</button>}
      </div>

      <div className="mt-4">
        {data === null ? <GridSkeleton count={9} /> : data.studios.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.studios.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
            {data.pages > 1 && (
              <div className="join mt-10 flex justify-center">
                <button className="btn join-item" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                {Array.from({ length: data.pages }).map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`btn join-item ${page === i + 1 ? "btn-primary" : ""}`}>{i + 1}</button>)}
                <button className="btn join-item" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        ) : (
          <EmptyState icon={FiSearch} title={error ? "We could not load studios" : "No studios match your search"} text={error || "Try a different keyword, widen the price range or clear your filters."} onCta={reset} ctaLabel="Clear filters" />
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return <Suspense fallback={<div className="wrap page-pad"><GridSkeleton count={9} /></div>}><Explore /></Suspense>;
}
