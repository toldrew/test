import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel } from 'docx'
import type { Tournament, Team } from '@/types'

/**
 * Exporter Service
 * 
 * Handles PDF, Word, and Print export functionality for tournament schedules.
 * Formats data with localization (ru-RU) and theme colors.
 */

interface ExportOptions {
  tournament: Tournament
  teams: Team[]
  getTeamName: (teamId: string | null) => string
  formatDate: (date?: Date) => string
  onProgress?: (progress: number) => void
}

/**
 * Formats date for export documents
 */
function formatDateForExport(date?: Date): string {
  if (!date) return 'Не указано'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Gets status label in Russian
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Завершен'
    case 'in_progress':
      return 'В процессе'
    case 'cancelled':
      return 'Отменен'
    default:
      return 'Запланирован'
  }
}

/**
 * Export tournament schedule to PDF
 */
export async function exportToPDF(options: ExportOptions): Promise<void> {
  const { tournament, getTeamName, onProgress } = options

  try {
    onProgress?.(10)

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Add Russian font support (using built-in fonts, limited Cyrillic support)
    doc.setFont('helvetica')
    
    // Title
    doc.setFontSize(20)
    doc.text(tournament.name, 105, 20, { align: 'center' })
    
    // Tournament info
    doc.setFontSize(12)
    let yPos = 35
    
    if (tournament.description) {
      doc.setFontSize(10)
      doc.text(`Описание: ${tournament.description}`, 15, yPos)
      yPos += 7
    }
    
    if (tournament.startDate) {
      doc.text(`Дата начала: ${formatDateForExport(tournament.startDate)}`, 15, yPos)
      yPos += 7
    }
    
    doc.text(`Тип турнира: ${tournament.type === 'groups' ? 'Групповой' : 'Плей-офф'}`, 15, yPos)
    yPos += 7
    
    doc.text(`Количество команд: ${tournament.teamIds.length}`, 15, yPos)
    yPos += 10

    onProgress?.(30)

    // Add matches by round
    tournament.rounds.forEach((round, roundIndex) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Round header
      doc.setFontSize(14)
      doc.setTextColor(99, 102, 241) // Primary color
      doc.text(round.name || `Раунд ${round.roundNumber}`, 15, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128) // Secondary color
      doc.text(
        `${formatDateForExport(round.startDate)} - ${formatDateForExport(round.endDate)}`,
        15,
        yPos
      )
      yPos += 10

      // Table data
      const tableData = round.matches.map(match => [
        `${getTeamName(match.homeTeamId)} vs ${getTeamName(match.awayTeamId)}`,
        formatDateForExport(match.scheduledDate),
        match.location || 'TBD',
        match.result ? `${match.result.homeScore} : ${match.result.awayScore}` : '-',
        getStatusLabel(match.status)
      ])

      // Reset text color for table
      doc.setTextColor(0, 0, 0)

      // Add table
      autoTable(doc, {
        startY: yPos,
        head: [['Матч', 'Дата', 'Место', 'Счет', 'Статус']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [99, 102, 241],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        margin: { left: 15, right: 15 }
      })

      // Update yPos after table
      yPos = (doc as any).lastAutoTable.finalY + 15

      onProgress?.(30 + (roundIndex / tournament.rounds.length) * 60)
    })

    onProgress?.(95)

    // Save the PDF
    doc.save(`${tournament.name}_schedule.pdf`)
    
    onProgress?.(100)
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error('Не удалось экспортировать PDF')
  }
}

/**
 * Export tournament schedule to Word document
 */
export async function exportToWord(options: ExportOptions): Promise<void> {
  const { tournament, getTeamName, onProgress } = options

  try {
    onProgress?.(10)

    // Title and metadata
    const children: any[] = [
      new Paragraph({
        text: tournament.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      })
    ]

    if (tournament.description) {
      children.push(
        new Paragraph({
          text: `Описание: ${tournament.description}`,
          spacing: { after: 200 }
        })
      )
    }

    if (tournament.startDate) {
      children.push(
        new Paragraph({
          text: `Дата начала: ${formatDateForExport(tournament.startDate)}`,
          spacing: { after: 200 }
        })
      )
    }

    children.push(
      new Paragraph({
        text: `Тип турнира: ${tournament.type === 'groups' ? 'Групповой' : 'Плей-офф'}`,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: `Количество команд: ${tournament.teamIds.length}`,
        spacing: { after: 400 }
      })
    )

    onProgress?.(30)

    // Add rounds
    tournament.rounds.forEach((round, roundIndex) => {
      // Round title
      children.push(
        new Paragraph({
          text: round.name || `Раунд ${round.roundNumber}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: `${formatDateForExport(round.startDate)} - ${formatDateForExport(round.endDate)}`,
          spacing: { after: 300 }
        })
      )

      // Create table for matches
      const tableRows = [
        // Header row
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Матч', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Дата', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Место', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Счет', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: 'Статус', bold: true })] })
          ]
        }),
        // Data rows
        ...round.matches.map(
          match =>
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph(`${getTeamName(match.homeTeamId)} vs ${getTeamName(match.awayTeamId)}`)
                  ]
                }),
                new TableCell({
                  children: [new Paragraph(formatDateForExport(match.scheduledDate))]
                }),
                new TableCell({
                  children: [new Paragraph(match.location || 'TBD')]
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      match.result ? `${match.result.homeScore} : ${match.result.awayScore}` : '-'
                    )
                  ]
                }),
                new TableCell({
                  children: [new Paragraph(getStatusLabel(match.status))]
                })
              ]
            })
        )
      ]

      children.push(
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          },
          rows: tableRows
        }),
        new Paragraph({ text: '', spacing: { after: 400 } })
      )

      onProgress?.(30 + (roundIndex / tournament.rounds.length) * 60)
    })

    onProgress?.(90)

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${tournament.name}_schedule.docx`
    link.click()
    window.URL.revokeObjectURL(url)

    onProgress?.(100)
  } catch (error) {
    console.error('Word export failed:', error)
    throw new Error('Не удалось экспортировать Word документ')
  }
}

/**
 * Print tournament schedule
 */
export function printSchedule(): void {
  window.print()
}
