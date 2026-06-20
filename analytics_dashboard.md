# Thisha.net Analytics Dashboard Notes

## Primary Goals

* Understand recruiter and visitor engagement.
* Track resume download behavior.
* Track portfolio and case study engagement.
* Track recommendation profile engagement.
* Track contact intent.
* Track mobile versus desktop behavior.
* Avoid public visitor counters.

## Key Metrics

| Metric                        | Why It Matters                         |
| ----------------------------- | -------------------------------------- |
| Active Users                  | Measures reach and interest            |
| Page Views                    | Shows which pages attract attention    |
| Resume Downloads              | Indicates recruiting/conversion intent |
| Contact Clicks                | Indicates outreach intent              |
| Recommendation Profile Clicks | Shows social-proof engagement          |
| Portfolio Case Study Clicks   | Shows project interest                 |
| Scroll Depth                  | Shows content engagement               |
| Device Type                   | Helps prioritize mobile/tablet fixes   |

## Current GA4 Events

List current implemented events:

* resume_download
* email_click
* phone_click
* linkedin_click
* github_click
* recommendations_click
* portfolio_case_study_click

## New GA4 Events

Add documentation for:

* recommendation_profile_click
* scroll_depth
* external_portfolio_exit

## Event Naming Rules

Document:

* lowercase event names
* snake_case
* descriptive parameters
* no personally sensitive data
* no public counters

## Review Cadence

Weekly review:

* top pages
* resume downloads
* contact clicks
* recommendations page views
* case study views
* traffic source
* device category

Monthly review:

* identify strongest portfolio pages
* identify weak pages
* update resume links if needed
* adjust portfolio positioning based on behavior

## Scroll Depth Tracking Limitations

Because Thisha.net uses a single-page template (`index.html`) with dynamic section loading and scrolling containers (sections like `#about`, `#resume`, `#portfolio` scroll within themselves rather than body-level scrolls on some viewport configurations), page-level scroll depth tracking is configured based on main window scroll events. This tracks overall vertical progression of the page but may not capture specific scroll depths within individual overlay sections if they prevent document-level scrolling.

# Resume Download Analytics

## Event Name
`resume_download`

## Event Parameters
* `resume_type` (for legacy/backwards compatibility)
* `resume_variant` (allowed values: `general`, `business_analyst`, `data_reporting`, `qa`)
* `file_name`
* `page_location`
* `link_url`

## Examples of Event Payloads

### General Resume
```json
{
  "event": "resume_download",
  "parameters": {
    "resume_type": "General",
    "resume_variant": "general",
    "file_name": "Thisha_Smith_Resume_2026.pdf",
    "page_location": "https://thisha.net/index.html",
    "link_url": "https://thisha.net/Thisha_Smith_Resume_2026.pdf"
  }
}
```

### Business Analyst Resume
```json
{
  "event": "resume_download",
  "parameters": {
    "resume_type": "Business Analyst",
    "resume_variant": "business_analyst",
    "file_name": "Thisha_Smith_Business_Analyst.pdf",
    "page_location": "https://thisha.net/index.html",
    "link_url": "https://thisha.net/Thisha_Smith_Business_Analyst.pdf"
  }
}
```

### Data Reporting Resume
```json
{
  "event": "resume_download",
  "parameters": {
    "resume_type": "Data Reporting",
    "resume_variant": "data_reporting",
    "file_name": "Thisha_Smith_Data_Reporting_Analyst.pdf",
    "page_location": "https://thisha.net/index.html",
    "link_url": "https://thisha.net/Thisha_Smith_Data_Reporting_Analyst.pdf"
  }
}
```

### QA Resume
```json
{
  "event": "resume_download",
  "parameters": {
    "resume_type": "QA",
    "resume_variant": "qa",
    "file_name": "Thisha_Smith_QA_Test_Analyst.pdf",
    "page_location": "https://thisha.net/index.html",
    "link_url": "https://thisha.net/Thisha_Smith_QA_Test_Analyst.pdf"
  }
}
```

## Example GA4 Custom Dimension Registration
To view this parameter in custom reports within the Google Analytics 4 console:
1. Navigate to **Admin** > **Custom Definitions** > **Custom Dimensions**.
2. Click **Create Custom Dimension**.
3. Configure the following values:
   * **Dimension name:** `Resume Variant`
   * **Scope:** `Event`
   * **Description:** `Specifies the variant of the resume that was downloaded (general, business_analyst, data_reporting, qa).`
   * **Event parameter:** `resume_variant`
4. Click **Save**.
