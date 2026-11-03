// Uploads an image file to imgbb and returns the hosted URL. Needs NEXT_PUBLIC_IMGBB_KEY.
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured. Paste an image URL instead.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Choose an image smaller than 8 MB.");
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data?.url) throw new Error("Image upload failed. Try again or paste an image URL.");
  return json.data.url;
}
