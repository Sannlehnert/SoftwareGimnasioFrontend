import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateRutinaPdf = async (_rutina: any, container: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(container, {
    // scale: 2, // Removed as it's not supported in Html2CanvasOptions
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 30;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('MC GYM - Rutina de Entrenamiento', pdfWidth / 2, 20, { align: 'center' });
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generado el ${new Date().toLocaleDateString('es-AR')}`, pdfWidth / 2, pdfHeight - 10, { 
    align: 'center' 
  });

  return pdf.output('blob');
};

export const downloadPdf = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};