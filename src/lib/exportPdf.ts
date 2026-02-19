import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  element.style.backgroundColor = "";
  element.style.color = "";

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");

  // Header
  pdf.setFontSize(16);
  pdf.text(`${clientName} — Reddit Performance Report`, 14, 15);
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Date Range: ${dateRange} | Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  pdf.setTextColor(0);

  let heightLeft = imgHeight;
  let position = 28;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - position;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${clientName.replace(/\s+/g, "_")}_Reddit_Report_${dateRange}.pdf`);
}
