import { jsPDF } from 'jspdf';

// Professional, minimalist color palette
const colors = {
  primary: '#111827', // Deep black-gray for headers
  secondary: '#4B5563', // Medium gray for secondary text
  text: '#1F2937', // Dark gray for body text
  muted: '#6B7280', // Muted gray for subtle text
  border: '#D1D5DB', // Light gray for borders
  background: '#F9FAFB', // Clean off-white background
  tableHeader: '#1F2937', // Dark gray for table header
};

const typography = {
  title: { size: 24, style: 'bold', family: 'times' },
  sectionHeader: { size: 18, style: 'bold', family: 'times' },
  body: { size: 12, style: 'normal', family: 'times' },
  label: { size: 12, style: 'bold', family: 'times' },
  description: { size: 11, style: 'normal', family: 'times' },
  footer: { size: 9, style: 'italic', family: 'times' },
};

export default function generateEvenementPdf(evenement) {
  const doc = new jsPDF({ unit: 'pt' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const lineHeight = 20;
  const sectionSpacing = 25;
  const bottomMargin = 60;
  
  const { naam, datum, plaats, gereedschappen = [] } = evenement;
  
const logourl = '/images/reboost_text_logo.jpg';

  const logo = new Image();
  logo.src = logourl;

  logo.onload = () => {
    let currentPage = 1;
    

    doc.setFillColor(colors.background);
    doc.rect(0, 0, pageWidth, 100, 'F');
    

    doc.setDrawColor(colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, 100, pageWidth - margin, 100);


    const logoHeight = 60;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    const logoX = margin;
    const logoY = 20;
    doc.addImage(logo, 'JPEG', logoX, logoY, Math.min(logoWidth, 140), logoHeight);

    const titleX = logoX + Math.min(logoWidth, 140) + 20;
    const titleY = logoY + logoHeight / 2 + 10;
    
    let titleFontSize = typography.title.size;
    doc.setFont(typography.title.family, typography.title.style);
    doc.setFontSize(titleFontSize);
    
    const titleText = `Evenementfiche: ${naam}`;
    const titleMaxWidth = usableWidth - Math.min(logoWidth, 140) - 20;
    while (doc.getTextWidth(titleText) > titleMaxWidth && titleFontSize > 18) {
      titleFontSize -= 1;
      doc.setFontSize(titleFontSize);
    }

    doc.setTextColor(colors.primary);
    const titleLines = doc.splitTextToSize(titleText, titleMaxWidth);
    titleLines.forEach((line, index) => {
      doc.text(line, titleX, titleY + index * (titleFontSize + 3));
    });

    let y = 100 + sectionSpacing;

    function addPageIfNeeded(requiredSpace = lineHeight * 2) {
      if (y + requiredSpace > pageHeight - bottomMargin) {
        currentPage++;
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    }


    function drawSectionHeader(text) {
      addPageIfNeeded(lineHeight * 3);
      
      y += 12;
      doc.setFont(typography.sectionHeader.family, typography.sectionHeader.style);
      doc.setFontSize(typography.sectionHeader.size);
      doc.setTextColor(colors.primary);
      doc.text(text, margin, y);
      
      y += 8;
      doc.setDrawColor(colors.secondary);
      doc.setLineWidth(1);
      doc.line(margin, y, margin + doc.getTextWidth(text) + 10, y);
      
      y += sectionSpacing * 0.7;
    }

    // === TEXT HELPER ===
    function addText(text, options = {}) {
      const {
        fontSize = typography.body.size,
        fontStyle = typography.body.style,
        color = colors.text,
        indent = 0,
        spaceAfter = lineHeight
      } = options;
      
      doc.setFont(typography.body.family, fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      
      const textLines = doc.splitTextToSize(text, usableWidth - indent);
      textLines.forEach(line => {
        addPageIfNeeded();
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
      
      y += spaceAfter - lineHeight;
    }

    drawSectionHeader('Evenement Details');

    const formattedDate = new Date(datum).toLocaleDateString('nl-BE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const eventDetails = [
      { label: 'Datum', value: formattedDate },
      { label: 'Locatie', value: plaats.naam },
      { label: 'Adres', value: `${plaats.straat} ${plaats.huisnummer}, ${plaats.postcode} ${plaats.gemeente}` }
    ];

    addPageIfNeeded(lineHeight * (eventDetails.length + 2) * 2);
    doc.setFillColor(colors.background);
    doc.setDrawColor(colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin - 1, y - 1, usableWidth + 2, (eventDetails.length * lineHeight) + 24, 6, 6, 'FD');
    
    y += 15;
    eventDetails.forEach(detail => {
      addPageIfNeeded(lineHeight * 2);
      
      doc.setFont(typography.label.family, typography.label.style);
      doc.setFontSize(typography.label.size);
      doc.setTextColor(colors.secondary);
      doc.text(detail.label + ':', margin + 10, y);
      
      doc.setFont(typography.body.family, typography.body.style);
      doc.setTextColor(colors.text);
      const valueLines = doc.splitTextToSize(detail.value, usableWidth - 80);
      valueLines.forEach((line, i) => {
        if (i > 0) addPageIfNeeded();
        doc.text(line, margin + 80, y + i * lineHeight);
      });
      
      y += lineHeight + 5;
    });
    
    y += 10 + sectionSpacing;

    // === TOOLS SECTION (Clean table layout) ===
    drawSectionHeader('Gereedschappen');

    if (gereedschappen.length === 0) {
      addText('Geen gereedschap gekoppeld aan dit evenement.', {
        fontStyle: 'italic',
        color: colors.muted,
        spaceAfter: sectionSpacing
      });
    } else {
      // Table header
      addPageIfNeeded(lineHeight * 3);
      doc.setFillColor(colors.tableHeader);
      doc.rect(margin, y, usableWidth, lineHeight + 8, 'F');
      doc.setDrawColor(colors.border);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, usableWidth, lineHeight + 8);
      doc.line(margin + 180, y, margin + 180, y + lineHeight + 8);
      
      doc.setFont(typography.label.family, typography.label.style);
      doc.setFontSize(typography.label.size);
      doc.setTextColor('#FFFFFF');
      doc.text('Naam', margin + 10, y + 18);
      doc.text('Beschrijving', margin + 190, y + 18);
      y += lineHeight + 8;

      // Table rows
      gereedschappen.forEach((tool) => {
        addPageIfNeeded(lineHeight * 4);
        
        // Calculate row height
        const nameLines = doc.splitTextToSize(tool.naam, 160);
        const descriptionLines = tool.beschrijving && tool.beschrijving.trim() 
          ? doc.splitTextToSize(tool.beschrijving.trim(), usableWidth - 200)
          : ['Geen beschrijving'];
        const rowHeight = Math.max(nameLines.length, descriptionLines.length) * lineHeight + 10;
        
        // Row borders
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.5);
        doc.rect(margin, y, usableWidth, rowHeight);
        doc.line(margin + 180, y, margin + 180, y + rowHeight);
        
        // Tool name
        doc.setFont(typography.body.family, typography.body.style);
        doc.setFontSize(typography.body.size);
        doc.setTextColor(colors.text);
        nameLines.forEach((line, i) => {
          doc.text(line, margin + 10, y + 15 + i * lineHeight);
        });

        // Tool description
        descriptionLines.forEach((line, i) => {
          addPageIfNeeded();
          doc.setFont(typography.description.family, descriptionLines[0] === 'Geen beschrijving' ? 'italic' : typography.description.style);
          doc.setFontSize(typography.description.size);
          doc.setTextColor(colors.muted);
          doc.text(line, margin + 190, y + 15 + i * lineHeight);
        });
        
        y += rowHeight;
      });
      
      // Bottom border
      doc.setDrawColor(colors.border);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + usableWidth, y);
    }

    y += sectionSpacing;

    // === FOOTER ===
    function addFooter(pageNum, totalPages) {
      const footerY = pageHeight - 50;
      
      // Footer line
      doc.setDrawColor(colors.border);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      // Footer text
      doc.setFont(typography.footer.family, typography.footer.style);
      doc.setFontSize(typography.footer.size);
      doc.setTextColor(colors.muted);

      const currentDate = new Date().toLocaleDateString('nl-BE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const footerText = `Gegenereerd op ${currentDate} | Reboost Events | Pagina ${pageNum} van ${totalPages}`;
      const footerWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (pageWidth - footerWidth) / 2, footerY + 20);
    }

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    // Generate filename
    const cleanName = naam
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const dateString = new Date().toISOString().split('T')[0];
    doc.save(`evenement_${cleanName}_${dateString}.pdf`);
  };
  
  logo.onerror = () => {
    console.warn('Logo could not be loaded, generating PDF without logo');
  };
}