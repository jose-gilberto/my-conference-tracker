# 📅 My Conference Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A community-driven, open-source tracker for AI/ML conference deadlines. 
Built with the **Git-as-a-Database** philosophy, ensuring transparency, version control, and static performance.

🔗 **Live Demo:** [https://jose-gilberto.github.io/my-conference-tracker](https://jose-gilberto.github.io/my-conference-tracker)

---

## 🏗 Architecture & Data Flow

This project separates data storage from the frontend presentation using a static build pipeline.

```mermaid
graph LR
    A[Google Forms / Community] -->|Input| B(Google Sheets)
    B -->|Harvester Script| C{Git Repository}
    C -->|YAML Files| D[data/conferences/*.yaml]
    D -->|Build Script| E[public/conferences.json]
    E -->|Read Time| F[Next.js Frontend]
    F -->|Deploy| G[GitHub Pages]