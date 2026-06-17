# Private Analytics + Event Tracking Notes

This document provides a summary of the implementation, events, locations, and setup of the private analytics support.

## ✅ Configuration Status
Google Analytics 4 is fully configured across the project using the active Measurement ID: `G-XYT28BGMF7`.

- **Files containing `G-XYT28BGMF7`:**
  - `index.html`
  - `linkedin-recommendations.html`
  - `healthcare-reporting-case-study.html`
  - `healthcare-validation-workbook.html`
  - `healthcare-reporting-dashboard.html`
  - `healthcare-executive-package.html`
  - `truebalance-planner-case-study.html`
  - `cold-day-case-study.html`
  - `ai-automation-case-study.html`

The final configuration comment `<!-- GA4 configured for Thisha.net -->` has been added directly above the GA4 tag snippet in each of these files.

---

## Events Implemented

### 1. `resume_download`
* **Trigger:** Click on any resume download button/link (`.pdf` or `download` links) on `index.html`.
* **Parameters:**
  * `resume_type` (e.g. `"Business Analyst"`, `"Data Reporting"`, `"QA"`, or `"General"`)
  * `file_name` (e.g. `"Thisha_Smith_Business_Analyst.pdf"`)
  * `page_location` (Current page URL)

### 2. `recommendations_view`
* **Trigger:** 
  1. Click on the "View More Recommendations" button linking to `linkedin-recommendations.html`.
  2. Page load of `linkedin-recommendations.html`.
* **Parameters:**
  * `page_location` (Current page URL)

### 3. `portfolio_case_study_click`
* **Trigger:** Click on a portfolio card link on `index.html` directing to a case study page.
* **Parameters:**
  * `case_study_name` (e.g. `"Healthcare Reporting"`, `"TrueBalance Planner"`, `"Project Continuum"`, or `"AI & Automation"`)
  * `destination_url` (Destination page URL)

### 4. `external_linkedin_click`
* **Trigger:** Click on any external LinkedIn profile link on the website, including:
  * Thisha Smith's LinkedIn profile links (header, footer, contact section)
  * Colleague profile links within the testimonials slider
  * Colleague profile links on `linkedin-recommendations.html`
* **Parameters:**
  * `profile_name` (Name of the individual, e.g. `"Lisa Brown"`, `"Jakub Kuchta"`, `"Thisha Smith"`)
  * `profile_url` (Destination LinkedIn URL)

### 5. `github_click`
* **Trigger:** Click on any external link pointing to Thisha's GitHub profile.
* **Parameters:**
  * `profile_url` (Destination GitHub URL)

### 6. `external_product_link`
* **Trigger:** Click on the live application link for "TrueBalance Planner" (`app-truebalance.netlify.app`).
* **Parameters:**
  * `product_name` (`"TrueBalance Planner"`)
  * `product_url` (Destination URL)

### 7. `case_study_view`
* **Trigger:** Page load of any portfolio case study page.
* **Parameters:**
  * `case_study_name` (e.g. `"Healthcare Reporting"`, `"Healthcare Validation Workbook"`, `"Healthcare Reporting Dashboard"`, `"Healthcare Executive Package"`, `"TrueBalance Planner"`, `"Project Continuum"`, or `"AI & Automation"`)
  * `page_location` (Current page URL)

### 8. `portfolio_interaction`
* **Trigger:** Click on any category filter in the Portfolio grid on `index.html` (e.g. `"All"`, `"Data & Reporting"`, `"QA & Testing"`, `"AI & Automation"`).
* **Parameters:**
  * `interaction_type` (`"filter"`)
  * `filter_group` (e.g. `"all"`, `"data"`, `"qa"`, `"automation"`)
  * `filter_name` (e.g. `"All"`, `"Data & Reporting"`)

### 9. `back_to_top_click`
* **Trigger:** Click on the floating "Back to Top" button on any page.
* **Parameters:**
  * `page_location` (Current page URL)

---

## Technical Details

- **Implementation Style:** Unobtrusive JavaScript.
- **Tracking Logic Location:** Centralized in `js/script.js` which is loaded on all public HTML pages.
- **Fail-Safe Mechanism:** The tracking helper functions inspect `typeof gtag === "function"` before calling it to prevent console errors if the script has not loaded or is blocked.
- **Privacy Assurance:** No public counters, visitor lists, or traffic stats are rendered on any user-facing page.

---

## Future Dashboard Recommendations
To get the most out of this analytics tracking data, set up custom dashboards in Google Analytics 4 to track:
1. **Resume Downloads:** Identify which career tracks are drawing the most interest.
2. **Case Study Views:** Determine which projects engage visitors the longest.
3. **Recommendations Page Visits:** Track click-through rates from the home page testimonials.
4. **External LinkedIn & GitHub Clicks:** Measure how often visitors proceed to your professional profiles.
5. **Mobile vs. Desktop Visitors:** Review layout performance and traffic breakdown to ensure optimal experience across devices.
