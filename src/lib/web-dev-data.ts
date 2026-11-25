export type WebDevTrack = "HTML" | "CSS" | "JavaScript" | "React" | "MERN Stack";

export type WebDevLesson = {
  id: string;
  number: number;
  title: string;
  track: WebDevTrack;
  phase: "HTML5 Foundations" | "Modern CSS3" | "JavaScript & DOM" | "Frontend & Full MERN";
  phaseNumber: number;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objective: string;
  conceptGuide: string;
  tryItExample: {
    title: string;
    description: string;
    html: string;
    css: string;
    js: string;
  };
  quizExercise?: {
    question: string;
    snippet?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  exerciseBrief: string;
  hints: string[];
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
  // ==========================================
  // TRACK 1: HTML5 FOUNDATIONS (Lessons 1-10)
  // ==========================================
  {
    id: "html-intro",
    number: 1,
    title: "HTML5 Document Structure & Boilerplate",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 15,
    difficulty: "Beginner",
    objective: "Master the fundamental skeleton of every web document: DOCTYPE, html, head, title, and body tags.",
    conceptGuide: `### What is HTML?
HTML stands for **HyperText Markup Language**. It is the standard markup language for creating Web pages. It describes the structure of a Web page using markup tags.

### The Essential HTML5 Document Skeleton
Every valid HTML5 document starts with a \`<!DOCTYPE html>\` declaration that instructs modern browsers to render in standard mode.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Welcome to Web Development!</h1>
    <p>This is my first live HTML document.</p>
  </body>
</html>
\`\`\`

- \`<!DOCTYPE html>\`: Defines that this document is an HTML5 document.
- \`<html lang="en">\`: The root element of an HTML page.
- \`<head>\`: Contains meta information about the HTML page (not directly displayed in the viewport).
- \`<title>\`: Specifies a title for the page (shown in browser's title bar/tab).
- \`<body>\`: Defines the document's body, and is a container for all visible contents.`,
    tryItExample: {
      title: "W3Schools Try-It: Basic HTML Skeleton",
      description: "Experiment with changing the heading text and page title below.",
      html: `<h1>Hello World!</h1>\n<p>Welcome to interactive web programming.</p>\n<button onclick="alert('Hello from HTML5!')">Click Me</button>`,
      css: `body { font-family: sans-serif; padding: 20px; }\nh1 { color: #0284c7; }\nbutton { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }`,
      js: `console.log("Interactive Sandbox loaded successfully!");`,
    },
    quizExercise: {
      question: "Which tag contains all the visible content displayed to the user in a browser window?",
      options: ["<head>", "<title>", "<body>", "<meta>"],
      correctIndex: 2,
      explanation: "The <body> element holds all visible elements such as headings, paragraphs, images, tables, and buttons.",
    },
    exerciseBrief: `Create the essential page structure. Add a primary <h1> heading with the text "Developer Profile", followed by a paragraph <p> introducing yourself as a student engineer.`,
    hints: [
      "Use <h1>Developer Profile</h1> for the top heading.",
      "Add a <p> tag directly beneath it with at least 15 characters of intro text.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains an <h1> tag with text content including 'Developer Profile'.",
        testCode: "Boolean(document.querySelector('h1') && document.querySelector('h1').textContent.toLowerCase().includes('developer profile'))",
      },
      {
        id: "req-2",
        description: "Contains a paragraph <p> element with at least 15 characters describing your profile.",
        testCode: "Boolean(document.querySelector('p') && document.querySelector('p').textContent.trim().length >= 15)",
      },
    ],
    starterHtml: `<!-- Chapter 1: HTML5 Skeleton -->\n<!-- TODO: Add <h1>Developer Profile</h1> and a descriptive <p> tag -->\n`,
    starterCss: `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background: #f8fafc;\n  color: #1e293b;\n}\nh1 {\n  color: #0f172a;\n}\np {\n  color: #475569;\n  line-height: 1.6;\n}`,
    starterJs: `console.log("Chapter 1: Initialized");`,
    solutionHtml: `<h1>Developer Profile</h1>\n<p>Hello! I am a full-stack engineering student learning modern web development and algorithms.</p>`,
    solutionCss: `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background: #f8fafc;\n  color: #1e293b;\n}\nh1 {\n  color: #0f172a;\n}\np {\n  color: #475569;\n  line-height: 1.6;\n}`,
    solutionJs: `console.log("Chapter 1: Solved");`,
  },
  {
    id: "html-headings-text",
    number: 2,
    title: "Headings, Paragraphs & Text Formatting",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Structure text hierarchically with h1-h6 headings and format key terms with strong, em, mark, and small tags.",
    conceptGuide: `### Headings Hierarchy
HTML headings are defined with the \`<h1>\` to \`<h6>\` tags.
- \`<h1>\` is the most important heading (used once per page for the main topic).
- \`<h2>\` to \`<h6>\` are used for secondary and tertiary subsections.

### Formatting Elements
- \`<strong>\`: Important text (typically bolded, signals semantic significance to screen readers).
- \`<em>\`: Emphasized text (typically italicized).
- \`<mark>\`: Highlighted text.
- \`<small>\`: Smaller side notes or copyright info.

\`\`\`html
<h1>Engineering Fundamentals</h1>
<h2>Core Algorithms</h2>
<p>Understanding <strong>time complexity</strong> is <em>crucial</em> for scalable software.</p>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Headings & Formatting",
      description: "See how headings and inline formatting tags alter text appearance.",
      html: `<h1>Main Title (H1)</h1>\n<h2>Sub-Heading (H2)</h2>\n<p>This text has <strong>strong importance</strong> and <em>emphasis</em> with <mark>highlighting</mark>.</p>`,
      css: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which HTML tag should be used to indicate strong importance (not merely visual bold)?",
      options: ["<b>", "<bold>", "<strong>", "<em>"],
      correctIndex: 2,
      explanation: "<strong> provides semantic emphasis indicating high importance, whereas <b> is purely typographic styling.",
    },
    exerciseBrief: `Create an article section with an <h1> heading, an <h2> subheading, a paragraph with <strong> bolded keywords, and a <mark> highlighted note.`,
    hints: [
      "Include an <h1> tag and an <h2> tag.",
      "Inside your paragraph, wrap important words inside <strong>...</strong> and a note inside <mark>...</mark>.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains both an <h1> and an <h2> heading.",
        testCode: "Boolean(document.querySelector('h1') && document.querySelector('h2'))",
      },
      {
        id: "req-2",
        description: "Contains a <strong> element with text inside a paragraph.",
        testCode: "Boolean(document.querySelector('p strong') && document.querySelector('p strong').textContent.trim().length > 0)",
      },
      {
        id: "req-3",
        description: "Contains a <mark> highlighted text element.",
        testCode: "Boolean(document.querySelector('mark'))",
      },
    ],
    starterHtml: `<!-- Chapter 2: Headings and Formatting -->\n<!-- TODO: Add <h1>, <h2>, and a <p> containing <strong> and <mark> tags -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #334155; }`,
    starterJs: ``,
    solutionHtml: `<h1>Full Stack Web Development</h1>\n<h2>Mastering Frontend Architecture</h2>\n<p>Modern web engineering requires <strong>strong foundational knowledge</strong> of HTML5 semantics, and <mark>active daily practice</mark> builds lasting competence.</p>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; color: #334155; }`,
    solutionJs: ``,
  },
  {
    id: "html-links-bookmarks",
    number: 3,
    title: "Links, Anchors & External Navigation",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Build hyperlinks with target attributes, safe security rel='noopener', and in-page anchor jumps.",
    conceptGuide: `### The Anchor Tag <a>
Hyperlinks connect the web. The \`href\` attribute specifies the destination URL.

\`\`\`html
<!-- External Link -->
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>

<!-- Internal Hash Bookmark -->
<a href="#summary">Jump to Summary</a>
<div id="summary">...</div>
\`\`\`

- \`target="_blank"\`: Opens link in a new browser tab.
- \`rel="noopener noreferrer"\`: Crucial security practice when opening external links to avoid reverse tab-nabbing.
- \`href="#sectionId"\`: Smoothly jumps to an element with \`id="sectionId"\`.`,
    tryItExample: {
      title: "W3Schools Try-It: Anchor Links",
      description: "Click the link to test navigation behavior.",
      html: `<p>Visit our platform documentation:</p>\n<a href="https://example.com" target="_blank" rel="noopener">Explore Docs (Opens New Tab) →</a>`,
      css: `body { font-family: sans-serif; padding: 20px; }\na { color: #2563eb; font-weight: bold; text-decoration: none; }\na:hover { text-decoration: underline; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which attribute ensures an external link opens in a new tab?",
      options: ["new='window'", "target='_blank'", "rel='external'", "window='new'"],
      correctIndex: 1,
      explanation: "target='_blank' tells the browser to spawn a new browsing context/tab for the URL.",
    },
    exerciseBrief: `Build a navigation bar with at least 2 hyperlinks: one external link opening in a new tab with rel='noopener' and one bookmark link jumping to an element with id='contact'.`,
    hints: [
      "Use target='_blank' and rel='noopener' on the external link.",
      "Add href='#contact' and ensure there is an element with id='contact' in the document.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains an anchor <a> with target='_blank' and rel containing 'noopener'.",
        testCode: "Boolean(document.querySelector('a[target=\"_blank\"][rel*=\"noopener\"]'))",
      },
      {
        id: "req-2",
        description: "Contains an in-page bookmark link with href='#contact' pointing to an element with id='contact'.",
        testCode: "Boolean(document.querySelector('a[href=\"#contact\"]') && document.getElementById('contact'))",
      },
    ],
    starterHtml: `<!-- Chapter 3: Links & Anchors -->\n<nav>\n  <!-- TODO: Add external link with target='_blank' and rel='noopener' -->\n  <!-- TODO: Add jump link with href='#contact' -->\n</nav>\n\n<div style="margin-top: 300px;" id="contact">\n  <h3>Contact Section</h3>\n  <p>Reach us at engineering@nexus.edu</p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nnav { display: flex; gap: 16px; margin-bottom: 20px; }\na { color: #0284c7; font-weight: 600; text-decoration: none; }\na:hover { text-decoration: underline; }`,
    starterJs: ``,
    solutionHtml: `<nav>\n  <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs ↗</a>\n  <a href="#contact">Jump to Contact ↓</a>\n</nav>\n\n<div style="margin-top: 300px;" id="contact">\n  <h3>Contact Section</h3>\n  <p>Reach us at engineering@nexus.edu</p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nnav { display: flex; gap: 16px; margin-bottom: 20px; }\na { color: #0284c7; font-weight: 600; text-decoration: none; }\na:hover { text-decoration: underline; }`,
    solutionJs: ``,
  },
  {
    id: "html-images-media",
    number: 4,
    title: "Images, Responsive Media & Figures",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Implement accessible images with meaningful alt text, width/height dimensions, and figure/figcaption wrappers.",
    conceptGuide: `### The <img> Element
The \`<img>\` tag is empty (it contains attributes only, and has no closing tag).
- \`src\`: Path or URL to the image.
- \`alt\`: Alternative text (read by screen readers, displayed if image fails to load, required for accessibility).
- \`width\` / \`height\`: Reserve layout space to prevent layout shifts (CLS).

### The <figure> and <figcaption> Elements
The \`<figure>\` tag specifies self-contained content, like illustrations, diagrams, or photos. \`<figcaption>\` defines an optional caption for the figure.

\`\`\`html
<figure>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' rx='12' fill='%230f172a'/><rect x='24' y='24' width='352' height='212' rx='8' fill='%231e293b' stroke='%23334155'/><circle cx='44' cy='42' r='5' fill='%23ef4444'/><circle cx='60' cy='42' r='5' fill='%23f59e0b'/><circle cx='76' cy='42' r='5' fill='%2310b981'/><rect x='44' y='70' width='180' height='10' rx='4' fill='%2338bdf8'/><rect x='44' y='92' width='260' height='10' rx='4' fill='%2394a3b8'/><rect x='44' y='114' width='220' height='10' rx='4' fill='%23818cf8'/><rect x='44' y='136' width='140' height='10' rx='4' fill='%2334d399'/><text x='44' y='205' fill='%23cbd5e1' font-family='monospace' font-size='14'>Nexus Offline Workstation</text></svg>" alt="Laptop on wooden desk displaying source code" width="400" height="260">
  <figcaption>Figure 1.1: Modern software engineering workspace.</figcaption>
</figure>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Images & Captions",
      description: "Experiment with image dimensions and figure captions.",
      html: `<figure>\n  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='300' height='200' rx='10' fill='%230f172a'/><rect x='18' y='18' width='264' height='164' rx='6' fill='%231e293b' stroke='%2338bdf8'/><text x='150' y='105' text-anchor='middle' fill='%23f8fafc' font-family='sans-serif' font-size='16' font-weight='bold'>HTML5 Figure Lab</text></svg>" alt="Developer coding" width="300" height="200" style="border-radius: 8px;">\n  <figcaption style="font-size: 13px; color: #64748b; margin-top: 6px;">Developer building full-stack web applications.</figcaption>\n</figure>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: ``,
    },
    quizExercise: {
      question: "Why is the 'alt' attribute strictly required on <img> elements?",
      options: [
        "It speeds up image download bandwidth",
        "It provides textual accessibility for screen readers and search engines",
        "It defines the border width of the image",
        "It sets the image aspect ratio automatically",
      ],
      correctIndex: 1,
      explanation: "Alt text provides vital accessibility for visually impaired users using screen readers and displays if the image file fails to load.",
    },
    exerciseBrief: `Embed an image inside a <figure> tag with descriptive 'alt' text (at least 10 chars), width and height attributes, and a <figcaption> describing the image.`,
    hints: [
      "Wrap an <img> inside a <figure> element.",
      "Give the <img> an alt attribute like alt='Modern computer programming monitor' and width/height attributes.",
      "Add a <figcaption> directly beneath the image.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains a <figure> element enclosing an <img> and a <figcaption>.",
        testCode: "Boolean(document.querySelector('figure img') && document.querySelector('figure figcaption'))",
      },
      {
        id: "req-2",
        description: "The <img> tag has a descriptive 'alt' attribute with at least 10 characters.",
        testCode: "Boolean(document.querySelector('figure img') && (document.querySelector('figure img').getAttribute('alt') || '').trim().length >= 10)",
      },
      {
        id: "req-3",
        description: "The <figcaption> contains descriptive caption text.",
        testCode: "Boolean(document.querySelector('figure figcaption') && document.querySelector('figure figcaption').textContent.trim().length >= 8)",
      },
    ],
    starterHtml: `<!-- Chapter 4: Images & Figures -->\n<!-- TODO: Add <figure> with <img> and <figcaption> -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nfigure { margin: 0; padding: 12px; background: #f1f5f9; border-radius: 8px; display: inline-block; }\nimg { border-radius: 6px; max-width: 100%; height: auto; display: block; }\nfigcaption { margin-top: 8px; font-size: 13px; color: #475569; }`,
    starterJs: ``,
    solutionHtml: `<figure>\n  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' rx='12' fill='%230f172a'/><rect x='24' y='24' width='352' height='212' rx='8' fill='%231e293b' stroke='%2338bdf8'/><text x='200' y='135' text-anchor='middle' fill='%23f8fafc' font-family='sans-serif' font-size='18' font-weight='bold'>Workstation Setup</text></svg>" alt="Student workstation setup with code editor" width="400" height="260">\n  <figcaption>Figure 1: Full-stack developer workstation setup.</figcaption>\n</figure>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nfigure { margin: 0; padding: 12px; background: #f1f5f9; border-radius: 8px; display: inline-block; }\nimg { border-radius: 6px; max-width: 100%; height: auto; display: block; }\nfigcaption { margin-top: 8px; font-size: 13px; color: #475569; }`,
    solutionJs: ``,
  },
  {
    id: "html-lists",
    number: 5,
    title: "Ordered, Unordered & Nested Lists",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Construct bulleted lists (ul), sequential number lists (ol), and nested sublists for structured data presentation.",
    conceptGuide: `### Types of HTML Lists
- **Unordered List \`<ul>\`**: Bulleted items where sequence does not matter.
- **Ordered List \`<ol>\`**: Numbered items where sequence represents a step-by-step process.
- **List Item \`<li>\`**: Used inside \`<ul>\` or \`<ol>\`.

\`\`\`html
<!-- Nested List Example -->
<ol>
  <li>Frontend Basics
    <ul>
      <li>HTML5 Semantics</li>
      <li>CSS3 Flexbox</li>
    </ul>
  </li>
  <li>Backend Integration</li>
</ol>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Lists",
      description: "Experiment with adding items and nesting lists.",
      html: `<h3>MERN Stack Technologies</h3>\n<ul>\n  <li>MongoDB (NoSQL Database)</li>\n  <li>Express.js (Server Framework)</li>\n  <li>React.js (Frontend UI)</li>\n  <li>Node.js (JavaScript Runtime)</li>\n</ul>`,
      css: `body { font-family: sans-serif; padding: 20px; line-height: 1.8; }\nul { background: #f8fafc; padding: 20px 36px; border-radius: 8px; border: 1px solid #e2e8f0; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which HTML element is used to create a numbered sequential list?",
      options: ["<ul>", "<ol>", "<dl>", "<list>"],
      correctIndex: 1,
      explanation: "<ol> stands for 'Ordered List' and renders items sequentially with numbers by default.",
    },
    exerciseBrief: `Build a course syllabus outline using an ordered list <ol> with at least 3 major steps, and inside the first step, nest an unordered list <ul> with at least 2 sub-topics.`,
    hints: [
      "Create an <ol> containing at least 3 <li> elements.",
      "Inside the first <li>, nest a <ul> with at least 2 child <li> items.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains an ordered list <ol> with at least 3 top-level <li> items.",
        testCode: "document.querySelectorAll('ol > li').length >= 3",
      },
      {
        id: "req-2",
        description: "Contains an unordered list <ul> nested inside one of the list items with at least 2 sub-items.",
        testCode: "document.querySelectorAll('ol li ul li').length >= 2",
      },
    ],
    starterHtml: `<!-- Chapter 5: Lists -->\n<!-- TODO: Add <ol> with 3 items, nesting a <ul> with 2 sub-items inside item 1 -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.7; }\nol { background: #ffffff; padding: 20px 30px; border-radius: 8px; border: 1px solid #cbd5e1; }`,
    starterJs: ``,
    solutionHtml: `<ol>\n  <li>Foundations Track\n    <ul>\n      <li>HTML5 Semantics & Structure</li>\n      <li>CSS3 Flexbox Layouts</li>\n    </ul>\n  </li>\n  <li>JavaScript & DOM Manipulation</li>\n  <li>Full MERN Architecture & Deployment</li>\n</ol>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.7; }\nol { background: #ffffff; padding: 20px 30px; border-radius: 8px; border: 1px solid #cbd5e1; }`,
    solutionJs: ``,
  },
  {
    id: "html-tables",
    number: 6,
    title: "Data Tables & Structured Grids",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Format tabular data with semantic table, thead, tbody, tr, th, and td elements.",
    conceptGuide: `### The HTML Table Architecture
Tables should only be used for tabular data, not for general page layout.
- \`<table>\`: Container element.
- \`<thead>\`: Header section containing column titles.
- \`<tbody>\`: Body section containing data rows.
- \`<tr>\`: Table row.
- \`<th>\`: Table header cell (bold and centered by default, scoped with \`scope="col"\`).
- \`<td>\`: Standard data cell.

\`\`\`html
<table>
  <thead>
    <tr>
      <th scope="col">Language</th>
      <th scope="col">Paradigm</th>
      <th scope="col">Speed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>C++</td>
      <td>Compiled / Systems</td>
      <td>Ultra High</td>
    </tr>
  </tbody>
</table>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Tables",
      description: "Experiment with adding columns and rows in this styled table.",
      html: `<table>\n  <thead>\n    <tr>\n      <th>Course</th>\n      <th>Duration</th>\n      <th>Level</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML5 & CSS3</td>\n      <td>20 Hours</td>\n      <td>Beginner</td>\n    </tr>\n    <tr>\n      <td>Full MERN</td>\n      <td>40 Hours</td>\n      <td>Advanced</td>\n    </tr>\n  </tbody>\n</table>`,
      css: `body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { padding: 10px 14px; border: 1px solid #cbd5e1; text-align: left; }\nth { background: #0284c7; color: white; }\ntr:nth-child(even) { background: #f8fafc; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which semantic tag groups the header rows in an HTML table?",
      options: ["<header>", "<thead>", "<th>", "<table-head>"],
      correctIndex: 1,
      explanation: "<thead> defines the header group of rows and columns in a table.",
    },
    exerciseBrief: `Build a student grades or tech comparison table with <table>, <thead> with at least 3 <th> column headers, and <tbody> with at least 2 <tr> rows with corresponding <td> data cells.`,
    hints: [
      "Use <table> as the root.",
      "Add <thead><tr><th>Col 1</th><th>Col 2</th><th>Col 3</th></tr></thead>.",
      "Add <tbody> with at least two <tr> rows.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains a semantic <table> element with both <thead> and <tbody>.",
        testCode: "Boolean(document.querySelector('table thead') && document.querySelector('table tbody'))",
      },
      {
        id: "req-2",
        description: "The <thead> contains at least 3 <th> header cells.",
        testCode: "document.querySelectorAll('table thead th').length >= 3",
      },
      {
        id: "req-3",
        description: "The <tbody> contains at least 2 data rows (<tr>) with corresponding <td> cells.",
        testCode: "document.querySelectorAll('table tbody tr').length >= 2",
      },
    ],
    starterHtml: `<!-- Chapter 6: Tables -->\n<!-- TODO: Build a <table> with <thead> (3 th headers) and <tbody> (2 data rows) -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; font-size: 14px; }\nth, td { padding: 10px 14px; border: 1px solid #cbd5e1; text-align: left; }\nth { background: #1e293b; color: #ffffff; }\ntr:nth-child(even) { background: #f8fafc; }`,
    starterJs: ``,
    solutionHtml: `<table>\n  <thead>\n    <tr>\n      <th>Module Name</th>\n      <th>Hours</th>\n      <th>Status</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML5 Semantics</td>\n      <td>15 hrs</td>\n      <td>Completed</td>\n    </tr>\n    <tr>\n      <td>CSS3 Flexbox & Grid</td>\n      <td>20 hrs</td>\n      <td>In Progress</td>\n    </tr>\n  </tbody>\n</table>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\ntable { width: 100%; border-collapse: collapse; font-size: 14px; }\nth, td { padding: 10px 14px; border: 1px solid #cbd5e1; text-align: left; }\nth { background: #1e293b; color: #ffffff; }\ntr:nth-child(even) { background: #f8fafc; }`,
    solutionJs: ``,
  },
  {
    id: "html-block-inline",
    number: 7,
    title: "Block vs Inline Elements & Layout Containers",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Understand natural browser flow: block elements (div, p, h1) take full width; inline elements (span, a, strong) flow within text lines.",
    conceptGuide: `### Block-Level Elements
A block-level element always starts on a new line and takes up the full width available (stretches out to the left and right as far as it can).
Examples: \`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<section>\`, \`<form>\`.

### Inline Elements
An inline element does not start on a new line and only takes up as much width as necessary. It cannot have explicit top/bottom margins or heights without changing its display type.
Examples: \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`, \`<code>\`.

\`\`\`html
<div class="card">
  <p>Status: <span class="badge">Active</span></p>
</div>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Block vs Inline",
      description: "Inspect how <div> stacks vertically while <span> stays within the sentence flow.",
      html: `<div style="background: #e0f2fe; padding: 10px; margin-bottom: 8px;">I am a BLOCK element (full width).</div>\n<p>I am a paragraph containing an <span style="background: #fef08a; padding: 2px 6px;">INLINE span</span> that flows seamlessly with text.</p>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which of the following is an inline element by default?",
      options: ["<div>", "<p>", "<span>", "<h1>"],
      correctIndex: 2,
      explanation: "<span> is an inline element that only consumes the width of its text content.",
    },
    exerciseBrief: `Build a card component inside a block <div> containing a paragraph with an inline <span class="badge"> element indicating a 'Verified' status tag.`,
    hints: [
      "Create a <div class='card'>.",
      "Inside it, place a <p> containing text and a <span class='badge'>Verified</span>.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains a block <div> element with class 'card'.",
        testCode: "Boolean(document.querySelector('div.card'))",
      },
      {
        id: "req-2",
        description: "Contains an inline <span> with class 'badge' inside the card.",
        testCode: "Boolean(document.querySelector('div.card span.badge'))",
      },
    ],
    starterHtml: `<!-- Chapter 7: Block vs Inline -->\n<!-- TODO: Add <div class="card"> with a <p> and <span class="badge"> -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }\n.badge { background: #10b981; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; }`,
    starterJs: ``,
    solutionHtml: `<div class="card">\n  <h3>Engineering Student</h3>\n  <p>Enrollment Status: <span class="badge">Verified</span></p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }\n.badge { background: #10b981; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; }`,
    solutionJs: ``,
  },
  {
    id: "html-semantic-structure",
    number: 8,
    title: "Semantic HTML5 Landmarks & Layout",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Structure a modern webpage using semantic HTML5 landmark tags (header, nav, main, article, aside, footer) instead of div soup.",
    conceptGuide: `### Why Semantic HTML Matters
Semantic HTML introduces tags that describe their meaning to both the browser, screen readers, and search engine crawlers:
- \`<header>\`: Container for introductory content or navigational links.
- \`<nav>\`: Dedicated section of major navigation links.
- \`<main>\`: The dominant, unique content of the \`<body>\` (only one per page).
- \`<section>\`: A standalone thematic grouping of content.
- \`<article>\`: Self-contained, independently distributable content (e.g., blog post).
- \`<aside>\`: Content tangentially related to the content around it (e.g., sidebar).
- \`<footer>\`: Authorship, copyright, contact info, or sitemap links.`,
    tryItExample: {
      title: "W3Schools Try-It: Semantic Layout",
      description: "Observe the clean semantic landmark layout below.",
      html: `<header>\n  <h2>Nexus Academy</h2>\n  <nav><a href="#about">About</a> · <a href="#courses">Courses</a></nav>\n</header>\n<main>\n  <article>\n    <h3>Semantic Architecture</h3>\n    <p>Semantic tags replace div soup with structured meaning.</p>\n  </article>\n</main>\n<footer>\n  <small>&copy; 2026 Nexus LMS</small>\n</footer>`,
      css: `body { font-family: sans-serif; margin: 0; padding: 16px; }\nheader, footer { background: #1e293b; color: white; padding: 12px 16px; border-radius: 6px; }\nheader nav a { color: #38bdf8; margin-right: 8px; text-decoration: none; }\nmain { margin: 16px 0; padding: 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which element must represent the dominant, unique content of a document and appear at most once per page?",
      options: ["<section>", "<article>", "<main>", "<div>"],
      correctIndex: 2,
      explanation: "<main> designates the central, primary content of the body and should be unique across the document.",
    },
    exerciseBrief: `Build a clean semantic portfolio structure with <header> (with <h1>), <nav> (with at least 3 links), <main> (containing an <article> and an <aside>), and a <footer>.`,
    hints: [
      "Use <header> with an <h1>.",
      "Add a <nav> containing at least 3 <a> tags.",
      "Place an <article> and an <aside> inside <main>.",
      "Add a <footer> at the bottom.",
    ],
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
        description: "Contains a semantic <footer> element with text.",
        testCode: "Boolean(document.querySelector('footer') && document.querySelector('footer').textContent.trim().length > 5)",
      },
    ],
    starterHtml: `<!-- Chapter 8: Semantic Landmarks -->\n<!-- TODO: Replace placeholders with <header>, <nav>, <main>, <article>, <aside>, <footer> -->\n<div class="top-area">\n  <h1>Alex Rivera · Full Stack Developer</h1>\n  <div>\n    <a href="#about">About</a>\n    <a href="#projects">Projects</a>\n    <a href="#contact">Contact</a>\n  </div>\n</div>\n\n<div class="content-area">\n  <div class="post">\n    <h2>System Architecture Insights</h2>\n    <p>Designing zero-latency cloud software requires decoupling bottlenecks.</p>\n  </div>\n  <div class="sidebar">\n    <h3>Quick Skills</h3>\n    <p>TypeScript, C++, React, Next.js</p>\n  </div>\n</div>\n\n<div class="bottom-area">\n  <p>&copy; 2026 Alex Rivera. All rights reserved.</p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; }\nheader { background: #0f172a; color: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; }\nnav a { color: #38bdf8; margin-right: 12px; text-decoration: none; }\nmain { display: flex; gap: 20px; margin-bottom: 16px; }\narticle { flex: 2; background: #ffffff; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\naside { flex: 1; background: #f8fafc; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\nfooter { background: #1e293b; color: #94a3b8; padding: 12px 16px; border-radius: 8px; text-align: center; }`,
    starterJs: ``,
    solutionHtml: `<header>\n  <h1>Alex Rivera · Full Stack Developer</h1>\n  <nav>\n    <a href="#about">About</a>\n    <a href="#projects">Projects</a>\n    <a href="#contact">Contact</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>System Architecture Insights</h2>\n    <p>Designing zero-latency cloud software requires decoupling bottlenecks.</p>\n  </article>\n  <aside>\n    <h3>Quick Skills</h3>\n    <p>TypeScript, C++, React, Next.js</p>\n  </aside>\n</main>\n\n<footer>\n  <p>&copy; 2026 Alex Rivera. All rights reserved.</p>\n</footer>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; }\nheader { background: #0f172a; color: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; }\nnav a { color: #38bdf8; margin-right: 12px; text-decoration: none; }\nmain { display: flex; gap: 20px; margin-bottom: 16px; }\narticle { flex: 2; background: #ffffff; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\naside { flex: 1; background: #f8fafc; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }\nfooter { background: #1e293b; color: #94a3b8; padding: 12px 16px; border-radius: 8px; text-align: center; }`,
    solutionJs: ``,
  },
  {
    id: "html-accessible-forms",
    number: 9,
    title: "Interactive Forms, Controls & Labels",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Create accessible forms with explicit label for attributes, text/email/password inputs, select dropdowns, and submit buttons.",
    conceptGuide: `### The HTML <form> Ecosystem
Forms gather user data. Connecting each \`<label>\` to its input via \`for\` and matching \`id\` is essential for accessibility:
\`\`\`html
<form action="/submit" method="POST">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" placeholder="e.g. s_vasudevan" />

  <label for="track">Select Track:</label>
  <select id="track" name="track">
    <option value="dsa">DSA & Algorithms</option>
    <option value="mern">MERN Full Stack</option>
  </select>

  <button type="submit">Submit Registration</button>
</form>
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Forms",
      description: "Test typing into form inputs and submitting.",
      html: `<form onsubmit="event.preventDefault(); alert('Form submitted: ' + document.getElementById('name').value);">\n  <label for="name" style="display:block; margin-bottom:4px; font-weight:bold;">Student Name:</label>\n  <input type="text" id="name" style="padding:8px; width:100%; border:1px solid #cbd5e1; border-radius:4px; margin-bottom:12px;" placeholder="Enter your full name">\n  <button type="submit" style="background:#0284c7; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Submit</button>\n</form>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which attribute links a <label> element to its corresponding <input> for accessibility?",
      options: ["id", "for", "name", "target"],
      correctIndex: 1,
      explanation: "The 'for' attribute on a <label> must match the 'id' attribute of the input control.",
    },
    exerciseBrief: `Build a course registration form with <form>, at least two inputs (with type="text" and type="email"), explicit <label> tags matching the input ids, a <select> dropdown with at least 2 options, and a submit <button>.`,
    hints: [
      "Ensure each <label> has a 'for' attribute that exactly matches an <input id='...'>.",
      "Add one input with type='text' and one with type='email'.",
      "Include a <select> dropdown with at least 2 <option> tags.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains a <form> element with at least two inputs (text and email).",
        testCode: "Boolean(document.querySelector('form input[type=\"text\"]') && document.querySelector('form input[type=\"email\"]'))",
      },
      {
        id: "req-2",
        description: "Every input has a paired <label for='...'> pointing to its id.",
        testCode: "Boolean(document.querySelector('label[for=\"fullname\"]') && document.getElementById('fullname'))",
      },
      {
        id: "req-3",
        description: "Contains a <select> dropdown with at least 2 <option> elements and a submit button.",
        testCode: "document.querySelectorAll('form select option').length >= 2 && Boolean(document.querySelector('form button[type=\"submit\"], form input[type=\"submit\"]'))",
      },
    ],
    starterHtml: `<!-- Chapter 9: Forms -->\n<!-- TODO: Build a <form> with labeled text and email inputs, a <select> dropdown, and submit button -->\n`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nform { max-width: 400px; background: #ffffff; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; }\nlabel { display: block; margin-top: 12px; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155; }\ninput, select { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }\nbutton { margin-top: 16px; width: 100%; background: #0284c7; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; }`,
    starterJs: ``,
    solutionHtml: `<form>\n  <label for="fullname">Full Name:</label>\n  <input type="text" id="fullname" name="fullname" placeholder="John Doe" required>\n\n  <label for="email">Student Email:</label>\n  <input type="email" id="email" name="email" placeholder="john@nexus.edu" required>\n\n  <label for="course">Specialization:</label>\n  <select id="course" name="course">\n    <option value="dsa">DSA & Algorithmic Problem Solving</option>\n    <option value="mern">Full-Stack MERN Development</option>\n  </select>\n\n  <button type="submit">Complete Enrollment</button>\n</form>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nform { max-width: 400px; background: #ffffff; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; }\nlabel { display: block; margin-top: 12px; margin-bottom: 4px; font-weight: 600; font-size: 13px; color: #334155; }\ninput, select { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }\nbutton { margin-top: 16px; width: 100%; background: #0284c7; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; }`,
    solutionJs: ``,
  },
  {
    id: "html-form-validation",
    number: 10,
    title: "Native HTML5 Form Validation & Constraints",
    track: "HTML",
    phase: "HTML5 Foundations",
    phaseNumber: 1,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Implement native client-side validation using required, pattern, minlength, and type constraints without writing custom JavaScript.",
    conceptGuide: `### Native HTML5 Form Constraints
Before sending form data to a backend server, modern browsers can automatically check input validity:
- \`required\`: Specifies that an input field must be filled out before submitting.
- \`pattern="[0-9]{10}"\`: A regular expression that the input value is checked against.
- \`minlength\` / \`maxlength\`: Enforces character boundaries.
- \`min\` / \`max\`: Enforces numeric or date boundaries.

\`\`\`html
<input type="tel" id="phone" name="phone" pattern="[0-9]{10}" required placeholder="10-digit mobile number">
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Validation Constraints",
      description: "Try submitting the form below with an invalid email or short password to see browser native validation tooltips.",
      html: `<form onsubmit="event.preventDefault(); alert('Valid submission!');">\n  <label>Email: <input type="email" required placeholder="name@domain.com"></label><br><br>\n  <label>Password (min 6 chars): <input type="password" required minlength="6"></label><br><br>\n  <button type="submit">Test Validation</button>\n</form>`,
      css: `body { font-family: sans-serif; padding: 20px; }\ninput:invalid { border-color: #ef4444; }\ninput:valid { border-color: #10b981; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which HTML attribute specifies that an input field must be filled out before submitting the form?",
      options: ["validate", "mandatory", "required", "checked"],
      correctIndex: 2,
      explanation: "The 'required' boolean attribute prevents form submission if the input is left empty.",
    },
    exerciseBrief: `Build a secure login form that enforces: 1) A required email input, 2) A required password input with minlength="8", and 3) A phone input with pattern="[0-9]{10}" requiring exactly 10 digits.`,
    hints: [
      "Add required to the email input.",
      "Add required and minlength='8' to the password input.",
      "Add pattern='[0-9]{10}' to the telephone input.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains an <input type='email'> with the required attribute.",
        testCode: "Boolean(document.querySelector('input[type=\"email\"][required]'))",
      },
      {
        id: "req-2",
        description: "Contains an <input type='password'> with required and minlength of at least 8.",
        testCode: "Boolean(document.querySelector('input[type=\"password\"][required]') && Number(document.querySelector('input[type=\"password\"]').getAttribute('minlength')) >= 8)",
      },
      {
        id: "req-3",
        description: "Contains an input with pattern='[0-9]{10}' for a 10-digit phone number.",
        testCode: "Boolean(document.querySelector('input[pattern*=\"0-9\"][pattern*=\"10\"]'))",
      },
    ],
    starterHtml: `<!-- Chapter 10: Form Validation Constraints -->\n<!-- TODO: Add required email, required password (minlength 8), and 10-digit phone with pattern -->\n<form>\n</form>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nform { max-width: 360px; display: flex; flexDirection: column; gap: 12px; }\ninput { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; }\nbutton { background: #ff6a00; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; }`,
    starterJs: ``,
    solutionHtml: `<form>\n  <label for="email">Email Address:</label>\n  <input type="email" id="email" required placeholder="user@nexus.edu">\n\n  <label for="pwd">Password (min 8 chars):</label>\n  <input type="password" id="pwd" required minlength="8">\n\n  <label for="phone">Mobile (10 digits):</label>\n  <input type="tel" id="phone" required pattern="[0-9]{10}" placeholder="9876543210">\n\n  <button type="submit">Sign In</button>\n</form>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nform { max-width: 360px; display: flex; flexDirection: column; gap: 12px; }\ninput { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; }\nbutton { background: #ff6a00; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; }`,
    solutionJs: ``,
  },

  // ==========================================
  // TRACK 2: MODERN CSS3 (Lessons 11-16)
  // ==========================================
  {
    id: "css-selectors-colors",
    number: 11,
    title: "CSS Syntax, Selectors, Colors & Units",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Master CSS rules, class and ID selectors, modern color functions (hsl, rgba), and sizing units (rem, px, %).",
    conceptGuide: `### CSS Rule Anatomy
A CSS rule-set consists of a selector and a declaration block:
\`\`\`css
selector {
  property: value;
}
\`\`\`
- **Element Selector**: \`p { color: #334155; }\` targets all \`<p>\` tags.
- **Class Selector**: \`.primary-btn { background: #0284c7; }\` targets elements with \`class="primary-btn"\`.
- **ID Selector**: \`#header { padding: 1rem; }\` targets the unique element with \`id="header"\`.
- **Units**: Prefer relative \`rem\` (relative to root font-size) over fixed \`px\` for responsive typography.`,
    tryItExample: {
      title: "W3Schools Try-It: CSS Selectors",
      description: "Tweak colors and paddings in the CSS editor below.",
      html: `<div class="card" id="special-card">\n  <h2>Styled with CSS</h2>\n  <p class="subtitle">Classes provide reusable styling.</p>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 1.5rem; }\n.subtitle { color: #166534; font-size: 0.95rem; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which selector specifically targets an element with class='highlight'?",
      options: ["#highlight", ".highlight", "*highlight", "highlight"],
      correctIndex: 1,
      explanation: "Class selectors in CSS are prefixed with a period (.), whereas ID selectors use a hash (#).",
    },
    exerciseBrief: `Style the HTML cards using CSS: 1) Target .feature-card with a background color and 1.5rem padding, 2) Target .feature-card h3 with color #0284c7, and 3) Target #lead-card with an accent border.`,
    hints: [
      "Use .feature-card { padding: 1.5rem; background: #ffffff; }.",
      "Use #lead-card { border: 2px solid #ff6a00; } to target the lead card specifically.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The .feature-card class has padding of at least 1rem.",
        testCode: "Boolean(document.querySelector('.feature-card') && parseInt(getComputedStyle(document.querySelector('.feature-card')).padding) >= 12)",
      },
      {
        id: "req-2",
        description: "The #lead-card element has an applied custom border.",
        testCode: "Boolean(document.getElementById('lead-card') && getComputedStyle(document.getElementById('lead-card')).borderWidth !== '0px')",
      },
    ],
    starterHtml: `<div class="feature-card" id="lead-card">\n  <h3>Full Stack Engineering</h3>\n  <p>Learn end-to-end web systems architecture.</p>\n</div>`,
    starterCss: `/* Chapter 11: CSS Selectors */\n/* TODO: Apply styles to .feature-card and #lead-card */\n`,
    starterJs: ``,
    solutionHtml: `<div class="feature-card" id="lead-card">\n  <h3>Full Stack Engineering</h3>\n  <p>Learn end-to-end web systems architecture.</p>\n</div>`,
    solutionCss: `.feature-card {\n  background: #f8fafc;\n  padding: 1.5rem;\n  border-radius: 8px;\n  font-family: sans-serif;\n}\n.feature-card h3 {\n  color: #0284c7;\n  margin-top: 0;\n}\n#lead-card {\n  border: 2px solid #ff6a00;\n}`,
    solutionJs: ``,
  },
  {
    id: "css-box-model",
    number: 12,
    title: "The CSS Box Model & Sizing",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Master the 4 concentric layers: content, padding, border, and margin, and understand box-sizing: border-box.",
    conceptGuide: `### The CSS Box Model Layers
All HTML elements can be considered as boxes:
1. **Content**: Where text and images appear.
2. **Padding**: Clears an area around the content (inside the border).
3. **Border**: Goes around the padding and content.
4. **Margin**: Clears an area outside the border (spacing between elements).

### Why box-sizing: border-box is Universal Standard
With default \`content-box\`, adding padding or border expands the overall element width beyond \`width: 200px\`.
With \`box-sizing: border-box\`, the padding and border are included within the specified width:
\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Box Model",
      description: "Inspect the margins, borders, and paddings in action.",
      html: `<div class="box">Box Model Demo</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.box {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 20px;\n  border: 4px solid #3b82f6;\n  margin: 30px auto;\n  background: #dbeafe;\n  text-align: center;\n  font-weight: bold;\n}`,
      js: ``,
    },
    quizExercise: {
      question: "Which property causes width and height to include padding and border instead of expanding outwards?",
      options: [
        "box-model: auto",
        "box-sizing: border-box",
        "margin: collapse",
        "display: flex",
      ],
      correctIndex: 1,
      explanation: "box-sizing: border-box ensures that padding and borders are accounted for inside the declared width and height.",
    },
    exerciseBrief: `Create two boxes side by side. Apply * { box-sizing: border-box; }, give each box a width of 50%, padding of 20px, and a visible border without overflowing the container.`,
    hints: [
      "Set * { box-sizing: border-box; } at the top of your CSS.",
      "Give .box { width: 50%; padding: 20px; border: 1px solid #94a3b8; }.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Applies box-sizing: border-box across elements.",
        testCode: "Boolean(getComputedStyle(document.querySelector('.box')).boxSizing === 'border-box')",
      },
      {
        id: "req-2",
        description: "The .box has a padding of at least 16px and a visible border.",
        testCode: "Boolean(parseInt(getComputedStyle(document.querySelector('.box')).padding) >= 16 && getComputedStyle(document.querySelector('.box')).borderWidth !== '0px')",
      },
    ],
    starterHtml: `<div class="container">\n  <div class="box">Box 1</div>\n  <div class="box">Box 2</div>\n</div>`,
    starterCss: `/* Chapter 12: Box Model */\n/* TODO: Configure box-sizing: border-box and styling for .box */\n`,
    starterJs: ``,
    solutionHtml: `<div class="container">\n  <div class="box">Box 1</div>\n  <div class="box">Box 2</div>\n</div>`,
    solutionCss: `* {\n  box-sizing: border-box;\n}\nbody {\n  font-family: sans-serif;\n  padding: 20px;\n}\n.container {\n  display: flex;\n  gap: 12px;\n}\n.box {\n  width: 50%;\n  padding: 20px;\n  background: #f1f5f9;\n  border: 2px solid #cbd5e1;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}`,
    solutionJs: ``,
  },
  {
    id: "css-flexbox-mastery",
    number: 13,
    title: "Modern Flexbox Layouts & Alignment",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Master 1D flexbox layouts: display: flex, justify-content, align-items, and flex-direction.",
    conceptGuide: `### The CSS Flexbox Layout Module
Flexbox makes it easy to design flexible, responsive layout structures without float or positioning hacks.
- **Flex Container**: The parent element with \`display: flex\`.
- **Main Axis**: Directed by \`flex-direction\` (\`row\` horizontal, \`column\` vertical).
- **justify-content**: Aligns items along the main axis (\`flex-start\`, \`center\`, \`space-between\`, \`space-around\`).
- **align-items**: Aligns items along the cross axis (\`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`).
- **gap**: Defines spacing between child flex items.

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Flexbox Alignment",
      description: "Experiment with changing justify-content to 'center' or 'space-between'.",
      html: `<div class="flex-demo">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.flex-demo {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e293b;\n  padding: 16px;\n  border-radius: 8px;\n}\n.item {\n  background: #38bdf8;\n  color: #0f172a;\n  font-weight: bold;\n  padding: 16px 24px;\n  border-radius: 6px;\n}`,
      js: ``,
    },
    quizExercise: {
      question: "Which flexbox property distributes items with equal spacing between them along the main axis?",
      options: [
        "align-items: space-between",
        "justify-content: space-between",
        "flex-direction: spread",
        "margin: auto",
      ],
      correctIndex: 1,
      explanation: "justify-content: space-between pushes the first item to the start, the last item to the end, and distributes extra space evenly between them.",
    },
    exerciseBrief: `Create a responsive website navbar. Style .navbar with display: flex, justify-content: space-between, align-items: center, and place logo on the left and nav links on the right.`,
    hints: [
      "Set .navbar { display: flex; justify-content: space-between; align-items: center; }.",
      "Add gap: 16px between .nav-links.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The .navbar has display: flex applied.",
        testCode: "getComputedStyle(document.querySelector('.navbar')).display === 'flex'",
      },
      {
        id: "req-2",
        description: "The .navbar has justify-content: space-between.",
        testCode: "getComputedStyle(document.querySelector('.navbar')).justifyContent === 'space-between'",
      },
      {
        id: "req-3",
        description: "The .navbar has align-items: center.",
        testCode: "getComputedStyle(document.querySelector('.navbar')).alignItems === 'center'",
      },
    ],
    starterHtml: `<div class="navbar">\n  <div class="logo">Nexus LMS</div>\n  <div class="nav-links">\n    <a href="#courses">Courses</a>\n    <a href="#lab">DSA Arena</a>\n    <a href="#account">Profile</a>\n  </div>\n</div>`,
    starterCss: `/* Chapter 13: Flexbox Mastery */\n/* TODO: Style .navbar using flexbox with space-between and center alignment */\n`,
    starterJs: ``,
    solutionHtml: `<div class="navbar">\n  <div class="logo">Nexus LMS</div>\n  <div class="nav-links">\n    <a href="#courses">Courses</a>\n    <a href="#lab">DSA Arena</a>\n    <a href="#account">Profile</a>\n  </div>\n</div>`,
    solutionCss: `body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #0f172a;\n  color: #ffffff;\n  padding: 16px 24px;\n  border-radius: 8px;\n}\n.logo {\n  font-weight: 800;\n  font-size: 1.2rem;\n  color: #ff6a00;\n}\n.nav-links {\n  display: flex;\n  gap: 16px;\n}\n.nav-links a {\n  color: #cbd5e1;\n  text-decoration: none;\n  font-weight: 600;\n}\n.nav-links a:hover {\n  color: #38bdf8;\n}`,
    solutionJs: ``,
  },
  {
    id: "css-flex-cards",
    number: 14,
    title: "Responsive Flexbox Cards & Wrapping",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    objective: "Build a responsive multi-card layout using flex-wrap: wrap, flex-grow, and gap spacing.",
    conceptGuide: `### Multi-Line Flex Containers with flex-wrap
By default, flex items try to fit onto one line. With \`flex-wrap: wrap\`, items automatically wrap onto multiple lines when available width shrinks:
\`\`\`css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 260px; /* grow, shrink, basis */
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Wrapping Cards",
      description: "Observe how flex items wrap when the screen width narrows.",
      html: `<div class="grid">\n  <div class="card">Card 1</div>\n  <div class="card">Card 2</div>\n  <div class="card">Card 3</div>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.grid { display: flex; flex-wrap: wrap; gap: 16px; }\n.card { flex: 1 1 150px; background: #e0f2fe; padding: 20px; border-radius: 6px; text-align: center; font-weight: bold; }`,
      js: ``,
    },
    quizExercise: {
      question: "Which flexbox property enables child items to break into new rows when horizontal space runs out?",
      options: ["flex-flow: auto", "flex-wrap: wrap", "overflow: wrap", "display: grid"],
      correctIndex: 1,
      explanation: "flex-wrap: wrap instructs the flex container to wrap items onto new lines if necessary.",
    },
    exerciseBrief: `Build a course catalogue grid with class 'card-grid' containing 3 '.course-card' items. Apply display: flex, flex-wrap: wrap, a gap of at least 16px, and give cards a minimum flex-basis of 200px.`,
    hints: [
      "Set .card-grid { display: flex; flex-wrap: wrap; gap: 16px; }.",
      "Set .course-card { flex: 1 1 200px; }.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The .card-grid container has display: flex and flex-wrap: wrap.",
        testCode: "getComputedStyle(document.querySelector('.card-grid')).display === 'flex' && getComputedStyle(document.querySelector('.card-grid')).flexWrap === 'wrap'",
      },
      {
        id: "req-2",
        description: "Contains at least 3 .course-card elements inside .card-grid.",
        testCode: "document.querySelectorAll('.card-grid .course-card').length >= 3",
      },
    ],
    starterHtml: `<div class="card-grid">\n  <div class="course-card">\n    <h3>HTML5 Foundations</h3>\n    <p>Semantic markup & forms</p>\n  </div>\n  <div class="course-card">\n    <h3>CSS3 Modern Layouts</h3>\n    <p>Flexbox, Grid & Animation</p>\n  </div>\n  <div class="course-card">\n    <h3>Full MERN Stack</h3>\n    <p>MongoDB, Node & React</p>\n  </div>\n</div>`,
    starterCss: `/* Chapter 14: Flex Wrapping */\n/* TODO: Apply display: flex, flex-wrap: wrap, and flex: 1 1 200px to cards */\n`,
    starterJs: ``,
    solutionHtml: `<div class="card-grid">\n  <div class="course-card">\n    <h3>HTML5 Foundations</h3>\n    <p>Semantic markup & forms</p>\n  </div>\n  <div class="course-card">\n    <h3>CSS3 Modern Layouts</h3>\n    <p>Flexbox, Grid & Animation</p>\n  </div>\n  <div class="course-card">\n    <h3>Full MERN Stack</h3>\n    <p>MongoDB, Node & React</p>\n  </div>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.course-card {\n  flex: 1 1 200px;\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  padding: 20px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);\n}\n.course-card h3 {\n  margin-top: 0;\n  color: #0f172a;\n}`,
    solutionJs: ``,
  },
  {
    id: "css-grid-responsive",
    number: 15,
    title: "Modern CSS Grid & Two-Dimensional Layouts",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Master CSS Grid: display: grid, grid-template-columns, repeat(), minmax(), and auto-fit for bulletproof 2D layouts.",
    conceptGuide: `### CSS Grid vs Flexbox
While Flexbox is primarily 1-dimensional (row OR column), CSS Grid is 2-dimensional (rows AND columns simultaneously).

### The Golden Formula for Auto-Responsive Grids
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`
- \`repeat(auto-fit, ...)\`: Automatically creates as many columns as will fit.
- \`minmax(250px, 1fr)\`: Each column is at least 250px wide, and shares extra space equally. No media queries needed!`,
    tryItExample: {
      title: "W3Schools Try-It: CSS Grid",
      description: "Experiment with changing grid-template-columns.",
      html: `<div class="grid-container">\n  <div class="grid-cell">A</div>\n  <div class="grid-cell">B</div>\n  <div class="grid-cell">C</div>\n  <div class="grid-cell">D</div>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 12px;\n}\n.grid-cell {\n  background: #f43f5e;\n  color: white;\n  font-weight: bold;\n  padding: 30px;\n  text-align: center;\n  border-radius: 6px;\n}`,
      js: ``,
    },
    quizExercise: {
      question: "Which CSS Grid function defines a column width boundary with both a floor (minimum) and ceiling (maximum)?",
      options: ["clamp()", "minmax()", "auto-fit()", "fit-content()"],
      correctIndex: 1,
      explanation: "minmax(min, max) defines a size range greater than or equal to min and less than or equal to max.",
    },
    exerciseBrief: `Build a dashboard grid with class 'dashboard-grid'. Apply display: grid, grid-template-columns with repeat(auto-fit, minmax(200px, 1fr)), and a gap of 16px across at least 4 '.stat-card' cells.`,
    hints: [
      "Use display: grid on .dashboard-grid.",
      "Set grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));.",
      "Add gap: 16px;.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The .dashboard-grid element has display: grid.",
        testCode: "getComputedStyle(document.querySelector('.dashboard-grid')).display === 'grid'",
      },
      {
        id: "req-2",
        description: "The .dashboard-grid has a grid-gap or gap of at least 12px.",
        testCode: "parseInt(getComputedStyle(document.querySelector('.dashboard-grid')).gap) >= 12",
      },
      {
        id: "req-3",
        description: "Contains at least 4 .stat-card elements.",
        testCode: "document.querySelectorAll('.dashboard-grid .stat-card').length >= 4",
      },
    ],
    starterHtml: `<div class="dashboard-grid">\n  <div class="stat-card"><h3>1,240</h3><p>Active Students</p></div>\n  <div class="stat-card"><h3>98.5%</h3><p>Pass Rate</p></div>\n  <div class="stat-card"><h3>100</h3><p>Modules</p></div>\n  <div class="stat-card"><h3>4.9★</h3><p>Rating</p></div>\n</div>`,
    starterCss: `/* Chapter 15: CSS Grid */\n/* TODO: Apply display: grid with auto-fit and minmax(200px, 1fr) */\n`,
    starterJs: ``,
    solutionHtml: `<div class="dashboard-grid">\n  <div class="stat-card"><h3>1,240</h3><p>Active Students</p></div>\n  <div class="stat-card"><h3>98.5%</h3><p>Pass Rate</p></div>\n  <div class="stat-card"><h3>100</h3><p>Modules</p></div>\n  <div class="stat-card"><h3>4.9★</h3><p>Rating</p></div>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n.stat-card {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 20px;\n  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);\n}\n.stat-card h3 {\n  margin: 0 0 6px;\n  font-size: 24px;\n  color: #0284c7;\n}\n.stat-card p {\n  margin: 0;\n  color: #64748b;\n  font-size: 13px;\n}`,
    solutionJs: ``,
  },
  {
    id: "css-media-queries",
    number: 16,
    title: "Responsive Web Design & Media Queries",
    track: "CSS",
    phase: "Modern CSS3",
    phaseNumber: 2,
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    objective: "Adapt layouts to various device viewport sizes with mobile-first CSS media queries (@media).",
    conceptGuide: `### The @media Rule
The \`@media\` rule is used in media queries to apply different styles for different media types/devices.
\`\`\`css
/* Mobile-first base styles */
.hero {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet & Desktop viewport */
@media (min-width: 768px) {
  .hero {
    padding: 3rem;
    font-size: 1.5rem;
  }
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Media Queries",
      description: "Test responsiveness by adjusting window width or reviewing query rules.",
      html: `<div class="responsive-box">Resize preview to test responsiveness</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.responsive-box {\n  background: #e2e8f0;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n}\n@media (max-width: 600px) {\n  .responsive-box { background: #fef08a; }\n}`,
      js: ``,
    },
    quizExercise: {
      question: "Which CSS rule is used to apply style rules conditionally based on screen width?",
      options: ["@viewport", "@responsive", "@media", "@screen"],
      correctIndex: 2,
      explanation: "@media allows targeting specific device capabilities such as width, height, or orientation.",
    },
    exerciseBrief: `Write CSS that renders .sidebar and .content stacked by default, and at @media (min-width: 600px) displays them side-by-side using display: flex with .sidebar taking flex: 1 and .content taking flex: 2.`,
    hints: [
      "Define .layout-container { display: flex; flex-direction: column; } as base.",
      "Add @media (min-width: 600px) { .layout-container { flex-direction: row; } }.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains a CSS media query rule targeting screen widths.",
        testCode: "Boolean(Array.from(document.styleSheets).some(s => { try { return Array.from(s.cssRules).some(r => r.type === CSSRule.MEDIA_RULE); } catch(e) { return false; } }))",
      },
    ],
    starterHtml: `<div class="layout-container">\n  <aside class="sidebar">Navigation Menu</aside>\n  <main class="content">Main Course Body Content</main>\n</div>`,
    starterCss: `/* Chapter 16: Media Queries */\n/* TODO: Add mobile-first styles and a media query for min-width: 600px */\n`,
    starterJs: ``,
    solutionHtml: `<div class="layout-container">\n  <aside class="sidebar">Navigation Menu</aside>\n  <main class="content">Main Course Body Content</main>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; margin: 0; }\n.layout-container {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.sidebar {\n  background: #f1f5f9;\n  padding: 20px;\n  border-radius: 8px;\n}\n.content {\n  background: #ffffff;\n  border: 1px solid #cbd5e1;\n  padding: 20px;\n  border-radius: 8px;\n}\n@media (min-width: 600px) {\n  .layout-container {\n    flex-direction: row;\n  }\n  .sidebar {\n    flex: 1;\n  }\n  .content {\n    flex: 3;\n  }\n}`,
    solutionJs: ``,
  },

  // ==========================================
  // TRACK 3: JAVASCRIPT & DOM (Lessons 17-22)
  // ==========================================
  {
    id: "js-variables-datatypes",
    number: 17,
    title: "JavaScript Variables, ES6 & Data Types",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Master modern variable declarations (let, const), primitives (string, number, boolean), objects, arrays, and template literals.",
    conceptGuide: `### Modern JavaScript Variables: let vs const
Never use legacy \`var\` in modern code.
- \`const\`: Block-scoped, cannot be reassigned (prefer by default).
- \`let\`: Block-scoped, can be reassigned when values mutate.

### Template Literals
Enclosed in backticks (\` \`), template literals allow variable interpolation with \`\${variable}\`:
\`\`\`javascript
const studentName = "Sairam";
const score = 98;
console.log(\`Student \${studentName} achieved \${score}% in Algorithmic Lab.\`);
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: JS Variables",
      description: "Run and inspect variables printed to the console.",
      html: `<button id="greet-btn">Run Greeting</button>\n<p id="output"></p>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('greet-btn').addEventListener('click', () => {\n  const language = "JavaScript";\n  const version = "ES2026";\n  document.getElementById('output').textContent = \`Mastering \${language} (\${version})\`;\n  console.log("Greeting executed!");\n});`,
    },
    quizExercise: {
      question: "Which keyword should be used by default to declare a variable whose reference will never be reassigned?",
      options: ["var", "let", "const", "def"],
      correctIndex: 2,
      explanation: "const enforces immutability of the binding, preventing accidental reassignments.",
    },
    exerciseBrief: `Write JavaScript to: 1) Declare a const variable studentName, 2) Declare a let variable completedModules = 5, 3) Update an element with id='profile-info' with a template string showing the name and module count.`,
    hints: [
      "const studentName = 'Your Name';",
      "let completedModules = 5;",
      "document.getElementById('profile-info').textContent = `Student: ${studentName} | Modules: ${completedModules}`;",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The #profile-info element contains dynamic text with a student name and completed modules count.",
        testCode: "Boolean(document.getElementById('profile-info') && document.getElementById('profile-info').textContent.trim().length > 10)",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Student Tracker</h2>\n  <p id="profile-info">Loading student profile...</p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; max-width: 400px; }`,
    starterJs: `// Chapter 17: Variables & Template Literals\n// TODO: Set textContent of #profile-info using const, let, and template literals\n`,
    solutionHtml: `<div class="card">\n  <h2>Student Tracker</h2>\n  <p id="profile-info">Loading student profile...</p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; max-width: 400px; }`,
    solutionJs: `const studentName = "Sairam Vasudevan";\nlet completedModules = 12;\ndocument.getElementById("profile-info").textContent = \`Student: \${studentName} · Completed Modules: \${completedModules}\`;\nconsole.log("Student profile initialized successfully.");`,
  },
  {
    id: "js-functions-scope",
    number: 18,
    title: "ES6 Functions, Scope & Arrow Syntax",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Master ES6 arrow functions, parameters, return values, and higher-order functions (map, filter).",
    conceptGuide: `### Arrow Function Expressions
Arrow functions provide a compact syntax and lexically bind the \`this\` value:
\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// ES6 Arrow function
const add = (a, b) => a + b;

// Array transformations
const scores = [65, 80, 95];
const bonusScores = scores.map(s => s + 5);
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Arrow Functions",
      description: "Click to compute array calculations with arrow functions.",
      html: `<button id="calc-btn">Compute Square Numbers</button>\n<p id="result"></p>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('calc-btn').addEventListener('click', () => {\n  const nums = [1, 2, 3, 4, 5];\n  const squares = nums.map(n => n * n);\n  document.getElementById('result').textContent = "Squares: " + squares.join(", ");\n  console.log("Result computed:", squares);\n});`,
    },
    quizExercise: {
      question: "Which of the following represents valid ES6 concise arrow function syntax returning x multiplied by 2?",
      options: [
        "const double = (x) -> x * 2;",
        "const double = (x) => x * 2;",
        "const double = x => return x * 2;",
        "const double = (x) => { x * 2 };",
      ],
      correctIndex: 1,
      explanation: "const double = (x) => x * 2; uses concise body syntax with implicit return.",
    },
    exerciseBrief: `Write an arrow function calculateAverage(scores) that takes an array of numbers and returns their average. Call it with [80, 90, 100] and display the result inside #avg-display.`,
    hints: [
      "const calculateAverage = (arr) => arr.reduce((acc, curr) => acc + curr, 0) / arr.length;",
      "document.getElementById('avg-display').textContent = `Average: ${calculateAverage([80, 90, 100])}`;",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The #avg-display element displays the computed average value 90.",
        testCode: "Boolean(document.getElementById('avg-display') && document.getElementById('avg-display').textContent.includes('90'))",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Score Calculator</h2>\n  <p id="avg-display">Calculating average...</p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }`,
    starterJs: `// Chapter 18: Functions & Arrow Syntax\n// TODO: Define calculateAverage arrow function and set #avg-display text\n`,
    solutionHtml: `<div class="card">\n  <h2>Score Calculator</h2>\n  <p id="avg-display">Calculating average...</p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }`,
    solutionJs: `const calculateAverage = (arr) => arr.reduce((sum, n) => sum + n, 0) / arr.length;\nconst avg = calculateAverage([80, 90, 100]);\ndocument.getElementById("avg-display").textContent = \`Average Score: \${avg}\`;\nconsole.log("Computed average:", avg);`,
  },
  {
    id: "js-dom-selection",
    number: 19,
    title: "DOM Selection & Attribute/Style Mutation",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 20,
    difficulty: "Beginner",
    objective: "Select DOM nodes with querySelector/querySelectorAll and dynamically manipulate textContent, innerHTML, classList, and styles.",
    conceptGuide: `### The Document Object Model (DOM)
The DOM represents the page as a tree of objects that programs can alter.
- \`document.querySelector('#id' | '.class')\`: Returns the first matching element.
- \`document.querySelectorAll('.class')\`: Returns a NodeList of all matching elements.
- \`element.textContent\`: Sets or retrieves the raw text.
- \`element.classList.add('active')\` / \`.remove('active')\` / \`.toggle('active')\`: Alters classes.

\`\`\`javascript
const heading = document.querySelector('h1');
heading.textContent = "Welcome to Modern JavaScript!";
heading.classList.add('highlighted');
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: DOM Selection",
      description: "Click the button to manipulate DOM attributes in real-time.",
      html: `<h3 id="target-header">Initial Header</h3>\n<button id="change-btn">Change Text & Color</button>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('change-btn').addEventListener('click', () => {\n  const el = document.getElementById('target-header');\n  el.textContent = "Text Updated via DOM API! ✓";\n  el.style.color = "#10b981";\n});`,
    },
    quizExercise: {
      question: "Which DOM method returns the first element matching a specified CSS selector string?",
      options: [
        "document.getElement()",
        "document.querySelector()",
        "document.findSelector()",
        "document.getElementsByClass()",
      ],
      correctIndex: 1,
      explanation: "document.querySelector() selects the first matching element using standard CSS selector syntax.",
    },
    exerciseBrief: `Select all elements with class '.status-pill' and use a forEach loop to add the class 'active' to each of them and change their text to 'Online'.`,
    hints: [
      "const pills = document.querySelectorAll('.status-pill');",
      "pills.forEach(pill => { pill.classList.add('active'); pill.textContent = 'Online'; });",
    ],
    requirements: [
      {
        id: "req-1",
        description: "All .status-pill elements have the 'active' class added.",
        testCode: "document.querySelectorAll('.status-pill.active').length === 3",
      },
      {
        id: "req-2",
        description: "All .status-pill elements display the text 'Online'.",
        testCode: "Array.from(document.querySelectorAll('.status-pill')).every(p => p.textContent.includes('Online'))",
      },
    ],
    starterHtml: `<div class="status-container">\n  <span class="status-pill">Offline</span>\n  <span class="status-pill">Offline</span>\n  <span class="status-pill">Offline</span>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\n.status-container { display: flex; gap: 12px; }\n.status-pill { padding: 6px 12px; background: #e2e8f0; border-radius: 99px; font-size: 12px; font-weight: bold; }\n.status-pill.active { background: #10b981; color: white; }`,
    starterJs: `// Chapter 19: DOM Selection\n// TODO: Select all .status-pill elements, add 'active' class, and change text to 'Online'\n`,
    solutionHtml: `<div class="status-container">\n  <span class="status-pill">Offline</span>\n  <span class="status-pill">Offline</span>\n  <span class="status-pill">Offline</span>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.status-container { display: flex; gap: 12px; }\n.status-pill { padding: 6px 12px; background: #e2e8f0; border-radius: 99px; font-size: 12px; font-weight: bold; }\n.status-pill.active { background: #10b981; color: white; }`,
    solutionJs: `document.querySelectorAll(".status-pill").forEach((pill) => {\n  pill.classList.add("active");\n  pill.textContent = "Online";\n});\nconsole.log("All status pills set to Online.");`,
  },
  {
    id: "js-dom-interactive-counter",
    number: 20,
    title: "Event Listeners & Interactive State Management",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Manage interactive UI state using addEventListener: build an interactive counter with increment, decrement, and reset controls.",
    conceptGuide: `### Event-Driven JavaScript
Browser interactions fire events. \`addEventListener\` attaches an event handler without overwriting existing handlers:
\`\`\`javascript
const btn = document.querySelector('#increment-btn');
let count = 0;

btn.addEventListener('click', (event) => {
  count++;
  document.querySelector('#count-value').textContent = count;
});
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Interactive Button",
      description: "Click the button to see the click count increase.",
      html: `<div style="text-align: center;">\n  <h3>Taps: <span id="tap-count">0</span></h3>\n  <button id="tap-btn" style="background:#0284c7; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer;">Tap Me</button>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `let taps = 0;\ndocument.getElementById('tap-btn').addEventListener('click', () => {\n  taps++;\n  document.getElementById('tap-count').textContent = taps;\n  console.log("Tap count is now:", taps);\n});`,
    },
    quizExercise: {
      question: "Which method is the standard way to attach an event handler to a DOM element?",
      options: ["element.attachEvent()", "element.addEventListener()", "element.bindEvent()", "element.on()"],
      correctIndex: 1,
      explanation: "addEventListener('click', handler) is the modern W3C standard method for registering event listeners.",
    },
    exerciseBrief: `Build a complete interactive counter. Hook up: 1) #btn-increment to add 1, 2) #btn-decrement to subtract 1, and 3) #btn-reset to reset count to 0. Update #counter-value on each click.`,
    hints: [
      "Declare let count = 0;.",
      "Add click listeners to #btn-increment, #btn-decrement, and #btn-reset.",
      "Update document.getElementById('counter-value').textContent = count.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Clicking #btn-increment increases the count in #counter-value.",
        testCode: "(() => { const vBefore = Number(document.getElementById('counter-value').textContent); document.getElementById('btn-increment').click(); const vAfter = Number(document.getElementById('counter-value').textContent); return vAfter === vBefore + 1; })()",
      },
      {
        id: "req-2",
        description: "Clicking #btn-decrement decreases the count in #counter-value.",
        testCode: "(() => { const vBefore = Number(document.getElementById('counter-value').textContent); document.getElementById('btn-decrement').click(); const vAfter = Number(document.getElementById('counter-value').textContent); return vAfter === vBefore - 1; })()",
      },
      {
        id: "req-3",
        description: "Clicking #btn-reset resets #counter-value back to 0.",
        testCode: "(() => { document.getElementById('btn-increment').click(); document.getElementById('btn-reset').click(); return Number(document.getElementById('counter-value').textContent) === 0; })()",
      },
    ],
    starterHtml: `<div class="counter-box">\n  <div class="count-display" id="counter-value">0</div>\n  <div class="button-group">\n    <button id="btn-decrement">-</button>\n    <button id="btn-reset">Reset</button>\n    <button id="btn-increment">+</button>\n  </div>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 30px; text-align: center; }\n.counter-box { display: inline-block; background: #ffffff; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }\n.count-display { font-size: 48px; font-weight: 800; color: #0284c7; margin-bottom: 16px; }\n.button-group button { font-size: 16px; font-weight: bold; padding: 8px 18px; margin: 0 4px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; }\n#btn-increment { background: #10b981; color: white; border: none; }\n#btn-decrement { background: #ef4444; color: white; border: none; }`,
    starterJs: `// Chapter 20: Counter State\n// TODO: Implement increment, decrement, and reset listeners\n`,
    solutionHtml: `<div class="counter-box">\n  <div class="count-display" id="counter-value">0</div>\n  <div class="button-group">\n    <button id="btn-decrement">-</button>\n    <button id="btn-reset">Reset</button>\n    <button id="btn-increment">+</button>\n  </div>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 30px; text-align: center; }\n.counter-box { display: inline-block; background: #ffffff; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }\n.count-display { font-size: 48px; font-weight: 800; color: #0284c7; margin-bottom: 16px; }\n.button-group button { font-size: 16px; font-weight: bold; padding: 8px 18px; margin: 0 4px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; }\n#btn-increment { background: #10b981; color: white; border: none; }\n#btn-decrement { background: #ef4444; color: white; border: none; }`,
    solutionJs: `let count = 0;\nconst display = document.getElementById("counter-value");\n\nconst update = () => { display.textContent = count; };\n\ndocument.getElementById("btn-increment").addEventListener("click", () => {\n  count++;\n  update();\n});\n\ndocument.getElementById("btn-decrement").addEventListener("click", () => {\n  count--;\n  update();\n});\n\ndocument.getElementById("btn-reset").addEventListener("click", () => {\n  count = 0;\n  update();\n});`,
  },
  {
    id: "js-promises-async",
    number: 21,
    title: "Promises & Asynchronous Execution",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    objective: "Understand JavaScript single-threaded event loop, asynchronous execution, Promise states, and .then()/.catch() chaining.",
    conceptGuide: `### JavaScript Single Thread & Event Loop
JavaScript runs on a single thread. Long-running operations like network requests or timers run asynchronously via the browser Web APIs:
\`\`\`javascript
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

delay(1000)
  .then(() => {
    console.log("1 second has passed!");
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Promises",
      description: "Click to start an asynchronous simulated task.",
      html: `<button id="async-btn">Start Async Task</button>\n<p id="async-status">Idle</p>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('async-btn').addEventListener('click', () => {\n  document.getElementById('async-status').textContent = 'Fetching data...';\n  new Promise((res) => setTimeout(res, 800))\n    .then(() => {\n      document.getElementById('async-status').textContent = 'Promise resolved successfully! ✓';\n      console.log('Async operation complete');\n    });\n});`,
    },
    quizExercise: {
      question: "What are the three possible states of a JavaScript Promise?",
      options: [
        "Started, Paused, Stopped",
        "Pending, Fulfilled, Rejected",
        "Waiting, Completed, Failed",
        "Loading, Loaded, Error",
      ],
      correctIndex: 1,
      explanation: "A Promise is always in one of three states: pending (initial), fulfilled (succeeded), or rejected (failed).",
    },
    exerciseBrief: `Create a Promise that simulates loading student records after 500ms. Once fulfilled, update #promise-status to 'Loaded 100 Records' and add class 'success'.`,
    hints: [
      "new Promise((resolve) => setTimeout(() => resolve('Loaded 100 Records'), 500))",
      ".then((msg) => { const el = document.getElementById('promise-status'); el.textContent = msg; el.classList.add('success'); })",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The #promise-status element eventually displays 'Loaded 100 Records'.",
        testCode: "new Promise((done) => setTimeout(() => done(document.getElementById('promise-status').textContent.includes('Loaded 100 Records')), 650))",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Async Promise Loader</h2>\n  <div id="promise-status">Pending...</div>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\n#promise-status { padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: bold; }\n#promise-status.success { background: #dcfce7; color: #166534; border-color: #86efac; }`,
    starterJs: `// Chapter 21: Promises\n// TODO: Resolve promise after 500ms and update #promise-status\n`,
    solutionHtml: `<div class="card">\n  <h2>Async Promise Loader</h2>\n  <div id="promise-status">Pending...</div>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n#promise-status { padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: bold; }\n#promise-status.success { background: #dcfce7; color: #166534; border-color: #86efac; }`,
    solutionJs: `new Promise((resolve) => {\n  setTimeout(() => resolve("Loaded 100 Records"), 400);\n}).then((data) => {\n  const el = document.getElementById("promise-status");\n  el.textContent = data;\n  el.classList.add("success");\n  console.log("Promise resolved with:", data);\n});`,
  },
  {
    id: "js-async-fetch-api",
    number: 22,
    title: "Async/Await & The Fetch API",
    track: "JavaScript",
    phase: "JavaScript & DOM",
    phaseNumber: 3,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Fetch JSON data over HTTP using async/await and dynamically construct interactive UI cards.",
    conceptGuide: `### The Fetch API with Async/Await
\`async\` and \`await\` provide clean, readable syntax for handling asynchronous operations:
\`\`\`javascript
async function fetchUser() {
  try {
    const response = await fetch('https://api.github.com/users/octocat');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    console.log(data.name);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: Fetch API",
      description: "Test fetching mock JSON data and rendering into the DOM.",
      html: `<button id="fetch-btn">Fetch Mock API Data</button>\n<div id="api-output" style="margin-top:12px;"></div>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('fetch-btn').addEventListener('click', async () => {\n  const out = document.getElementById('api-output');\n  out.textContent = "Requesting API...";\n  // Simulated API response\n  await new Promise(r => setTimeout(r, 600));\n  const mockData = { title: "System Architecture", author: "Nexus Faculty" };\n  out.innerHTML = \`<b>\${mockData.title}</b> by \${mockData.author}\`;\n  console.log("Mock data rendered:", mockData);\n});`,
    },
    quizExercise: {
      question: "Which keyword can only be used inside a function declared with the 'async' keyword?",
      options: ["defer", "await", "wait", "yield"],
      correctIndex: 1,
      explanation: "await can only be utilized inside async functions (or at top level in ES modules).",
    },
    exerciseBrief: `Build an async data loader. When #load-data-btn is clicked, simulate fetching 3 course items and render them as list items <li> inside #courses-container.`,
    hints: [
      "Use document.getElementById('load-data-btn').addEventListener('click', async () => { ... })",
      "Render items inside document.getElementById('courses-container').innerHTML = ...",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Clicking #load-data-btn populates #courses-container with at least 3 <li> items.",
        testCode: "new Promise((done) => { document.getElementById('load-data-btn').click(); setTimeout(() => done(document.querySelectorAll('#courses-container li').length >= 3), 400); })",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Curriculum Feed</h2>\n  <button id="load-data-btn">Fetch Courses (GET)</button>\n  <ul id="courses-container">\n    <!-- Courses loaded dynamically -->\n  </ul>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nbutton { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }\nul { margin-top: 16px; padding-left: 20px; }`,
    starterJs: `// Chapter 22: Async/Await & Fetch\n// TODO: Add click listener to #load-data-btn and render 3 <li> items inside #courses-container\n`,
    solutionHtml: `<div class="card">\n  <h2>Curriculum Feed</h2>\n  <button id="load-data-btn">Fetch Courses (GET)</button>\n  <ul id="courses-container">\n    <!-- Courses loaded dynamically -->\n  </ul>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nbutton { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }\nul { margin-top: 16px; padding-left: 20px; }`,
    solutionJs: `document.getElementById("load-data-btn").addEventListener("click", async () => {\n  const container = document.getElementById("courses-container");\n  const mockCourses = ["HTML5 Semantics", "CSS3 Modern Grid", "JavaScript Async & DOM"];\n  container.innerHTML = mockCourses.map((c) => \`<li>\${c}</li>\`).join("");\n  console.log("Courses loaded successfully into container.");\n});`,
  },

  // ==========================================
  // TRACK 4: REACT & FULL MERN (Lessons 23-26)
  // ==========================================
  {
    id: "react-components-props",
    number: 23,
    title: "React Architecture: Components & Props",
    track: "React",
    phase: "Frontend & Full MERN",
    phaseNumber: 4,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Understand React declarative component architecture, JSX tree rendering, and reusable props passing.",
    conceptGuide: `### What is React?
React is a declarative, component-based frontend library for building user interfaces.
Instead of directly mutating the DOM with \`document.querySelector\`, in React you write reusable component functions that return JSX:

\`\`\`javascript
function CourseCard(props) {
  return (
    <div className="card">
      <h3>{props.title}</h3>
      <p>Duration: {props.hours} hours</p>
    </div>
  );
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: React Component Pattern",
      description: "Simulating React component instantiation with props.",
      html: `<div id="react-root"></div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\n.card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; margin-bottom: 8px; }`,
      js: `// React-style component function\nfunction Card({ title, badge }) {\n  return \`<div class="card"><h4>\${title}</h4><span style="color:#0284c7;font-size:12px;font-weight:bold;">\${badge}</span></div>\`;\n}\ndocument.getElementById('react-root').innerHTML = Card({ title: 'Algorithmic DSA Arena', badge: 'Active' });`,
    },
    quizExercise: {
      question: "How are external configuration properties passed into a child React component?",
      options: ["Via global variables", "Via 'props'", "Via DOM attributes only", "Via localStorage"],
      correctIndex: 1,
      explanation: "Props (short for properties) are how data is passed from parent components down to child components in React.",
    },
    exerciseBrief: `Simulate a React component function Badge({ label, type }). Call it 3 times with different props ('Verified', 'Pending', 'Admin') and render the cards into #react-mount.`,
    hints: [
      "Define function Badge({ label, type }) { return `<span class='badge ${type}'>${label}</span>`; }",
      "Render 3 badges inside document.getElementById('react-mount').innerHTML.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The #react-mount container contains at least 3 rendered badge components.",
        testCode: "document.querySelectorAll('#react-mount .badge').length >= 3",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Component Rendering Root</h2>\n  <div id="react-mount"></div>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\n.badge { display: inline-block; padding: 4px 10px; margin: 4px; border-radius: 99px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }`,
    starterJs: `// Chapter 23: Components & Props\n// TODO: Implement Badge component function and render 3 badges into #react-mount\n`,
    solutionHtml: `<div class="card">\n  <h2>Component Rendering Root</h2>\n  <div id="react-mount"></div>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\n.badge { display: inline-block; padding: 4px 10px; margin: 4px; border-radius: 99px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }`,
    solutionJs: `function Badge({ label, type }) {\n  return \`<span class="badge \${type}">\${label}</span>\`;\n}\n\nconst badges = [\n  Badge({ label: "Verified Student", type: "success" }),\n  Badge({ label: "DSA Lead", type: "primary" }),\n  Badge({ label: "Full Stack MERN", type: "info" }),\n];\n\ndocument.getElementById("react-mount").innerHTML = badges.join("");\nconsole.log("Components mounted to DOM.");`,
  },
  {
    id: "react-state-hooks",
    number: 24,
    title: "React State Management & Hooks",
    track: "React",
    phase: "Frontend & Full MERN",
    phaseNumber: 4,
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    objective: "Master the useState hook paradigm: managing component state, re-rendering on mutation, and two-way input binding.",
    conceptGuide: `### The useState Hook
State represents values that change over time in a component. Calling the updater function tells React to re-render:
\`\`\`javascript
import { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {likes}
    </button>
  );
}
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: React State Pattern",
      description: "Experiment with dynamic state updates.",
      html: `<div id="app"></div>`,
      css: `body { font-family: sans-serif; padding: 20px; }\nbutton { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }`,
      js: `let state = { count: 0 };\nfunction render() {\n  document.getElementById('app').innerHTML = \`<button onclick="increment()">Clicks: \${state.count}</button>\`;\n}\nwindow.increment = () => {\n  state.count++;\n  render();\n};\nrender();`,
    },
    quizExercise: {
      question: "In React, what happens when you call a state updater function returned by useState?",
      options: [
        "The browser reloads the entire HTML page",
        "React schedules a re-render of the component with the new state",
        "The component is permanently removed from the DOM",
        "It mutates the state directly without notifying React",
      ],
      correctIndex: 1,
      explanation: "Calling a state setter triggers React to re-render the component with the updated state value.",
    },
    exerciseBrief: `Build an interactive state manager simulating React's useState. Maintain state = { text: '' }. When a student types into #state-input, update the state and immediately re-render the text inside #state-preview.`,
    hints: [
      "document.getElementById('state-input').addEventListener('input', (e) => { ... })",
      "Update document.getElementById('state-preview').textContent = e.target.value",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Typing into #state-input synchronizes in real time with #state-preview.",
        testCode: "(() => { const inp = document.getElementById('state-input'); inp.value = 'MERN Stack Mastery'; inp.dispatchEvent(new Event('input')); return document.getElementById('state-preview').textContent.includes('MERN Stack Mastery'); })()",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Controlled Input State</h2>\n  <input type="text" id="state-input" placeholder="Type message...">\n  <p>Preview: <b id="state-preview"></b></p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\ninput { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }`,
    starterJs: `// Chapter 24: React State Hook\n// TODO: Synchronize #state-input with #state-preview\n`,
    solutionHtml: `<div class="card">\n  <h2>Controlled Input State</h2>\n  <input type="text" id="state-input" placeholder="Type message...">\n  <p>Preview: <b id="state-preview"></b></p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\ninput { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }`,
    solutionJs: `const input = document.getElementById("state-input");\nconst preview = document.getElementById("state-preview");\ninput.addEventListener("input", (e) => {\n  preview.textContent = e.target.value;\n});`,
  },
  {
    id: "node-express-rest-api",
    number: 25,
    title: "Node.js & Express REST API Architecture",
    track: "MERN Stack",
    phase: "Frontend & Full MERN",
    phaseNumber: 4,
    estimatedMinutes: 25,
    difficulty: "Advanced",
    objective: "Master backend Node.js and Express: setting up REST routes (GET, POST, PUT, DELETE), JSON body parsing, and status codes (200, 201, 400, 404).",
    conceptGuide: `### The Express Backend Framework
Express is the fast, unopinionated web framework for Node.js.
- \`app.get('/api/users')\`: Retrieves records.
- \`app.post('/api/users')\`: Creates a new record.
- \`app.use(express.json())\`: Parses incoming JSON request payloads.

\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());

let courses = [{ id: 1, name: "DSA Masterclass" }];

app.get('/api/courses', (req, res) => {
  res.status(200).json(courses);
});

app.post('/api/courses', (req, res) => {
  const newCourse = { id: Date.now(), name: req.body.name };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: REST API Endpoints",
      description: "Simulating GET and POST requests to an Express API.",
      html: `<button id="get-btn">GET /api/status</button>\n<button id="post-btn">POST /api/action</button>\n<pre id="api-log" style="background:#0f172a;color:#38bdf8;padding:12px;border-radius:6px;"></pre>`,
      css: `body { font-family: sans-serif; padding: 20px; }\nbutton { margin-right: 8px; padding: 8px 14px; border: none; border-radius: 4px; background: #0284c7; color: white; cursor: pointer; }`,
      js: `document.getElementById('get-btn').onclick = () => {\n  document.getElementById('api-log').textContent = JSON.stringify({ status: 200, message: "Express Server Active" }, null, 2);\n};\ndocument.getElementById('post-btn').onclick = () => {\n  document.getElementById('api-log').textContent = JSON.stringify({ status: 201, created: true, id: "doc_101" }, null, 2);\n};`,
    },
    quizExercise: {
      question: "Which HTTP status code signifies that a resource was successfully CREATED by a POST request?",
      options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"],
      correctIndex: 1,
      explanation: "201 Created is the standard HTTP status code returned upon successful resource generation.",
    },
    exerciseBrief: `Build an in-browser REST API simulator. Handle: 1) GET /api/data returning records, and 2) POST /api/data pushing a new item to an in-memory array and updating #record-count.`,
    hints: [
      "Maintain let records = ['Initial Record'];",
      "Update #record-count with records.length.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "The #record-count displays the current count of database records.",
        testCode: "Boolean(document.getElementById('record-count') && document.getElementById('record-count').textContent.includes('Record'))",
      },
    ],
    starterHtml: `<div class="card">\n  <h2>Express REST API Simulator</h2>\n  <button id="btn-post">Dispatch POST /api/data</button>\n  <p id="record-count">Records: 1</p>\n</div>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; }\nbutton { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }`,
    starterJs: `// Chapter 25: Express REST API\n// TODO: Implement in-memory array and push item on #btn-post click\n`,
    solutionHtml: `<div class="card">\n  <h2>Express REST API Simulator</h2>\n  <button id="btn-post">Dispatch POST /api/data</button>\n  <p id="record-count">Records: 1</p>\n</div>`,
    solutionCss: `body { font-family: sans-serif; padding: 20px; }\nbutton { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }`,
    solutionJs: `let db = [{ id: 1, name: "Root Document" }];\nconst countEl = document.getElementById("record-count");\n\nfunction update() {\n  countEl.textContent = \`Records: \${db.length} (200 OK)\`;\n}\nupdate();\n\ndocument.getElementById("btn-post").addEventListener("click", () => {\n  db.push({ id: Date.now(), name: "New Record" });\n  update();\n  console.log("POST /api/data returned 201 Created:", db);\n});`,
  },
  {
    id: "mern-stack-architecture-rest",
    number: 26,
    title: "Full MERN Stack Integration",
    track: "MERN Stack",
    phase: "Frontend & Full MERN",
    phaseNumber: 4,
    estimatedMinutes: 30,
    difficulty: "Advanced",
    objective: "Unify the entire MERN stack: MongoDB schema, Express API server, React frontend state, and Node runtime in an end-to-end task manager app.",
    conceptGuide: `### The Complete MERN Stack Pipeline
- **MongoDB**: Schema-flexible document database.
- **Express.js**: Node.js web server handling HTTP requests and REST routing.
- **React.js**: Client-side UI framework rendering reactive components.
- **Node.js**: The JavaScript execution environment powering the backend.

\`\`\`
[React Client] <--- JSON over HTTP ---> [Express on Node.js] <--- Mongoose Drivers ---> [MongoDB Cluster]
\`\`\``,
    tryItExample: {
      title: "W3Schools Try-It: MERN Client Simulation",
      description: "Test adding documents to the collection.",
      html: `<div>\n  <input id="new-item" placeholder="Document title" style="padding:6px; border:1px solid #cbd5e1; border-radius:4px;">\n  <button id="add-btn" style="background:#0284c7; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">POST Document</button>\n  <ul id="items-list"></ul>\n</div>`,
      css: `body { font-family: sans-serif; padding: 20px; }`,
      js: `document.getElementById('add-btn').onclick = () => {\n  const val = document.getElementById('new-item').value;\n  if (!val) return;\n  const li = document.createElement('li');\n  li.textContent = val + " (MongoDB _id: " + Math.random().toString(36).substr(2,6) + ")";\n  document.getElementById('items-list').appendChild(li);\n  document.getElementById('new-item').value = "";\n  console.log("Document inserted into simulated collection.");\n};`,
    },
    quizExercise: {
      question: "Which component of the MERN stack acts as the document-based database layer?",
      options: ["Express", "React", "MongoDB", "Node.js"],
      correctIndex: 2,
      explanation: "MongoDB stores JSON-like documents with flexible schemas.",
    },
    exerciseBrief: `Build a complete MERN Task Manager client. Allow creating tasks via #task-input and #create-task-btn, render them inside #task-list, and update #task-count with the total document count.`,
    hints: [
      "Maintain a tasks array: let tasks = [];",
      "Listen to #create-task-btn click, push { title, completed: false, id: Date.now() }, and re-render.",
    ],
    requirements: [
      {
        id: "req-1",
        description: "Contains an input #task-input and button #create-task-btn.",
        testCode: "Boolean(document.getElementById('task-input') && document.getElementById('create-task-btn'))",
      },
      {
        id: "req-2",
        description: "Adding a task inserts a new document item into #task-list.",
        testCode: "(() => { const inp = document.getElementById('task-input'); inp.value = 'Design MongoDB Indexes'; document.getElementById('create-task-btn').click(); return document.getElementById('task-list').textContent.includes('Design MongoDB Indexes'); })()",
      },
      {
        id: "req-3",
        description: "Updates #task-count reflecting the total documents in the collection.",
        testCode: "Boolean(document.getElementById('task-count') && document.getElementById('task-count').textContent.length > 0)",
      },
    ],
    starterHtml: `<div class="mern-app">\n  <div class="mern-header">\n    <div class="mern-badge">MERN Stack · MongoDB + Express + React + Node</div>\n    <h2>Project Task Manager Client</h2>\n  </div>\n\n  <div class="task-form">\n    <input type="text" id="task-input" placeholder="e.g. Design MongoDB Schema for Orders" />\n    <button id="create-task-btn">Create Document (POST) →</button>\n  </div>\n\n  <div class="task-status-bar">\n    <span>API Status: <b style="color: #10b981;">Online (200 OK)</b></span>\n    <span id="task-count">0 Documents in Collection</span>\n  </div>\n\n  <div id="task-list" class="task-list">\n    <!-- Tasks dynamically rendered here -->\n  </div>\n</div>`,
    starterCss: `.mern-app { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; font-family: system-ui, sans-serif; }\n.mern-badge { font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 4px; }\n.task-form { display: flex; gap: 10px; margin-bottom: 16px; }\n.task-form input { flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; }\n.task-form button { background: #ff6a00; color: #ffffff; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; }\n.task-status-bar { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; padding: 8px 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 16px; }\n.task-item { display: flex; justify-content: space-between; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px; }`,
    starterJs: `// MERN Client Simulator\n// TODO: Implement #create-task-btn handler and dynamic render inside #task-list\n`,
    solutionHtml: `<div class="mern-app">\n  <div class="mern-header">\n    <div class="mern-badge">MERN Stack · MongoDB + Express + React + Node</div>\n    <h2>Project Task Manager Client</h2>\n  </div>\n\n  <div class="task-form">\n    <input type="text" id="task-input" placeholder="e.g. Design MongoDB Schema for Orders" />\n    <button id="create-task-btn">Create Document (POST) →</button>\n  </div>\n\n  <div class="task-status-bar">\n    <span>API Status: <b style="color: #10b981;">Online (200 OK)</b></span>\n    <span id="task-count">0 Documents in Collection</span>\n  </div>\n\n  <div id="task-list" class="task-list">\n    <!-- Tasks dynamically rendered here -->\n  </div>\n</div>`,
    solutionCss: `.mern-app { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; font-family: system-ui, sans-serif; }\n.mern-badge { font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase; margin-bottom: 4px; }\n.task-form { display: flex; gap: 10px; margin-bottom: 16px; }\n.task-form input { flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; }\n.task-form button { background: #ff6a00; color: #ffffff; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; }\n.task-status-bar { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; padding: 8px 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 16px; }\n.task-item { display: flex; justify-content: space-between; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px; }`,
    solutionJs: `let tasks = [];\n\nfunction render() {\n  const list = document.getElementById("task-list");\n  const count = document.getElementById("task-count");\n  count.textContent = \`\${tasks.length} Documents in Collection\`;\n  list.innerHTML = tasks.map((t) => \`\n    <div class="task-item">\n      <span>\${t.title}</span>\n      <small style="color: #10b981;">ObjectId(\${t.id})</small>\n    </div>\n  \`).join("");\n}\n\ndocument.getElementById("create-task-btn").addEventListener("click", () => {\n  const input = document.getElementById("task-input");\n  const title = input.value.trim();\n  if (!title) return;\n  tasks.push({ title, id: Date.now().toString(36) });\n  input.value = "";\n  render();\n  console.log("Inserted document into simulated MongoDB collection.");\n});`,
  },
];

export function getWebDevLessonById(id: string): WebDevLesson | undefined {
  return WEB_DEV_LESSONS.find((lesson) => lesson.id === id);
}

export function getAllWebDevLessons(): WebDevLesson[] {
  return WEB_DEV_LESSONS;
}
