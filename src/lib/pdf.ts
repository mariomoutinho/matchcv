import { jsPDF } from "jspdf";
export function createResumePdf(text: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica");
  doc.setFontSize(11);
  let y = 22;
  for (const paragraph of text.split("\n")) {
    const lines: string[] = doc.splitTextToSize(paragraph || " ", 166);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 22;
      }
      doc.text(line, 22, y);
      y += 5.5;
    }
  }
  return doc;
}
export function exportResumePdf(text: string) {
  createResumePdf(text).save("curriculo-ats.pdf");
}
