export const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

// Home page category cards -> value used by the /studios filter
export const CATEGORY_CARDS = [
  { label: "Photo Studios", value: "Photo Studio", blurb: "Cyc walls, natural light and strobe kits", icon: "camera" },
  { label: "Sound Stages", value: "Film Stage", blurb: "Soundproofed stages with lighting grids", icon: "film" },
  { label: "Podcast Rooms", value: "Podcast Lounge", blurb: "Treated rooms with broadcast mics", icon: "mic" },
  { label: "Music Suites", value: "Music Suite", blurb: "Control rooms, booths and rehearsal space", icon: "music" },
  { label: "Art Workshops", value: "Workshop", blurb: "Easels, wheels and big work tables", icon: "brush" },
];

export const AMENITY_OPTIONS = [
  "Wi-Fi", "Air conditioning", "Parking", "Green room", "Makeup station", "Lighting kit",
  "Backdrops", "Sound treatment", "Microphones", "Monitors", "Kitchenette", "Power backup",
];

export const PASSWORD_RULES = [
  { test: (p) => /[A-Z]/.test(p), text: "One uppercase letter" },
  { test: (p) => /[a-z]/.test(p), text: "One lowercase letter" },
  { test: (p) => p.length >= 6, text: "At least 6 characters" },
];

export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"560\" viewBox=\"0 0 800 560\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2b2f3a\"/><stop offset=\"1\" stop-color=\"#12141a\"/></linearGradient></defs><rect width=\"800\" height=\"560\" fill=\"url(#g)\"/><circle cx=\"400\" cy=\"280\" r=\"64\" fill=\"none\" stroke=\"#7b86ff\" stroke-width=\"6\"/><circle cx=\"400\" cy=\"280\" r=\"18\" fill=\"#7b86ff\"/></svg>`
  );

export const money = (n) => `$${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
