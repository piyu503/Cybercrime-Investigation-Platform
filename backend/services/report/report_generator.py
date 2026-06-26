import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_court_report_pdf(case: Dict[str, Any]) -> io.BytesIO:
    """
    Generates a professional court report using ReportLab.
    Returns a BytesIO buffer containing the PDF data.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter,
        rightMargin=72, leftMargin=72,
        topMargin=72, bottomMargin=18
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Center', alignment=1))
    
    title_style = styles['Title']
    heading1_style = styles['Heading1']
    heading2_style = styles['Heading2']
    normal_style = styles['Normal']

    Story = []

    # 1. Official Header
    Story.append(Paragraph("<b>OFFICIAL INVESTIGATION REPORT</b>", title_style))
    Story.append(Paragraph("<b>DEPARTMENT OF FORENSIX INTELLIGENCE</b>", styles['Center']))
    Story.append(Spacer(1, 0.5 * inch))

    # 2. Case Information
    Story.append(Paragraph("<b>CASE INFORMATION</b>", heading1_style))
    case_data = [
        ["Case ID:", str(case.get("_id", "N/A"))],
        ["Case Name:", case.get("case_name", "N/A")],
        ["Date Generated:", case.get("created_at", "N/A").strftime("%Y-%m-%d %H:%M") if hasattr(case.get("created_at", ""), "strftime") else str(case.get("created_at", "N/A"))],
        ["Description:", case.get("description", "N/A")]
    ]
    t = Table(case_data, colWidths=[1.5 * inch, 4.5 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    Story.append(t)
    Story.append(Spacer(1, 0.2 * inch))

    # 3. Investigation Findings (Summary)
    intel = case.get("intelligence", {})
    summary_data = intel.get("summary", {})
    
    if summary_data:
        Story.append(Paragraph("<b>EXECUTIVE SUMMARY</b>", heading1_style))
        if isinstance(summary_data, dict):
            # Format dict nicely
            for key, val in summary_data.items():
                if isinstance(val, list):
                    Story.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b>", heading2_style))
                    for item in val:
                        if isinstance(item, dict):
                            # Convert complex object to readable string for PDF
                            item_str = " | ".join([f"{k}: {v}" for k, v in item.items() if v and not isinstance(v, list)])
                            if "source_files" in item and isinstance(item["source_files"], list):
                                item_str += f" | sources: {', '.join(item['source_files'])}"
                            Story.append(Paragraph(f"• {item_str}", normal_style))
                        else:
                            Story.append(Paragraph(f"• {str(item)}", normal_style))
                elif isinstance(val, dict):
                    Story.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b>", heading2_style))
                    for k, v in val.items():
                        Story.append(Paragraph(f"• <b>{k.replace('_', ' ').title()}:</b> {v}", normal_style))
                else:
                    Story.append(Paragraph(f"<b>{key.replace('_', ' ').title()}:</b> {str(val)}", normal_style))
        else:
            Story.append(Paragraph(str(summary_data), normal_style))
        Story.append(Spacer(1, 0.2 * inch))
        
    readiness = intel.get("readiness", {})
    if readiness:
        Story.append(Paragraph(f"<b>Readiness Score:</b> {readiness.get('overall_score', 'N/A')}% - {readiness.get('status', 'N/A')}", normal_style))
        Story.append(Spacer(1, 0.2 * inch))

    # 4. Evidence Inventory
    Story.append(Paragraph("<b>EVIDENCE INVENTORY</b>", heading1_style))
    files = case.get("files", [])
    if files:
        evidence_data = [["Filename", "Type"]]
        for f in files:
            evidence_data.append([f.get("filename", "N/A"), f.get("filetype", "N/A")])
        t2 = Table(evidence_data, colWidths=[4 * inch, 2 * inch])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        Story.append(t2)
    else:
        Story.append(Paragraph("No evidence processed.", normal_style))
    Story.append(Spacer(1, 0.2 * inch))

    # 5. Timeline (Chronological)
    Story.append(PageBreak())
    Story.append(Paragraph("<b>CHRONOLOGICAL TIMELINE</b>", heading1_style))
    timeline = case.get("timeline", [])
    if timeline:
        for event in timeline:
            Story.append(Paragraph(f"<b>{event.get('timestamp', 'Unknown Time')}</b>", heading2_style))
            Story.append(Paragraph(event.get('description', ''), normal_style))
            Story.append(Spacer(1, 0.1 * inch))
    else:
        Story.append(Paragraph("No timeline generated.", normal_style))
        
    # 6. Recommendations & Gaps
    Story.append(PageBreak())
    Story.append(Paragraph("<b>INVESTIGATION GAPS & RECOMMENDATIONS</b>", heading1_style))
    
    gaps = intel.get("gaps", [])
    if gaps:
        Story.append(Paragraph("<b>Identified Gaps:</b>", heading2_style))
        for gap in gaps:
            Story.append(Paragraph(f"• {gap.get('reason', '')} (Confidence: {gap.get('confidence', '')})", normal_style))
        Story.append(Spacer(1, 0.1 * inch))
        
    recs = intel.get("recommendations", [])
    if recs:
        Story.append(Paragraph("<b>Recommendations:</b>", heading2_style))
        for rec in recs:
            Story.append(Paragraph(f"• {rec.get('action', '')} (Reason: {rec.get('reason', '')})", normal_style))

    # 7. Signature Placeholder
    Story.append(Spacer(1, 1 * inch))
    Story.append(Paragraph("________________________________", normal_style))
    Story.append(Paragraph("<b>Lead Investigating Officer</b>", normal_style))
    Story.append(Paragraph("Signature & Date", normal_style))

    doc.build(Story)
    buffer.seek(0)
    return buffer
