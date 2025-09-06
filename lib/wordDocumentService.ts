import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

export interface InterviewSnapshotData {
  participant: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    jobTitle: string;
    specialties: string[];
    background: string;
    howGotJob: string;
    age: string;
    gender: string;
    zipCode: string;
    householdIncome: string;
    education: string;
    householdSize: string;
    childrenInSchool: string;
    commuteAreas: string;
  };
  audienceType: string;
  interviewerName: string;
  selectedResearchQuestions: Array<{
    id: string;
    questionText: string;
    category: string;
  }>;
  responses: Array<{
    questionText: string;
    answerText?: string;
    answerYesno?: boolean;
    answerScale?: number;
    answerCurrencyCents?: number;
    answerMultiselect?: string[];
    notes?: string;
  }>;
  summary: {
    takeaways: string;
    problems: string;
    opportunities: string;
    quote: string;
  };
  createdAt: string;
}

export class WordDocumentService {
  static async generateInterviewSnapshot(data: InterviewSnapshotData): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Interview Snapshot",
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Participant Information Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Participant Information",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),

          // Participant Details Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Name", bold: true })] })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: `${data.participant.firstName} ${data.participant.lastName}` })] })],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Company", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.company })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Job Title", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.jobTitle })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Email", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.email })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Phone", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.phone })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Background", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.background })] })],
                  }),
                ],
              }),
            ],
          }),

          // Demographic Information Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Demographic Information",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),

          // Demographic Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Age Range", bold: true })] })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.age })] })],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Gender", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.gender })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "ZIP Code", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.zipCode })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Household Income", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.householdIncome })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Education", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.education })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Household Size", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: data.participant.householdSize })] })],
                  }),
                ],
              }),
            ],
          }),

          // Research Questions Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Research Questions Explored",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),

          // Research Questions List
          ...data.selectedResearchQuestions.map(question => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${question.questionText}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          ),

          // Interview Responses Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Interview Responses",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),

          // Interview Responses
          ...data.responses.map(response => {
            let answerText = '';
            if (response.answerText) answerText = response.answerText;
            else if (response.answerYesno !== undefined) answerText = response.answerYesno ? 'Yes' : 'No';
            else if (response.answerScale !== undefined) answerText = `${response.answerScale}/10`;
            else if (response.answerCurrencyCents !== undefined) answerText = `$${(response.answerCurrencyCents / 100).toFixed(2)}`;
            else if (response.answerMultiselect?.length) answerText = response.answerMultiselect.join(', ');

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Q: ${response.questionText}`,
                    bold: true,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `A: ${answerText}`,
                    size: 18,
                  }),
                ],
                spacing: { after: 100 },
              }),
              ...(response.notes ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Notes: ${response.notes}`,
                      italics: true,
                      size: 16,
                    }),
                  ],
                  spacing: { after: 200 },
                })
              ] : [])
            ];
          }).flat(),

          // Summary Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Summary & Insights",
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),

          // Key Takeaways
          new Paragraph({
            children: [
              new TextRun({
                text: "Key Takeaways",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.summary.takeaways,
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Problems Observed
          new Paragraph({
            children: [
              new TextRun({
                text: "Problems Observed",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.summary.problems,
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Opportunities
          new Paragraph({
            children: [
              new TextRun({
                text: "Opportunities & Ideas",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.summary.opportunities,
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Memorable Quote
          new Paragraph({
            children: [
              new TextRun({
                text: "Memorable Quote",
                bold: true,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `"${data.summary.quote}"`,
                italics: true,
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: `Interview conducted by: ${data.interviewerName}`,
                size: 16,
              }),
            ],
            spacing: { before: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date(data.createdAt).toLocaleDateString()}`,
                size: 16,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Audience Type: ${data.audienceType.charAt(0).toUpperCase() + data.audienceType.slice(1)}`,
                size: 16,
              }),
            ],
          }),
        ],
      }],
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const fileName = `Interview-Snapshot-${data.participant.firstName}-${data.participant.lastName}-${new Date(data.createdAt).toISOString().split('T')[0]}.docx`;
    
    saveAs(blob, fileName);
  }
}
