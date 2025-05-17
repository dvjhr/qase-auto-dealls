# QA Software Engineer HRIS Case Study
This repo contains the case study assignment of **Dealls Jobs - QA Software Engineer / SDET Challenge**

## Challenge 1: Automation Testing (Technical Skills)
### 1. Test Type
- **Exploratory Test**
  - *tba*
- **Functional Test**
  - *Ensuring all features work as expected*
- **Validation Test**
  - *tba*
- **UI Testing**
  - *Verifying visual elements, layout, responsiveness, and consistency of the mentoring feature flow*
- **Integration Test**
  - *Ensuring the mentoring feature integrates correctly*
### 2. Assumption
- Account (mentor/mentee) register feature is already exist and working
- Account (mentor/mentee) login feature is already exist and working
- Test will only cover "Mentoring" feature and flow
- Test will be conducted in [dev](https://job-portal-user-dev-skx7zw44dq-et.a.run.app) environment
- "Mentoring" backend already developed
### 3. High-level Test Scenario
```
Mentor Discovery
  │
  ├── Search by Keyword
  │   ├── Nama Mentor
  │   ├── Pengalaman
  │   ├── Nama Perusahaan
  │   ├── Topik Keahlian
  │   └── Pendidikan
  │
  ├── Filter by
  │   ├── Tab
  │   ├── Kategori
  │   └── Tingkatan
  │
  ├── Sort by
  │   └── Terbaru
  │
  ├── View Mentor Details
  │
Mentoring Session Booking (Login and Not Login)
  │
  ├── Data and Details
  │
View Mentoring Session Status (Login and Not Login)
  │
  └── Session Details
```

*More about test scenario and case [here](https://docs.google.com/spreadsheets/d/1HOM_2t4fW8yrT3bHC-Pq-wNTqHChrXVuUsHEsHIEPo4/edit?usp=sharing)* 

## Challenge 2: UI Automation - Web Scenarios
### Test Environment Specification:
- Windows 10 `22H2`
- Chromium `136.0.7103.25`
- Playwright (Javascript) `1.52.0`
- App Environment [site](https://job-portal-user-dev-skx7zw44dq-et.a.run.app)

### How to run the test:
**1. Install dependencies (skip if already)**
- Node.js [official site](https://nodejs.org/en/download)
- Playwright [official site](https://playwright.dev/docs/intro)

**2. Clone this repository**
```bash
git clone https://github.com/dvjhr/qase-auto-dealls.git
```
**3. Move to the project directory**

```bash
cd qase-auto-dealls
```
**4. Run the test**

```bash
npx playwright test
```
**5. See test report**

```bash
npx playwright show-report
```
## Challenge 3: Exploration & Bug

## Author: 
Dava Aditya Jauhar [LinkedIn](https://linkedin.com/in/dvjhr)
