# Positivus

A modern, fully responsive digital agency landing page built with semantic HTML5, SCSS (Sass), and strict adherence to the BEM methodology. Features pixel-perfect implementation of contemporary layouts.

[🔥 Live Demo](https://realsabyrka-alt.github.io/positivus/)

## 🛠 Tech Stack

* **HTML5:** Pure semantic markup (`<header>`, `<main>`, `<section>`, `<footer>`) ensuring excellent accessibility, SEO foundation, and valid document structure.
* **SCSS (Sass):** Advanced preprocessor architecture using modular imports, mixins, and nested rules for highly maintainable styles.
* **BEM Methodology:** Strict Block-Element-Modifier naming convention preventing style leakage and ensuring component reusability.
* **Layout Engine:** Heavy utilization of **CSS Grid** for complex grid systems (like services or case studies) and **Flexbox** for aligned components.
* **UX Details:** 
  * Adaptive SVG favicons that dynamically switch based on the user's system theme (`prefers-color-scheme`).
  * Global accessibility styles including custom `:focus-visible` outlines and interactive text `::selection`.

## 📂 Project Structure

* `index.html` — main entry point with semantic markup.
* `assets/` — static resources:
  * `fonts/` — locally hosted web fonts.
  * `images/` — optimized content images, logos, and vector graphics.
* `styles/` — scalable modular SCSS architecture:
  * `main.scss` — main entry point that compiles into production CSS.
  * `main.min.css` — production-ready, minified stylesheet.
  * `base/` — resets, typography settings, CSS custom properties, and core configurations.
  * `helpers/` — global mixins, utilities, and Sass functions.
  * `components/` — reusable UI elements (buttons, interactive states, cards).
  * `sections/` — independent styles for distinct landing page sections.

## ⚙️ Key Features & Layout Sections

* **Complete Component Lifecycle:** Full-cycle development tracking clean implementation section by section:
  * `Header & Hero` — clear navigation bar and primary call-to-action area.
  * `Services` — grid-based service cards showcasing agency capabilities.
  * `Studies` — specialized case studies layout.
  * `Process` — step-by-step working methodology accordion or list block.
  * `Team` — grid of team members with social links.
  * `Reviews` — testimonial section highlighting social proof.
  * `Contact Us` — interactive feedback/leads capture form.
  * `Footer` — comprehensive navigation and copyright area.
* **Global Active States:** Meticulously configured hover, active, and focus states for all interactive elements to ensure an engaging user experience.
* **Atomic Git Discipline:** Developed using strict, semantic commit history (Conventional Commits) with clear isolated feature branches and verified merges.
