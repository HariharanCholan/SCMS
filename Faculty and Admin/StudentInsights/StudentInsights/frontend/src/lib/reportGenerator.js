// ✅ Full working generatePerformanceReport.js
document
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";

export const generatePerformanceReport = (classes, students, quizzes) => {
  const children = [
    new Paragraph({
      children: [new TextRun({ text: "Smart Classroom Performance Report", bold: true, size: 32 })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  classes.forEach(cls => {
    const studentsInClass = students.filter(s => s.className === cls.name);

    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Class: ${cls.name}`, bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    if (studentsInClass.length > 0) {
      const tableHeader = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Student Name")], width: { size: 3000, type: WidthType.DXA } }),
          new TableCell({ children: [new Paragraph("Average")], width: { size: 2000, type: WidthType.DXA } }),
          new TableCell({ children: [new Paragraph("Subjects")], width: { size: 4000, type: WidthType.DXA } }),
        ],
      });

      const studentRows = studentsInClass.map(student => {
        const subjects = student.subjects || [];
        const avg = subjects.length > 0 ? Math.round(subjects.reduce((sum, sub) => sum + (sub.marks || 0), 0) / subjects.length) : 0;
        const subjectDetails = subjects.map(sub => `${sub.name}: ${sub.marks}`).join(", ");

        return new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(student.name)] }),
            new TableCell({ children: [new Paragraph(`${avg}%`)] }),
            new TableCell({ children: [new Paragraph(subjectDetails)] }),
          ],
        });
      });

      const table = new Table({
        rows: [tableHeader, ...studentRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "888888" },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "888888" },
        },
      });

      children.push(table);
    } else {
      children.push(new Paragraph("No students found in this class."));
    }

    children.push(new Paragraph({ spacing: { after: 300 } }));
  });

  return new Document({ sections: [{ children }] });
};
