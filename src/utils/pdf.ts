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

export const generateAlumnosReport = async (data: any) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text(data.titulo, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.text(`Fecha: ${data.fecha}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Estadísticas
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Estadísticas:', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.text(`Total seleccionados: ${data.estadisticas.totalSeleccionados}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`Activos: ${data.estadisticas.activos}`, 25, yPosition);
  yPosition += 6;
  pdf.text(`Con cuotas vencidas: ${data.estadisticas.vencidos}`, 25, yPosition);
  yPosition += 20;

  // Tabla de alumnos
  pdf.setFontSize(12);
  pdf.text('Lista de Alumnos:', 20, yPosition);
  yPosition += 10;

  // Headers de tabla
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  const headers = ['Nombre', 'DNI', 'Email', 'Teléfono', 'Plan', 'Estado', 'Vencimiento'];
  const columnWidths = [40, 20, 40, 25, 25, 20, 25];
  let xPosition = 20;

  headers.forEach((header, index) => {
    pdf.text(header, xPosition, yPosition);
    xPosition += columnWidths[index];
  });

  yPosition += 8;

  // Línea separadora
  pdf.setLineWidth(0.5);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 5;

  // Datos de alumnos
  pdf.setFont('helvetica', 'normal');
  data.alumnos.forEach((alumno: any) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    xPosition = 20;
    const rowData = [
      alumno.nombre,
      alumno.dni,
      alumno.email,
      alumno.telefono,
      alumno.plan,
      alumno.estado,
      alumno.fechaVencimiento
    ];

    rowData.forEach((value, index) => {
      const maxWidth = columnWidths[index] - 2;
      const lines = pdf.splitTextToSize(value.toString(), maxWidth);
      pdf.text(lines, xPosition, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition += 8;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generado por MC GYM - ${new Date().toLocaleString('es-AR')}`, pageWidth / 2, pageHeight - 10, {
    align: 'center'
  });

  // Descargar PDF
  const blob = pdf.output('blob');
  downloadPdf(blob, `reporte-alumnos-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const pdfUtils = {
  generateRutinaPdf,
  downloadPdf,
  generateAlumnosReport,
};
