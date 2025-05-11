# QA Software Engineer HRIS Case Study
This repo contains the case study assignment of **Dealls Jobs - QA Software Engineer / SDET Challenge**

## Challenge 1: Automation Testing (Technical Skills)
1. Test Type
- Functional Testing
- UI Testing
- Integration Testing
2. Test Scope
- Account (mentor/mentee) register feature is already exist and working
- Account (mentor/mentee) login feature is already exist and working
- Test will cover only "Mentoring" feature and flow
- Test will be conducted in [dev](https://job-portal-user-dev-skx7zw44dq-et.a.run.app) environment
- "Mentoring" backend already developed
3. Possible High-level Test Scenario
```
Mentor Discovery
  │
  ├── Search by Keyword
  │   ├── Mentor Name
  │   ├── Pengalaman
  │   ├── Nama Perusahaan
  │   ├── Topik Keahlian
  │   └── Pendidikan
  │
  ├── Filter
  │   └── Kategori
  │
  ├── Sort
  │   └── Terbaru
  │
Mentoring Session Booking System (Login and Not Login)
  │
  ├── Data and Details Verification
  │
View Mentoring Session Status (Login and Not Login)
  │
  └── Session Details Verification
```

More about test scenario and case [here](https://docs.google.com/spreadsheets/d/1HOM_2t4fW8yrT3bHC-Pq-wNTqHChrXVuUsHEsHIEPo4/edit?usp=sharing) 

## Challenge 2: UI Automation - Web Scenarios (Cypress/Playwright)
### Test Environment Specification:
- Windows 10 `XX.xx`
- Firefox `XX.xx`
- Edge `XX.xx`
- Chromium `XX.xx`
- Playwright `XX.xx`
- Environment [site](https://job-portal-user-dev-skx7zw44dq-et.a.run.app)

### How to run the test:
1. Install dependencies (skip if already)
- Node.js [official site](https://nodejs.org/en/download)
- Playwright [official site](https://playwright.dev/docs/intro)
2. Clone this repository
```bash
git clone https://github.com/dvjhr/qase-auto-dealls.git
```
3. Move to the project directory
```bash
cd qase-auto-dealls
```
4. Run the test
```bash
npx playwright test
```
## Challenge 3: Exploration & Bug

## Author: 
Dava Aditya Jauhar [LinkedIn](https://linkedin.com/in/dvjhr)
