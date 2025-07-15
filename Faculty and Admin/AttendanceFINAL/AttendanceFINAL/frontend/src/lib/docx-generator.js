
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from 'docx';

export const generateDocx = (title, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "No data available to generate the document.", alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        ],
      }],
    });
    return doc;
  }

  const keys = Object.keys(data[0]);

  const headerCells = keys.map(key => 
    new TableCell({
      children: [new Paragraph({ 
        children: [new TextRun({ text: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), bold: true })],
        alignment: AlignmentType.CENTER 
      })],
      shading: { fill: "E0E0E0" },
    })
  );

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = data.map(item => 
    new TableRow({
      children: keys.map(key => 
        new TableCell({
          children: [new Paragraph(String(item[key] === undefined || item[key] === null ? 'N/A' : item[key]))],
        })
      ),
    })
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: Array(keys.length).fill(100 / keys.length * 100), // Distribute width equally
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        table,
      ],
    }],
  });

  return doc;
};
