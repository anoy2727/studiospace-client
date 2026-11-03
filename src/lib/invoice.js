// Generates a downloadable PDF receipt for a confirmed booking (loaded on demand to keep the bundle small).
export async function downloadInvoice(b) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const m = 48;
  const no = `SS-${String(b._id).slice(-8).toUpperCase()}`;
  const money = (n) => `$${Number(n).toFixed(2)}`;

  doc.setFillColor(47, 59, 255);
  doc.rect(0, 0, W, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(24).text("StudioSpace", m, 56);
  doc.setFont("helvetica", "normal").setFontSize(11).text("Booking invoice", W - m, 46, { align: "right" });
  doc.setFontSize(13).text(no, W - m, 66, { align: "right" });

  doc.setTextColor(20, 24, 29);
  let y = 140;
  const row = (label, value) => {
    doc.setFont("helvetica", "normal").setTextColor(110, 116, 126).setFontSize(10).text(label, m, y);
    doc.setFont("helvetica", "bold").setTextColor(20, 24, 29).setFontSize(12).text(String(value), m + 130, y);
    y += 26;
  };
  doc.setFont("helvetica", "bold").setFontSize(15).text("Session details", m, y); y += 28;
  row("Studio", b.studioTitle);
  row("Location", b.studioLocation);
  row("Date", b.date);
  row("Time", `${b.startTime} – ${b.endTime} (${b.hours} h)`);
  row("Guests", b.guests);
  row("Host", b.hostName);
  row("Booked by", `${b.userName} (${b.userEmail})`);
  row("Status", b.status);

  y += 14;
  doc.setDrawColor(223, 226, 230).line(m, y, W - m, y); y += 28;
  doc.setFont("helvetica", "bold").setFontSize(15).text("Charges", m, y); y += 28;
  const line = (label, value, bold) => {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 14 : 12).setTextColor(20, 24, 29);
    doc.text(label, m, y);
    doc.text(value, W - m, y, { align: "right" });
    y += 26;
  };
  line(`${money(b.hourlyRate)} × ${b.hours} hours`, money(b.subtotal));
  line("Refundable security deposit", money(b.securityDeposit));
  doc.setDrawColor(20, 24, 29).line(m, y - 12, W - m, y - 12);
  y += 6;
  line("Total", money(b.total), true);

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(110, 116, 126);
  doc.text(`Issued ${new Date().toLocaleDateString("en-GB")}. The security deposit is returned after the session if the space is left in its original condition.`, m, 780, { maxWidth: W - m * 2 });
  doc.save(`StudioSpace-invoice-${no}.pdf`);
}
