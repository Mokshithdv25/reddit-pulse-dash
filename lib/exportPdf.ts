import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** JPEG quality for PDF export (0–1). Lower = smaller file, slightly less sharp. */
const JPEG_QUALITY = 0.82;

/** Scale for html2canvas (1 = 96dpi, 1.5 = good balance, 2 = very large files). */
const CANVAS_SCALE = 1.5;

export async function exportDashboardToPdf(
  elementId: string,
  clientName: string,
  dateRange: string
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Temporarily apply print-friendly styles
  element.style.backgroundColor = "white";
  element.style.color = "black";

  const canvas = await html2canvas(element, {
    scale: CANVAS_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  element.style.backgroundColor = "";
  element.style.color = "";

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const marginTop = 28;
  const imgHeightMm = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");

  // Header
  pdf.setFontSize(16);
  pdf.text(`${clientName} — Reddit Performance Report`, 14, 15);
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Date Range: ${dateRange} | Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  pdf.setTextColor(0);

  // Slice the long canvas into one image per page so we don't embed the full image on every page (was causing huge PDFs).
  const pageHeightPx = (pageHeight - marginTop) * (canvas.width / imgWidth);
  const totalPages = Math.ceil(canvas.height / pageHeightPx) || 1;

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const srcY = page * pageHeightPx;
    const sliceHeight = Math.min(pageHeightPx, canvas.height - srcY);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight;
    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(canvas, 0, srcY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    const imgData = sliceCanvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const sliceHeightMm = (sliceHeight * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, marginTop, imgWidth, sliceHeightMm);
  }

  pdf.save(`${clientName.replace(/\s+/g, "_")}_Reddit_Report_${dateRange}.pdf`);
}
