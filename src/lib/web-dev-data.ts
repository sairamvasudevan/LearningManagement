export type WebDevLesson = {
  id: string;
  number: number;
  title: string;
  phase: "HTML5 Foundations" | "Modern CSS3" | "JavaScript & DOM" | "Frontend & Full MERN";
  phaseNumber: number;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objective: string;
  conceptGuide: string;
  exerciseBrief: string;
  requirements: {
    id: string;
    description: string;
    testCode: string; // JavaScript snippet evaluated against the iframe document returning boolean
  }[];
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  solutionHtml: string;
  solutionCss: string;
  solutionJs: string;
};

export const WEB_DEV_LESSONS: WebDevLesson[] = [
  {
    id: "html-semantic-structure",
    number: 1,
    title: "Semantic HTML5 Page Structure",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Structure a modern webpage using semantic HTML5 landmark tags instead of non-descriptive div soup.",
    conceptGuide: `### Why Semantic HTML Matters
Before HTML5, web developers built pages using generic \`<div>\` containers with IDs like \`<div id="header">\` or \`<div class="footer">\`. 

Semantic HTML introduces tags that describe their meaning to both the browser, screen readers, and search engine crawlers:
- \`<header>\`: Container for introductory content or navigational links.
- \`<nav>\`: Dedicated section of major navigation links.
- \`<main>\`: The dominant, unique content of the \`<body>\` (only one per page).
- \`<section>\`: A standalone thematic grouping of content.
- \`<article>\`: Self-contained, independently distributable content (e.g., blog post, news story).
- \`<aside>\`: Content tangentially related to the content around it (e.g., sidebar, callouts).
- \`<footer>\`: Authorship, copyright, contact info, or sitemap links.

\`\`\`html
<header>
  <h1>TechLaunch Academy</h1>
  <nav>
    <a href="#about">About</a>
    <a href="#courses">Courses</a>
  </nav>
</header>
<main>
  <article>
    <h2>Understanding Modern Web Dev</h2>
    <p>Semantic tags make web apps accessible...</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 TechLaunch. All rights reserved.</p>
</footer>
\`\`\`
`,
    exerciseBrief: `Build a clean, semantic personal portfolio structure. Replace any placeholders with proper semantic tags and verify that your document contains a header, a navigation bar with at least 3 links, a main container with at least one article and an aside, and a footer.`,
    requirements: [
      {
        id: "req-1",
        description: "Contains a semantic <header> tag with an <h1> heading.",
        testCode: "Boolean(document.querySelector('header h1'))",
      },
      {
        id: "req-2",
        description: "Contains a <nav> tag with at least 3 anchor <a> links.",
        testCode: "document.querySelectorAll('nav a').length >= 3",
      },
      {
        id: "req-3",
        description: "Contains a single <main> element with an <article> and an <aside> inside.",
        testCode: "Boolean(document.querySelector('main article') && document.querySelector('main aside'))",
      },
      {
        id: "req-4",
        description: "Contains a semantic <footer> element with copyright or contact text.",
        testCode: "Boolean(document.querySelector('footer') && document.querySelector('footer').textContent.trim().length > 5)",
      },
    ],
    starterHtml: `<!-- Exercise 1: Semantic HTML5 Architecture -->
<!-- TODO: Add <header> with <h1> and a <nav> with 3 links -->
<div class="top-area">
  <h1>Alex Rivera · Full Stack Developer</h1>
  <div>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </div>
</div>

<!-- TODO: Wrap primary content in <main>, and use <article> and <aside> -->
<div class="content-body">
  <div class="main-post">
    <h2>Featured Project: Nexus LMS</h2>
    <p>An enterprise learning management system built with Next.js, SQLite, and live compiler sandboxes.</p>
  </div>
  <div class="sidebar">
    <h3>Core Tech Stack</h3>
    <p>React, Node.js, Express, MongoDB, TypeScript.</p>
  </div>
</div>

<!-- TODO: Use semantic <footer> tag -->
<div class="bottom-area">
  <p>&copy; 2026 Alex Rivera. Built with Semantic HTML5.</p>
</div>
`,
    starterCss: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  color: #1e293b;
  background: #f8fafc;
}
header, .top-area {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
nav a {
  margin-right: 16px;
  color: #ff6a00;
  text-decoration: none;
  font-weight: 600;
}
article, .main-post {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}
aside, .sidebar {
  background: #fff7ed;
  border-left: 4px solid #ff6a00;
  padding: 14px;
  border-radius: 4px;
  margin-bottom: 24px;
}
footer, .bottom-area {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  color: #64748b;
  font-size: 13px;
}
`,
    starterJs: `// Semantic HTML is declarative; no JavaScript required for this lesson!
console.log("HTML5 Semantic Inspector ready.");
`,
    solutionHtml: `<header>
  <h1>Alex Rivera · Full Stack Developer</h1>
  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <article>
    <h2>Featured Project: Nexus LMS</h2>
    <p>An enterprise learning management system built with Next.js, SQLite, and live compiler sandboxes.</p>
  </article>
  <aside>
    <h3>Core Tech Stack</h3>
    <p>React, Node.js, Express, MongoDB, TypeScript.</p>
  </aside>
</main>

<footer>
  <p>&copy; 2026 Alex Rivera. Built with Semantic HTML5.</p>
</footer>
`,
    solutionCss: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  color: #1e293b;
  background: #f8fafc;
}
header {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
nav a {
  margin-right: 16px;
  color: #ff6a00;
  text-decoration: none;
  font-weight: 600;
}
article {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}
aside {
  background: #fff7ed;
  border-left: 4px solid #ff6a00;
  padding: 14px;
  border-radius: 4px;
  margin-bottom: 24px;
}
footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  color: #64748b;
  font-size: 13px;
}
`,
    solutionJs: `console.log("Solution loaded: Semantic landmarks successfully rendered.");`,
  },
  {
    id: "html-accessible-forms",
    number: 2,
    title: "Interactive Forms & Native Validation",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 25,
    difficulty: "Beginner",
    objective: "Construct accessible web forms using explicit labels, input types, and HTML5 client-side validation attributes.",
    conceptGuide: `### Modern HTML5 Forms & Form Controls
HTML forms are the primary way users send data to backend servers.
- **Labels & For Linking:** Always pair \`<label for="fieldId">\` with \`<input id="fieldId">\` so assistive devices know what the input represents and clicking the label focuses the input.
- **Native Types:** Use \`type="email"\`, \`type="password"\`, \`type="number"\`, \`type="date"\` for automatic browser mobile keyboards and validation.
- **Validation Constraints:**
  - \`required\`: Field cannot be empty on submission.
  - \`minlength\` / \`maxlength\`: Character length bounds.
  - \`pattern\`: Regular expression matching.

\`\`\`html
<form id="signup-form">
  <label for="user-email">Email Address</label>
  <input type="email" id="user-email" name="email" required placeholder="you@company.com">
  <button type="submit">Register Account</button>
</form>
\`\`\`
`,
    exerciseBrief: `Build a student enrollment form. The form must contain an email input, password input (with minimum length 8), a dropdown select for track, a terms checkbox, and a submit button.`,
    requirements: [
      {
        id: "req-1",
        description: "Form contains an <input type='email'> with id and matching <label for='...'>.",
        testCode: "Boolean(document.querySelector('form input[type=\"email\"][id]') && document.querySelector('form label[for]'))",
      },
      {
        id: "req-2",
        description: "Password input specifies type='password' and minlength='8' with required attribute.",
        testCode: "Boolean(document.querySelector('form input[type=\"password\"][required]') && Number(document.querySelector('form input[type=\"password\"]').getAttribute('minlength')) >= 8)",
      },
      {
        id: "req-3",
        description: "Contains a <select> element with at least 3 course options.",
        testCode: "document.querySelectorAll('form select option').length >= 3",
      },
      {
        id: "req-4",
        description: "Contains a checkbox for terms agreement and a <button type='submit'>.",
        testCode: "Boolean(document.querySelector('form input[type=\"checkbox\"][required]') && document.querySelector('form button[type=\"submit\"]'))",
      },
    ],
    starterHtml: `<div class="form-card">
  <h2>Student Course Registration</h2>
  <form id="enrollment-form">
    <!-- TODO: Add Label and Email input with required -->

    <!-- TODO: Add Label and Password input with minlength="8" required -->

    <!-- TODO: Add Select dropdown for tracks (e.g., MERN, DSA, System Design) -->

    <!-- TODO: Add Terms Checkbox and Submit Button -->
  </form>
</div>
`,
    starterCss: `.form-card {
  max-width: 450px;
  margin: 30px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  font-family: system-ui, sans-serif;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #334155;
}
input[type="email"],
input[type="password"],
select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #ff6a00;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
`,
    starterJs: `document.getElementById("enrollment-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Form passed native validation!");
});
`,
    solutionHtml: `<div class="form-card">
  <h2>Student Course Registration</h2>
  <form id="enrollment-form">
    <div class="form-group">
      <label for="student-email">Email Address</label>
      <input type="email" id="student-email" name="email" required placeholder="student@campus.edu">
    </div>

    <div class="form-group">
      <label for="student-password">Security Password</label>
      <input type="password" id="student-password" name="password" minlength="8" required placeholder="Minimum 8 characters">
    </div>

    <div class="form-group">
      <label for="course-track">Select Learning Track</label>
      <select id="course-track" name="track" required>
        <option value="">-- Choose a Track --</option>
        <option value="mern">Full Stack MERN Architecture</option>
        <option value="dsa">DSA & Problem Solving</option>
        <option value="systems">Distributed Systems</option>
      </select>
    </div>

    <div class="checkbox-row">
      <input type="checkbox" id="agree-terms" required>
      <label for="agree-terms">I agree to the code of conduct & scholarship terms</label>
    </div>

    <button type="submit">Complete Enrollment →</button>
  </form>
</div>
`,
    solutionCss: `.form-card {
  max-width: 450px;
  margin: 30px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  font-family: system-ui, sans-serif;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
  color: #334155;
}
input[type="email"],
input[type="password"],
select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #ff6a00;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
`,
    solutionJs: `document.getElementById("enrollment-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Validation Passed! Student account initialized.");
});
`,
  },
  {
    id: "css-flexbox-mastery",
    number: 3,
    title: "Modern Flexbox Layouts",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 30,
    difficulty: "Beginner",
    objective: "Master CSS Flexbox to align, space, and distribute responsive UI components along main and cross axes.",
    conceptGuide: `### Flexbox Fundamentals
Flexbox is a one-dimensional layout model designed to distribute space along a main axis (row or column) and cross axis.

- \`display: flex\`: Turns the container into a flex container.
- \`justify-content\`: Aligns items along the **Main Axis** (e.g. \`flex-start\`, \`center\`, \`space-between\`, \`space-around\`).
- \`align-items\`: Aligns items along the **Cross Axis** (e.g. \`stretch\`, \`center\`, \`flex-start\`, \`baseline\`).
- \`gap\`: Modern CSS property that adds clean spacing between flex children without margin hacks.
- \`flex: 1\`: Allows a child to expand and occupy remaining available space.

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
}
\`\`\`
`,
    exerciseBrief: `Convert the broken unstyled navigation bar and product pricing card into a pixel-perfect Flexbox layout. Use justify-content, align-items, and gap.`,
    requirements: [
      {
        id: "req-1",
        description: ".navbar has display: flex with justify-content: space-between and align-items: center.",
        testCode: "(() => { const s = getComputedStyle(document.querySelector('.navbar')); return s.display === 'flex' && s.justifyContent === 'space-between' && s.alignItems === 'center'; })()",
      },
      {
        id: "req-2",
        description: ".nav-links has display: flex with a gap of at least 12px.",
        testCode: "(() => { const s = getComputedStyle(document.querySelector('.nav-links')); return s.display === 'flex' && parseFloat(s.gap) >= 12; })()",
      },
      {
        id: "req-3",
        description: ".card-container uses flexbox to display 3 cards in a row with gap.",
        testCode: "(() => { const s = getComputedStyle(document.querySelector('.card-container')); return s.display === 'flex' && parseFloat(s.gap) >= 12; })()",
      },
    ],
    starterHtml: `<header class="navbar">
  <div class="logo">⚡ DevStack</div>
  <nav class="nav-links">
    <a href="#features">Features</a>
    <a href="#courses">Courses</a>
    <a href="#docs">Documentation</a>
  </nav>
  <button class="cta-button">Sign In</button>
</header>

<main>
  <h2>Flexible Pricing Tiers</h2>
  <div class="card-container">
    <div class="card">
      <h3>Starter</h3>
      <div class="price">Free</div>
      <p>Community sandbox access and core problem sets.</p>
    </div>
    <div class="card featured">
      <h3>Pro MERN</h3>
      <div class="price">Scholarship</div>
      <p>Interactive compiler, live feedback & 1-on-1 reviews.</p>
    </div>
    <div class="card">
      <h3>Enterprise</h3>
      <div class="price">Custom</div>
      <p>Full team licensing, analytics dashboard & SSO.</p>
    </div>
  </div>
</main>
`,
    starterCss: `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  background: #f1f5f9;
}
/* TODO: Turn .navbar into a flex container */
.navbar {
  background: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}
.logo {
  font-weight: 800;
  font-size: 18px;
  color: #ff6a00;
}
/* TODO: Turn .nav-links into a flex container with gap */
.nav-links a {
  text-decoration: none;
  color: #334155;
  font-weight: 600;
}
.cta-button {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
}
main {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
}
/* TODO: Turn .card-container into a flex row */
.card-container {
}
.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  flex: 1;
}
.card.featured {
  border-color: #ff6a00;
  box-shadow: 0 8px 24px rgba(255,106,0,0.15);
}
.price {
  font-size: 24px;
  font-weight: 800;
  margin: 12px 0;
  color: #0f172a;
}
`,
    starterJs: `console.log("Flexbox lesson active. Inspect layout with CSS.");`,
    solutionHtml: `<header class="navbar">
  <div class="logo">⚡ DevStack</div>
  <nav class="nav-links">
    <a href="#features">Features</a>
    <a href="#courses">Courses</a>
    <a href="#docs">Documentation</a>
  </nav>
  <button class="cta-button">Sign In</button>
</header>

<main>
  <h2>Flexible Pricing Tiers</h2>
  <div class="card-container">
    <div class="card">
      <h3>Starter</h3>
      <div class="price">Free</div>
      <p>Community sandbox access and core problem sets.</p>
    </div>
    <div class="card featured">
      <h3>Pro MERN</h3>
      <div class="price">Scholarship</div>
      <p>Interactive compiler, live feedback & 1-on-1 reviews.</p>
    </div>
    <div class="card">
      <h3>Enterprise</h3>
      <div class="price">Custom</div>
      <p>Full team licensing, analytics dashboard & SSO.</p>
    </div>
  </div>
</main>
`,
    solutionCss: `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  background: #f1f5f9;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}
.logo {
  font-weight: 800;
  font-size: 18px;
  color: #ff6a00;
}
.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}
.nav-links a {
  text-decoration: none;
  color: #334155;
  font-weight: 600;
}
.cta-button {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
main {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
}
.card-container {
  display: flex;
  gap: 20px;
}
.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  flex: 1;
}
.card.featured {
  border-color: #ff6a00;
  box-shadow: 0 8px 24px rgba(255,106,0,0.15);
}
.price {
  font-size: 24px;
  font-weight: 800;
  margin: 12px 0;
  color: #0f172a;
}
`,
    solutionJs: `console.log("Flexbox solution loaded!");`,
  },
  {
    id: "js-dom-interactive-counter",
    number: 4,
    title: "JavaScript DOM Manipulation & Events",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 25,
    difficulty: "Beginner",
    objective: "Select DOM elements, attach click event listeners, mutate innerText, and maintain interactive UI state.",
    conceptGuide: `### The Document Object Model (DOM) & Events
JavaScript bridges static HTML/CSS into reactive user interfaces through the DOM.
- \`document.querySelector('#id')\` / \`document.getElementById('id')\`: Selects an element from the page.
- \`element.addEventListener('click', callback)\`: Listens for user interactions.
- \`element.textContent\` / \`element.innerText\`: Updates rendered text without HTML injection risks.
- \`element.classList.toggle('active')\`: Adds or removes CSS classes dynamically.

\`\`\`javascript
const btn = document.querySelector('#increment-btn');
const display = document.querySelector('#counter-val');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  display.textContent = count;
});
\`\`\`
`,
    exerciseBrief: `Build an interactive counter app. Connect the 'Increment (+)', 'Decrement (-)', and 'Reset (0)' buttons to mutate the counter display value. The counter should not go below 0.`,
    requirements: [
      {
        id: "req-1",
        description: "Clicking #increment-btn increases the counter value by 1.",
        testCode: "(() => { const d = document.querySelector('#counter-val'); const b = document.querySelector('#increment-btn'); const prev = Number(d.textContent); b.click(); return Number(d.textContent) === prev + 1; })()",
      },
      {
        id: "req-2",
        description: "Clicking #decrement-btn decreases the counter value by 1 (minimum 0).",
        testCode: "(() => { const d = document.querySelector('#counter-val'); const b = document.querySelector('#decrement-btn'); const prev = Number(d.textContent); b.click(); return Number(d.textContent) === Math.max(0, prev - 1); })()",
      },
      {
        id: "req-3",
        description: "Clicking #reset-btn resets the counter display back to 0.",
        testCode: "(() => { const d = document.querySelector('#counter-val'); const b = document.querySelector('#reset-btn'); b.click(); return Number(d.textContent) === 0; })()",
      },
    ],
    starterHtml: `<div class="counter-card">
  <h2>Interactive Reactivity Counter</h2>
  <div id="counter-val" class="counter-display">0</div>
  <div class="counter-actions">
    <button id="decrement-btn" class="btn btn-secondary">-</button>
    <button id="reset-btn" class="btn btn-outline">Reset</button>
    <button id="increment-btn" class="btn btn-primary">+</button>
  </div>
</div>
`,
    starterCss: `.counter-card {
  max-width: 380px;
  margin: 50px auto;
  text-align: center;
  padding: 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  font-family: system-ui, sans-serif;
}
.counter-display {
  font-size: 64px;
  font-weight: 900;
  color: #ff6a00;
  margin: 20px 0;
  font-family: monospace;
}
.counter-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn {
  padding: 12px 20px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
.btn-primary { background: #ff6a00; color: #fff; }
.btn-secondary { background: #e2e8f0; color: #1e293b; }
.btn-outline { background: transparent; border: 2px solid #cbd5e1; color: #64748b; font-size: 14px; }
`,
    starterJs: `// Exercise: Implement the counter logic
let count = 0;

// TODO: Select #counter-val, #increment-btn, #decrement-btn, and #reset-btn

// TODO: Attach event listeners to update the count variable and update innerText!
`,
    solutionHtml: `<div class="counter-card">
  <h2>Interactive Reactivity Counter</h2>
  <div id="counter-val" class="counter-display">0</div>
  <div class="counter-actions">
    <button id="decrement-btn" class="btn btn-secondary">-</button>
    <button id="reset-btn" class="btn btn-outline">Reset</button>
    <button id="increment-btn" class="btn btn-primary">+</button>
  </div>
</div>
`,
    solutionCss: `.counter-card {
  max-width: 380px;
  margin: 50px auto;
  text-align: center;
  padding: 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  font-family: system-ui, sans-serif;
}
.counter-display {
  font-size: 64px;
  font-weight: 900;
  color: #ff6a00;
  margin: 20px 0;
  font-family: monospace;
}
.counter-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn {
  padding: 12px 20px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
.btn-primary { background: #ff6a00; color: #fff; }
.btn-secondary { background: #e2e8f0; color: #1e293b; }
.btn-outline { background: transparent; border: 2px solid #cbd5e1; color: #64748b; font-size: 14px; }
`,
    solutionJs: `let count = 0;
const display = document.getElementById("counter-val");
const incBtn = document.getElementById("increment-btn");
const decBtn = document.getElementById("decrement-btn");
const resetBtn = document.getElementById("reset-btn");

incBtn.addEventListener("click", () => {
  count++;
  display.textContent = count;
});

decBtn.addEventListener("click", () => {
  if (count > 0) count--;
  display.textContent = count;
});

resetBtn.addEventListener("click", () => {
  count = 0;
  display.textContent = count;
});
`,
  },
  {
    id: "js-async-fetch-api",
    number: 5,
    title: "Asynchronous JavaScript & Fetch API",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 35,
    difficulty: "Intermediate",
    objective: "Fetch external REST API data with async/await, handle loading states, and dynamically render data cards into the DOM.",
    conceptGuide: `### Async/Await and REST API Integration
In modern web applications, the frontend consumes data from REST or GraphQL backends via HTTP.
- \`fetch(url)\`: Initiates an asynchronous network request returning a Promise.
- \`await response.json()\`: Deserializes JSON payloads.
- \`try...catch\`: Gracefully catches network disconnects or API errors.
- \`document.createElement('div')\` or \`.map(...).join('')\`: Dynamically injects records into the interface.

\`\`\`javascript
async function loadUserData() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error('API Error:', err);
  }
}
\`\`\`
`,
    exerciseBrief: `Build a live user directory widget. When the 'Load Developers' button is clicked, simulate or fetch user profile data and dynamically inject cards with name, role, and skills into the #users-container.`,
    requirements: [
      {
        id: "req-1",
        description: "Clicking #load-btn populates #users-container with at least 3 user cards.",
        testCode: "(() => { const b = document.querySelector('#load-btn'); b.click(); return document.querySelectorAll('#users-container .user-card').length >= 3; })()",
      },
      {
        id: "req-2",
        description: "Each .user-card displays the candidate's name and skill tag.",
        testCode: "(() => { const c = document.querySelector('#users-container .user-card'); return Boolean(c && c.querySelector('h3') && c.querySelector('.skill-pill')); })()",
      },
    ],
    starterHtml: `<div class="container">
  <div class="header-row">
    <h2>Engineering Talent Directory</h2>
    <button id="load-btn" class="btn">Load Developers ⚡</button>
  </div>
  <div id="users-container" class="cards-grid">
    <div class="empty-state">No profiles loaded yet. Click the button above to fetch candidates.</div>
  </div>
</div>
`,
    starterCss: `.container {
  max-width: 800px;
  margin: 30px auto;
  font-family: system-ui, sans-serif;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.btn {
  background: #ff6a00;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.user-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
}
.user-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #0f172a;
}
.user-card p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #64748b;
}
.skill-pill {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: #f8fafc;
  color: #94a3b8;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
}
`,
    starterJs: `const MOCK_DEVELOPERS = [
  { name: "Priya Sundaram", role: "Frontend Architect", skill: "React · TypeScript" },
  { name: "Rahul Verma", role: "Backend Systems Lead", skill: "Node.js · Redis" },
  { name: "Ananya Iyer", role: "Full Stack Engineer", skill: "MERN Stack · MongoDB" },
  { name: "Vikram Sen", role: "DevOps & Cloud Engineer", skill: "Docker · Kubernetes" }
];

// TODO: Attach event listener to #load-btn
// Render the developer cards into #users-container!
`,
    solutionHtml: `<div class="container">
  <div class="header-row">
    <h2>Engineering Talent Directory</h2>
    <button id="load-btn" class="btn">Load Developers ⚡</button>
  </div>
  <div id="users-container" class="cards-grid">
    <div class="empty-state">No profiles loaded yet. Click the button above to fetch candidates.</div>
  </div>
</div>
`,
    solutionCss: `.container {
  max-width: 800px;
  margin: 30px auto;
  font-family: system-ui, sans-serif;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.btn {
  background: #ff6a00;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.user-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
}
.user-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #0f172a;
}
.user-card p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #64748b;
}
.skill-pill {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: #f8fafc;
  color: #94a3b8;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
}
`,
    solutionJs: `const MOCK_DEVELOPERS = [
  { name: "Priya Sundaram", role: "Frontend Architect", skill: "React · TypeScript" },
  { name: "Rahul Verma", role: "Backend Systems Lead", skill: "Node.js · Redis" },
  { name: "Ananya Iyer", role: "Full Stack Engineer", skill: "MERN Stack · MongoDB" },
  { name: "Vikram Sen", role: "DevOps & Cloud Engineer", skill: "Docker · Kubernetes" }
];

document.getElementById("load-btn").addEventListener("click", () => {
  const container = document.getElementById("users-container");
  container.innerHTML = MOCK_DEVELOPERS.map(
    (dev) => \`
    <div class="user-card">
      <h3>\${dev.name}</h3>
      <p>\${dev.role}</p>
      <span class="skill-pill">\${dev.skill}</span>
    </div>
  \`
  ).join("");
});
`,
  },
  {
    id: "mern-stack-architecture-rest",
    number: 6,
    title: "Full MERN Architecture: Express API & MongoDB Client",
    phase: "Frontend & Full MERN",
    phaseNumber: 4,
    estimatedMinutes: 45,
    difficulty: "Advanced",
    objective: "Understand end-to-end MERN data flow: Express.js route handlers, MongoDB document schemas, and frontend API consumption.",
    conceptGuide: `### The Complete MERN Stack Pipeline
**MERN** represents:
1. **M**ongoDB: NoSQL document database storing JSON-like BSON records.
2. **E**xpress.js: Minimalist web framework for Node.js routing and middleware.
3. **R**eact: Component-based reactive user interface library.
4. **N**ode.js: V8 JavaScript runtime executing JavaScript on server backends.

The canonical flow of an HTTP transaction:
1. React component triggers a user event (e.g. \`onSubmit\`).
2. Frontend calls \`fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) })\`.
3. Express server receives request through body-parser middleware: \`app.use(express.json())\`.
4. Route controller invokes Mongoose model: \`await Task.create(req.body)\`.
5. MongoDB confirms document persistence and returns generated \`_id\`.
6. Express responds with \`res.status(201).json(newTask)\`.
7. React updates client state with newly created task without full-page reload!
`,
    exerciseBrief: `Build a working interactive prototype of the MERN client layer. The UI must simulate adding tasks with titles, sending them to an in-memory REST state store, and rendering the task list with active status badges.`,
    requirements: [
      {
        id: "req-1",
        description: "Typing a task into #task-input and clicking #create-task-btn adds a new item to #task-list.",
        testCode: "(() => { const inp = document.querySelector('#task-input'); const btn = document.querySelector('#create-task-btn'); inp.value = 'Learn MERN Architecture'; btn.click(); return document.querySelector('#task-list').textContent.includes('Learn MERN Architecture'); })()",
      },
      {
        id: "req-2",
        description: "Each task item includes an interactive status toggle button.",
        testCode: "document.querySelectorAll('#task-list .task-item button').length >= 1",
      },
    ],
    starterHtml: `<div class="mern-app">
  <div class="mern-header">
    <div class="mern-badge">MERN Stack · MongoDB + Express + React + Node</div>
    <h2>Project Task Manager Client</h2>
  </div>

  <div class="task-form">
    <input type="text" id="task-input" placeholder="e.g. Design MongoDB Schema for Orders" />
    <button id="create-task-btn">Create Document (POST) →</button>
  </div>

  <div class="task-status-bar">
    <span>API Status: <b style="color: #10b981;">Online (200 OK)</b></span>
    <span id="task-count">0 Documents in Collection</span>
  </div>

  <div id="task-list" class="task-list">
    <!-- Tasks dynamically rendered here -->
  </div>
</div>
`,
    starterCss: `.mern-app {
  max-width: 600px;
  margin: 30px auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  font-family: system-ui, sans-serif;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}
.mern-badge {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.mern-header h2 {
  margin: 0 0 16px;
  color: #0f172a;
}
.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.task-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}
.task-form button {
  background: #ff6a00;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.task-status-bar {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 16px;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
}
.task-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}
.btn-toggle {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
`,
    starterJs: `// MERN Client Simulator
let tasks = [];

// TODO: Handle #create-task-btn click
// Push to tasks array and re-render #task-list
`,
    solutionHtml: `<div class="mern-app">
  <div class="mern-header">
    <div class="mern-badge">MERN Stack · MongoDB + Express + React + Node</div>
    <h2>Project Task Manager Client</h2>
  </div>

  <div class="task-form">
    <input type="text" id="task-input" placeholder="e.g. Design MongoDB Schema for Orders" />
    <button id="create-task-btn">Create Document (POST) →</button>
  </div>

  <div class="task-status-bar">
    <span>API Status: <b style="color: #10b981;">Online (200 OK)</b></span>
    <span id="task-count">0 Documents in Collection</span>
  </div>

  <div id="task-list" class="task-list">
    <!-- Tasks dynamically rendered here -->
  </div>
</div>
`,
    solutionCss: `.mern-app {
  max-width: 600px;
  margin: 30px auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  font-family: system-ui, sans-serif;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}
.mern-badge {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.mern-header h2 {
  margin: 0 0 16px;
  color: #0f172a;
}
.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.task-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}
.task-form button {
  background: #ff6a00;
  color: #ffffff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.task-status-bar {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 16px;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
}
.task-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}
.btn-toggle {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
`,
    solutionJs: `let tasks = [];

function render() {
  const list = document.getElementById("task-list");
  const countSpan = document.getElementById("task-count");
  countSpan.textContent = \`\${tasks.length} Documents in Collection\`;

  list.innerHTML = tasks.map((t, i) => \`
    <div class="task-item \${t.completed ? "completed" : ""}">
      <span>\${t.title}</span>
      <button class="btn-toggle" onclick="toggleTask(\${i})">\${t.completed ? "Reopen" : "Done ✓"}</button>
    </div>
  \`).join("");
}

window.toggleTask = function(index) {
  tasks[index].completed = !tasks[index].completed;
  render();
};

document.getElementById("create-task-btn").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const title = input.value.trim();
  if (!title) return;
  tasks.push({ title, completed: false, id: Date.now() });
  input.value = "";
  render();
});
`,
  },
];

export function getWebDevLessonById(id: string): WebDevLesson | undefined {
  return WEB_DEV_LESSONS.find((lesson) => lesson.id === id);
}

export function getAllWebDevLessons(): WebDevLesson[] {
  return WEB_DEV_LESSONS;
}
