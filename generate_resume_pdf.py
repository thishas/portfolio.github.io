import os
import sys

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas
except ImportError:
    print("ReportLab is not installed. Please run: pip install reportlab")
    sys.exit(1)

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)
        print(f"Total Pages Generated: {num_pages}")
        if num_pages > 2:
            print(f"ERROR: PDF exceeds 2 pages! Actual pages: {num_pages}", file=sys.stderr)
            sys.exit(1)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#2F2F2F"))
        text = f"Page {self._pageNumber} of {page_count}"
        self.drawCentredString(306, 20, text)
        self.restoreState()

def create_resume_pdf(filename, target_roles, summary_paras, core_skills):
    # Target file
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    # Color palette
    charcoal = colors.HexColor("#2F2F2F")
    ember_clay = colors.HexColor("#7A3E2D")
    muted_gold = colors.HexColor("#B89B72")
    
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=ember_clay,
        alignment=1, # Center
        spaceAfter=4
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=charcoal,
        alignment=1, # Center
        spaceAfter=8
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=12,
        textColor=ember_clay,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=11.5,
        textColor=charcoal,
        spaceAfter=4
    )
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=charcoal,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )
    
    add_bullet_style = ParagraphStyle(
        'AddBulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=charcoal,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=1.5
    )
    
    job_title_style = ParagraphStyle(
        'JobTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=11,
        textColor=charcoal,
        keepWithNext=True
    )
    
    job_company_style = ParagraphStyle(
        'JobCompany',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=10,
        textColor=muted_gold,
        keepWithNext=True
    )

    story = []
    
    # Name and Header
    story.append(Paragraph("THISHA SMITH", name_style))
    story.append(Paragraph('Sacramento, CA | (916) 776-6368 | ThishaSmith@gmail.com | Portfolio: <a href="https://thisha.net" color="#2F2F2F">Thisha.net</a>', contact_style))
    
    def add_section_divider(title):
        t = Table([[Paragraph(title, section_heading)]], colWidths=[540])
        t.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1.25, muted_gold),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    # Target Roles
    add_section_divider("TARGET ROLES")
    roles_text = f"<b>{target_roles}</b>"
    story.append(Paragraph(roles_text, body_style))
    story.append(Spacer(1, 2))
    
    # Professional Summary
    add_section_divider("PROFESSIONAL SUMMARY")
    for p_text in summary_paras:
        story.append(Paragraph(p_text, body_style))
    story.append(Spacer(1, 2))
    
    # Core Skills
    add_section_divider("CORE SKILLS")
    skills_text = " &bull; ".join(core_skills)
    story.append(Paragraph(skills_text, body_style))
    story.append(Spacer(1, 2))
    
    # Professional Experience
    add_section_divider("PROFESSIONAL EXPERIENCE")
    
    def add_job(title, company, date, bullets):
        # Header table to keep date right-aligned
        header_table = Table([
            [Paragraph(title, job_title_style), Paragraph(date, ParagraphStyle('JobDate', parent=job_title_style, alignment=2, textColor=ember_clay))]
        ], colWidths=[380, 160])
        header_table.setStyle(TableStyle([
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ]))
        story.append(header_table)
        story.append(Paragraph(company, job_company_style))
        story.append(Spacer(1, 1))
        
        for bullet in bullets:
            if bullet.startswith("Tools & Technologies:"):
                story.append(Paragraph(f"<b>Tools & Technologies:</b>" + bullet[21:], ParagraphStyle('JobTools', parent=bullet_style, leftIndent=12, firstLineIndent=0, spaceBefore=2)))
            else:
                story.append(Paragraph(f"&bull; {bullet}", bullet_style))
        story.append(Spacer(1, 4))

    # Job 1
    add_job(
        "Data & Reporting Specialist",
        "Master Care, LLC &ndash; Sacramento, CA",
        "02/2026 &ndash; Present",
        [
            "Records & Reporting Support: Validate and reconcile member-level data for CalAIM reporting, ensuring accurate records, clean files, and compliance with reporting requirements.",
            "Confidential Data Handling: Retrieve, process, and organize secure files through SFTP, including encrypted files, structured reporting outputs, and payer-specific submission files.",
            "Data Validation & Quality Review: Utilize advanced Excel functions, reporting logic, and validation techniques to identify discrepancies, improve file accuracy, and support successful monthly submissions.",
            "Team & Stakeholder Support: Provide reporting updates, clarify data issues, and coordinate with internal teams and leadership to meet regulatory and operational deadlines.",
            "Reporting Documentation & Process Improvement: Maintain reporting logic, mapping documentation, validation procedures, and audit-ready working files to support repeatable, scalable, and traceable reporting processes.",
            "Reporting Modernization & AI Workflow Innovation: Support reporting modernization initiatives through process analysis, workflow documentation, validation planning, and evaluation of AI-assisted approaches designed to improve reporting accuracy, operational efficiency, and analyst productivity."
        ]
    )
    
    # Job 2
    add_job(
        "Sales Associate",
        "Macy's &ndash; Sacramento, CA",
        "10/2025 &ndash; 01/2026",
        [
            "Provided efficient, accurate customer service while handling high-volume requests, resolving issues, and following documented procedures.",
            "Maintained clean, compliant point-of-sale records and ensured precise entry of transactions, returns, and adjustments.",
            "Supported daily store operations through organized task tracking, inventory coordination, and adherence to documented procedures."
        ]
    )
    
    # Job 3
    add_job(
        "Business Data Analyst",
        "Intel Corporation &ndash; Sacramento, CA",
        "06/2023 &ndash; 11/2024",
        [
            "Led CRM and internal system enhancements across Business Analyst, Product Owner, and QA roles, translating business needs into clear requirements, user stories, and acceptance criteria.",
            "Directed data governance and automation initiatives, improving reporting accuracy by 30% and increasing team productivity by 25%.",
            "Built and maintained Power BI dashboards and SQL pipelines supporting executive KPIs and operational reporting.",
            "Coordinated UAT and release readiness activities to ensure system changes met business and compliance requirements.",
            "Collaborated with technical and non-technical stakeholders to align priorities, resolve issues, and support timely delivery."
        ]
    )
    
    # Job 4
    add_job(
        "GPU Validation Engineer",
        "Intel Corporation &ndash; Sacramento, CA",
        "04/2017 &ndash; 06/2023",
        [
            "Designed and executed validation strategies for DirectX graphics drivers across multiple hardware platforms to ensure performance, stability, and launch readiness.",
            "Collaborated with engineering and program teams to reduce delivery risks and improve platform reliability.",
            "Developed Python-based automation, reducing manual testing effort by 40% and accelerating validation cycles.",
            "Integrated validation processes into CI/CD pipelines to improve testing consistency and documentation.",
            "Analyzed defects and root causes, contributing to a 35% reduction in post-release issues."
        ]
    )
    
    # Job 5
    add_job(
        "QA Test Analyst Lead",
        "NextGen Information Services Inc. (Client: NJVC LLC) &ndash; St. Louis, MO",
        "07/2014 &ndash; 03/2017",
        [
            "Led QA strategy, test planning, execution, and production support for a .NET-based enterprise application supporting government operations.",
            "Reduced defect leakage by 30% and improved sprint testing efficiency by 40%.",
            "Coordinated functional, regression, and system testing across multiple environments.",
            "Mentored team members, improving onboarding efficiency and overall team performance.",
            "Partnered with developers, analysts, and stakeholders to support continuous improvement."
        ]
    )
    
    # Additional Experience
    add_section_divider("ADDITIONAL EXPERIENCE")
    add_exps = [
        "<b>Senior QA Test Analyst Lead</b> &ndash; Fusion Technology Solutions | Client: Reed Elsevier | 10/2011 &ndash; 02/2013",
        "<b>Senior QA Tester / Lead</b> &ndash; Signature Consultants | Client: Wells Fargo | 05/2011 &ndash; 10/2011",
        "<b>QA Test Lead</b> &ndash; MODIS | Client: US Bank | 10/2010 &ndash; 05/2011",
        "<b>Senior Analyst, Software Testing & Quality Assurance</b> &ndash; TEKsystems | Client: MasterCard | 08/2009 &ndash; 10/2010",
        "<b>Senior QA Tester & Business Analyst</b> &ndash; PlumRhino Consulting | Client: Wachovia Securities | 11/2008 &ndash; 08/2009",
        "<b>QA Consultant</b> &ndash; TEKsystems | Client: MasterCard | 03/2008 &ndash; 10/2008",
        "<b>COBOL Developer / QA / Business Analyst</b> &ndash; Accenture Inc. | Client: A.G. Edwards | 12/2003 &ndash; 12/2007",
        "<b>SAS Developer</b> &ndash; CitiFinancial International | 08/2001 &ndash; 03/2003"
    ]
    for exp in add_exps:
        story.append(Paragraph(f"&bull; {exp}", add_bullet_style))
    story.append(Spacer(1, 2))
    
    # Professional Development & Community Involvement
    add_section_divider("PROFESSIONAL DEVELOPMENT & COMMUNITY INVOLVEMENT")
    story.append(Paragraph("&bull; Participated in Women in Cybersecurity (WiCyS) and Blacks In Cybersecurity (BIC) programs focused on cybersecurity awareness, mentorship, professional growth, networking, and career development.", add_bullet_style))
    story.append(Spacer(1, 2))
    
    # Certifications & Professional Development
    md_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resume_certifications_standard.md")
    if not os.path.exists(md_path):
        print(f"ERROR: Standard certifications source file is missing: {md_path}", file=sys.stderr)
        sys.exit(1)
        
    section_title = "CERTIFICATIONS & PROFESSIONAL DEVELOPMENT"
    cert_items = []
    
    try:
        with open(md_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("#"):
                    title_candidate = line.lstrip("#").strip()
                    if title_candidate:
                        section_title = title_candidate
                elif line.startswith("*") or line.startswith("-"):
                    item = line[1:].strip()
                    if item:
                        item = item.replace("—", "&mdash;")
                        cert_items.append(item)
    except Exception as e:
        print(f"ERROR: Failed to read/parse {md_path}: {e}", file=sys.stderr)
        sys.exit(1)

    if not cert_items:
        print(f"ERROR: No certification items found in {md_path}", file=sys.stderr)
        sys.exit(1)

    add_section_divider(section_title.upper())
    for item in cert_items:
        story.append(Paragraph(f"&bull; {item}", add_bullet_style))
    story.append(Spacer(1, 2))
    
    # Education
    add_section_divider("EDUCATION")
    story.append(Paragraph("<b>American River College</b> &ndash; A.S. Computer Programming, C++ Concentration | May 2023", body_style))
    story.append(Paragraph("<b>Vatterott College</b> &ndash; A.A.S. Computer Information Systems | May 1997", body_style))
    story.append(Spacer(1, 2))
    
    # Leadership
    add_section_divider("LEADERSHIP & COMMUNICATION")
    story.append(Paragraph("&bull; Board Member of NIA (Network of Intel African American) ERG, providing strategic guidance to support professional development and community engagement.", add_bullet_style))
    story.append(Paragraph("&bull; Proven ability to present data-driven insights to cross-functional teams and senior leadership.", add_bullet_style))
    story.append(Paragraph("&bull; Effective coach and mentor, enhancing team performance through process training and knowledge sharing.", add_bullet_style))
    
    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    # PDF 1: Business Analyst
    ba_roles = "Business Analyst | Program Analyst | Operations Analyst | Administrative & Operations Support"
    ba_summary = [
        "Versatile business and operations professional with experience spanning business analysis, program support, data validation, reporting, quality assurance, customer service, and process improvement. Skilled in translating business requirements into actionable solutions, documenting procedures, coordinating with stakeholders, supporting operational workflows, and improving process accuracy.",
        "Background includes healthcare reporting, enterprise software testing, business systems analysis, customer support, compliance-focused operations, and administrative coordination. Known for strong attention to detail, analytical thinking, problem solving, and the ability to quickly learn new systems and processes."
    ]
    ba_skills = [
        "Business Analysis & Requirements Gathering", "Requirements Analysis", "Business Process Improvement",
        "Program Support", "Administrative & Operations Support", "Process Documentation",
        "Stakeholder Engagement", "Cross-Functional Collaboration", "UAT Coordination",
        "Project Coordination", "Workflow Tracking", "Data Entry & Records Management",
        "Compliance & Confidential Information Handling", "Customer Service & Public Interaction", "Microsoft Excel"
    ]
    create_resume_pdf("Thisha_Smith_Business_Analyst.pdf", ba_roles, ba_summary, ba_skills)

    # PDF 2: Data & Reporting
    data_roles = "Data Analyst | Reporting Specialist | Business Data Analyst | Healthcare Reporting Analyst | Power BI Analyst"
    data_summary = [
        "Versatile data and reporting professional with experience spanning healthcare reporting, business data analysis, data validation, dashboard reporting, SQL, Excel automation, quality review, and process improvement. Skilled in transforming complex data into accurate, actionable reporting outputs that support business decisions, compliance requirements, operational tracking, and stakeholder visibility.",
        "Background includes Cal AIM reporting, enterprise data governance, Power BI dashboard development, SQL reporting pipelines, secure file handling, data reconciliation, and cross-functional reporting support. Known for strong analytical thinking, accuracy, documentation, and the ability to identify discrepancies and improve reporting quality."
    ]
    data_skills = [
        "Data Analysis & Reporting", "Healthcare Reporting", "Data Validation", "Data Quality Review",
        "Power BI & Dashboard Reporting", "SQL, Data Querying & Optimization", "Microsoft Excel Advanced Formulas",
        "Reporting Automation", "Data Governance", "KPI Reporting", "Records Management",
        "Compliance Reporting Support", "Secure File Handling / SFTP", "Process Metrics",
        "Cross-Functional Reporting", "Documentation"
    ]
    create_resume_pdf("Thisha_Smith_Data_Reporting_Analyst.pdf", data_roles, data_summary, data_skills)

    # PDF 3: Quality Assurance & Testing
    qa_roles = "QA Analyst | QA Lead | Test Analyst | Quality Assurance Specialist | UAT Specialist | Validation Engineer"
    qa_summary = [
        "Versatile quality assurance and testing professional with experience spanning software QA, validation, test planning, defect management, UAT coordination, release readiness, automation support, data validation, and enterprise system testing. Skilled in designing and executing test strategies, documenting defects, validating requirements, supporting production readiness, and improving software quality across regulated and enterprise environments.",
        "Background includes QA leadership, graphics validation, .NET enterprise application testing, CRM enhancements, business systems analysis, healthcare data validation, and cross-functional delivery support. Known for strong analytical thinking, defect investigation, process discipline, documentation, and collaboration with business and technical teams."
    ]
    qa_skills = [
        "Quality Assurance & Testing", "Test Planning", "Test Execution", "UAT Coordination",
        "Defect Management", "Regression Testing", "Functional Testing", "Requirements Validation",
        "Release Readiness", "Root Cause Analysis", "Process Validation", "Test Documentation",
        "Automation Support", "Python-Based Test Automation", "CI/CD Validation Support", "Business Analysis"
    ]
    create_resume_pdf("Thisha_Smith_QA_Test_Analyst.pdf", qa_roles, qa_summary, qa_skills)

    # General / main resumes (using the primary Business Analyst configuration)
    create_resume_pdf("Thisha_Smith_Resume_2026.pdf", ba_roles, ba_summary, ba_skills)
    create_resume_pdf("ThishaSmith_Jan29.pdf", ba_roles, ba_summary, ba_skills)
