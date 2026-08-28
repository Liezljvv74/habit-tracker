# CLAUDE.md

## Project Overview
This project is a simple habit-tracker web app. It runs entirely in the browser and does not require a backend, database, framework, package manager, or build process.

## Stack

- **HTML5** for the application structure.
- **CSS3** for styling and layout.
- **Vanilla JavaScript** for application logic and interactions.
- `localStorage` for persistent habit and tracking data.
- **No framework** such as React, Vue, Angular, or Svelte.
- **No build step** and no bundler.

## How to Run
Because there is no build step, the app can be run directly from the project folder.

Open `index.html` in a modern web browser.

For development, it is also acceptable to serve the folder with a simple local HTTP server, for example:

```
python -m http.server
```
Then open the address shown by the server in a browser.

## Conventions

1. **Keep the project simple.**
Use plain HTML, CSS, and JavaScript files. Application functionality should be understandable by inspecting the source folder without needing a framework or build system.
2. **Persist user data in **`localStorage`**.**
Habits and their tracking information must survive a page refresh. Data should be stored in a clearly named `localStorage` key and serialized as JSON where appropriate.
3. **Keep structure, styling, and behavior separate.**
HTML should define the page structure, CSS should control presentation, and JavaScript should handle application behavior and data management.
4. **The app must work without an internet connection.**
Do not make core functionality dependent on external APIs, remote JavaScript libraries, CDNs, or online services.
5. **Use semantic and accessible HTML.**
Interactive elements should use appropriate HTML elements such as `<button>`, `<label>`, and form controls rather than clickable `<div>` elements.

## Prohibitions

- **Do not introduce a JavaScript framework or frontend build tool.**
- Do not add a backend or external database.
- Do not replace `localStorage` with a server-side persistence mechanism.
- Do not add unnecessary dependencies or package-management requirements.
- Do not make the app's core functionality dependent on an external network connection.

## Expected Project Structure
A simple structure is preferred:

```
/
├── index.html
├── style.css
├── script.js
└── CLAUDE.md
```
Additional files may be added when they serve a clear purpose, but the project should remain lightweight and easy to understand.
