# 📄 MDView

### A lightweight, zero-dependency Markdown renderer for the browser

[![Version](https://img.shields.io/badge/version-1.0.0-2563eb?style=for-the-badge)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-0-22c55e?style=for-the-badge)](#)
[![Build](https://img.shields.io/badge/build%20step-none-8b5cf6?style=for-the-badge)](#)
[![Dark Mode](https://img.shields.io/badge/dark%20mode-supported-0f172a?style=for-the-badge)](#27--dark-theme)
[![Browsers](https://img.shields.io/badge/browsers-Chrome%20%7C%20Edge%20%7C%20Firefox%20%7C%20Safari-f59e0b?style=for-the-badge)](#37--browser-compatibility)
[![Security](https://img.shields.io/badge/HTML-escaped%20by%20default-ef4444?style=for-the-badge)](#32--security)

MDView converts Markdown text or `.md` files into clean, styled HTML and ships with a **responsive, GitHub-inspired stylesheet**. No npm. No Node.js. No framework. Just two files.

**Version:** `1.0.0`

---

## ✨ Highlights

| | Feature | Description |
| :---: | --- | --- |
| ⚡ | **Zero dependencies** | Plain HTML, CSS and JavaScript |
| 🎨 | **Modern styling** | Responsive, GitHub-inspired stylesheet |
| 🌙 | **Automatic dark mode** | Follows `prefers-color-scheme` |
| 🔒 | **Safe by default** | Raw HTML escaped, URLs sanitized |
| 📱 | **Mobile friendly** | Scrollable tables, responsive images |
| 🧩 | **Tiny API** | Four methods, easy to learn |

---

## 📚 Table of Contents

| # | Section | # | Section |
| :---: | --- | :---: | --- |
| 1 | [What is MDView?](#1--what-is-mdview) | 21 | [Task Lists](#21--task-lists) |
| 2 | [Installation](#2--installation) | 22 | [Blockquotes](#22--blockquotes) |
| 3 | [First Page](#3--your-first-markdown-page) | 23 | [Horizontal Rules](#23--horizontal-rules) |
| 4 | [Local Files](#4--running-a-local-markdown-file) | 24 | [Tables](#24--tables) |
| 5 | [API](#5--api) | 25 | [Autolinks](#25--autolinks) |
| 6 | [`mount()`](#6--mdviewmount) | 26 | [Styling](#26--styling) |
| 7 | [`renderFile()`](#7--mdviewrenderfile) | 27 | [Dark Theme](#27--dark-theme) |
| 8 | [`create()`](#8--mdviewcreate) | 28 | [Documentation Site](#28--building-a-documentation-website) |
| 9 | [Options](#9--options) | 29 | [Navigation](#29--documentation-navigation) |
| 10 | [Supported Markdown](#10--supported-markdown) | 30 | [Error Handling](#30--error-handling) |
| 11–15 | [Text Formatting](#11--paragraphs) | 31 | [Remote Markdown](#31--loading-markdown-from-a-different-server) |
| 16 | [Code Blocks](#16--code-blocks) | 32 | [Security](#32--security) |
| 17 | [Links](#17--links) | 33 | [SPA Usage](#33--using-mdview-with-a-spa) |
| 18 | [Images](#18--images) | 34 | [Static Hosting](#34--cdn--static-hosting) |
| 19 | [Unordered Lists](#19--unordered-lists) | 35 | [Performance](#35--performance) |
| 20 | [Ordered Lists](#20--ordered-lists) | 36–40 | [Examples, Compatibility, Reference, License](#36--example-complete-documentation-page) |

---

## 1 · 🧭 What is MDView?

MDView is built for projects that need Markdown documentation **without installing a large framework**.

**Typical uses**

- 📖 Documentation pages
- 📝 README viewers
- 🚀 Project showcases
- ✍️ Blog and article pages
- 🗒️ Changelogs
- 💬 Help centers
- 🌐 Static websites
- 👤 Developer portfolios

**How it works**

```text
Markdown file  ──►  MDView  ──►  HTML  ──►  mdview.css  ──►  Styled documentation page
```

---

## 2 · 📦 Installation

> **ℹ️ Note**
> MDView does not require npm, Node.js, React, Vue, or any build tool.

**Step 1.** Download these two files:

```text
mdview.js
mdview.css
```

**Step 2.** Place them in your project:

```text
my-project/
├── index.html
├── mdview.js
└── mdview.css
```

**Step 3.** Include them in your HTML:

```html
<link rel="stylesheet" href="mdview.css">

<script src="mdview.js"></script>
```

---

## 3 · 🚀 Your First Markdown Page

Create a Markdown file named `README.md`:

```md
# My Project

Welcome to **my project**.

This is a Markdown document rendered by MDView.
```

Then create your HTML:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>My Documentation</title>

  <link rel="stylesheet" href="mdview.css">
</head>
<body>

  <main id="markdown"></main>

  <script src="mdview.js"></script>

  <script>
    MDView.renderFile("README.md", "#markdown");
  </script>

</body>
</html>
```

> **✅ Done**
> That's all it takes to render the Markdown file.

---

## 4 · ⚠️ Running a Local Markdown File

When you use:

```js
MDView.renderFile("README.md", "#markdown");
```

the browser uses `fetch()` to request the file. Because of browser security rules, opening the HTML directly via `file:///...` may prevent the `.md` file from loading.

> **⚠️ Warning**
> Use a local HTTP server instead of opening the file directly.

**Python** (inside your project folder):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

**VS Code:** use a local development server extension such as **Live Server**.

---

## 5 · 🔌 API

MDView exposes four main methods:

| Method | Purpose |
| --- | --- |
| `MDView.render(markdown, options)` | Convert Markdown to an HTML string |
| `MDView.mount(target, markdown, options)` | Render Markdown into a DOM element |
| `MDView.renderFile(file, target, options)` | Fetch a `.md` file and render it |
| `MDView.create(target, options)` | Create a reusable renderer instance |

### 5.1 · `MDView.render()`

Converts Markdown into an HTML string.

```js
const markdown = `
# Hello

This is **Markdown**.
`;

const html = MDView.render(markdown);

document.querySelector("#markdown").innerHTML = html;
```

> **💡 Tip**
> For most users, [`MDView.mount()`](#6--mdviewmount) is easier.

---

## 6 · 🧱 `MDView.mount()`

Renders Markdown directly into an HTML element. Pass a selector or a DOM element.

```js
MDView.mount("#markdown", "# Hello");

const element = document.querySelector("#markdown");
MDView.mount(element, "# Hello");
```

**Full example**

```html
<div id="markdown"></div>

<script>
  MDView.mount(
    "#markdown",
    `
# Project Documentation

This page is **powered by MDView**.
`
  );
</script>
```

---

## 7 · 📥 `MDView.renderFile()`

Loads a Markdown file with `fetch()` and renders it.

```js
await MDView.renderFile("README.md", "#markdown");
```

**With error handling**

```js
async function loadDocs() {
  try {
    await MDView.renderFile("docs/getting-started.md", "#markdown");
  } catch (error) {
    console.error(error);
  }
}

loadDocs();
```

**Directory layout**

```text
project/
├── index.html
├── mdview.js
├── mdview.css
└── docs/
    ├── getting-started.md
    ├── installation.md
    └── api.md
```

```js
MDView.renderFile("docs/api.md", "#markdown");
```

---

## 8 · ♻️ `MDView.create()`

Use `create()` when you have **one documentation container** you want to reuse.

```js
const docs = MDView.create("#markdown");

docs.render("# Hello");
await docs.renderFile("README.md");
```

**Wired to buttons**

```js
const docs = MDView.create("#markdown");

document.querySelector("#home").addEventListener("click", () => {
  docs.render("# Welcome");
});

document.querySelector("#api").addEventListener("click", async () => {
  await docs.renderFile("docs/api.md");
});
```

---

## 9 · ⚙️ Options

All render methods accept an options object.

```js
MDView.mount("#markdown", markdown, {
  breaks: true,
  allowHtml: false
});
```

**Defaults**

```js
{
  gfm: true,
  breaks: false,
  allowHtml: false,
  sanitizeUrls: true,
  className: "mdview-body"
}
```

| Option | Type | Default | Description |
| --- | :---: | :---: | --- |
| `gfm` | `boolean` | `true` | GitHub-Flavored Markdown mode (reserved for future parser extensions) |
| `breaks` | `boolean` | `false` | Render single line breaks in paragraphs as `<br>` |
| `allowHtml` | `boolean` | `false` | Allow raw HTML from Markdown to be inserted |
| `sanitizeUrls` | `boolean` | `true` | Block dangerous link protocols |
| `className` | `string` | `"mdview-body"` | CSS class applied to the rendered container |

### `breaks`

```js
MDView.mount("#markdown", markdown, { breaks: true });
```

With `breaks: true`, normal Markdown line breaks are rendered as `<br>`.

### `allowHtml`

With the recommended default `allowHtml: false`, this input:

```md
<script>alert("test")</script>
```

is **escaped instead of executed**.

> **🔴 Caution**
> Only set `allowHtml: true` for Markdown you fully trust.

### `sanitizeUrls`

Helps prevent dangerous link protocols from being inserted as normal links. Keep it set to `true`.

### `className`

```js
MDView.mount("#docs", markdown, {
  className: "my-document"
});
```

> **ℹ️ Note**
> If you change the class, make sure your CSS targets the new class or extends the included stylesheet.

---

## 10 · 📝 Supported Markdown

MDView supports all the common Markdown features.

### Headings

```md
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

Headings receive IDs automatically:

```md
# Getting Started
```

becomes:

```html
<h1 id="getting-started">Getting Started</h1>
```

This allows anchor links such as `#getting-started`.

---

## 11 · Paragraphs

```md
This is a paragraph.

This is another paragraph.
```

## 12 · Bold

```md
**Bold text**
__Bold text__
```

## 13 · Italic

```md
*Italic text*
_Italic text_
```

## 14 · Strikethrough

```md
~~Deleted text~~
```

## 15 · Inline Code

```md
Use `console.log()` to print something.
```

---

## 16 · 💻 Code Blocks

Use fenced code blocks:

````md
```js
const message = "Hello";

console.log(message);
```
````

The language name is preserved as a class:

```html
<code class="language-js">
```

> **💡 Tip**
> MDView has no built-in syntax highlighter, but you can connect the generated blocks to **Prism** or **Highlight.js**.

---

## 17 · 🔗 Links

```md
[Open GitHub](https://github.com/)
```

MDView creates an external link with:

```html
target="_blank"
rel="noopener noreferrer"
```

---

## 18 · 🖼️ Images

```md
![Project logo](images/logo.png)

![Project logo](images/logo.png "My project")
```

Images are **responsive** (`max-width: 100%; height: auto;`) and **lazy-loaded**.

---

## 19 · Unordered Lists

```md
- HTML
- CSS
- JavaScript
- Supabase
```

## 20 · Ordered Lists

```md
1. Install MDView
2. Add the CSS
3. Add the JavaScript
4. Render your Markdown
```

## 21 · ☑️ Task Lists

```md
- [x] Build parser
- [x] Add CSS
- [ ] Add syntax highlighting
```

Checked items become disabled checkboxes.

## 22 · 💬 Blockquotes

```md
> Markdown is simple.
>
> Documentation should be simple too.
```

## 23 · ➖ Horizontal Rules

```md
---
***
___
```

---

## 24 · 📊 Tables

```md
| Feature | Status |
| --- | :---: |
| Markdown | ✅ |
| CSS | ✅ |
| Dependencies | None |
```

Column alignment is supported:

```md
| Left | Center | Right |
| :--- | :---: | ---: |
| A | B | C |
```

Tables scroll horizontally on small screens.

## 25 · 🌍 Autolinks

```md
https://github.com/

<https://github.com/>
```

Both forms become clickable links.

---

## 26 · 🎨 Styling

The included stylesheet is `mdview.css` and the main class is `.mdview-body`. Customize it with normal CSS:

```css
.mdview-body {
  max-width: 1100px;
  font-size: 17px;
}

.mdview-body h1 {
  letter-spacing: -0.03em;
}

.mdview-body a {
  font-weight: 600;
}
```

## 27 · 🌙 Dark Theme

MDView already responds to `prefers-color-scheme: dark`, so the page switches automatically when the OS or browser uses dark mode.

To override it:

```css
@media (prefers-color-scheme: dark) {
  .mdview-body {
    background: #0b0f14;
    color: #e6edf3;
  }
}
```

---

## 28 · 🏗️ Building a Documentation Website

```text
docs-site/
├── index.html
├── mdview.js
├── mdview.css
└── docs/
    ├── introduction.md
    ├── installation.md
    ├── api.md
    └── examples.md
```

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>My Docs</title>

  <link rel="stylesheet" href="mdview.css">
</head>

<body>

  <main id="markdown"></main>

  <script src="mdview.js"></script>

  <script>
    MDView.renderFile("docs/introduction.md", "#markdown");
  </script>

</body>
</html>
```

## 29 · 🧭 Documentation Navigation

Combine MDView with your own sidebar:

```html
<div class="docs-layout">

  <aside>
    <button onclick="loadDoc('docs/introduction.md')">Introduction</button>
    <button onclick="loadDoc('docs/installation.md')">Installation</button>
    <button onclick="loadDoc('docs/api.md')">API</button>
  </aside>

  <main id="markdown"></main>

</div>

<script>
  async function loadDoc(file) {
    await MDView.renderFile(file, "#markdown");
  }

  loadDoc("docs/introduction.md");
</script>
```

This turns MDView into a simple documentation engine.

---

## 30 · 🛠️ Error Handling

`renderFile()` returns a Promise, so use `try...catch`:

```js
async function loadDocs() {
  try {
    await MDView.renderFile("docs/intro.md", "#markdown");
  } catch (error) {
    console.error(error);

    document.querySelector("#markdown").innerHTML = `
      <p>Unable to load the documentation.</p>
    `;
  }
}

loadDocs();
```

**Common problems**

| Problem | Fix |
| --- | --- |
| Wrong Markdown path | Check the file path |
| Missing file / HTTP 404 | Make sure the file exists on the server |
| Running from `file://` | Use a [local HTTP server](#4--running-a-local-markdown-file) |
| Server / CORS issues | Check the server's CORS configuration |

## 31 · 🌐 Loading Markdown from a Different Server

```js
MDView.renderFile(
  "https://example.com/docs/README.md",
  "#markdown"
);
```

> **ℹ️ Note**
> The remote server must allow the browser request. For cross-origin requests, it may need an appropriate CORS header.

---

## 32 · 🔒 Security

MDView is **safe by default** for normal Markdown content.

| Setting | Default | Effect |
| --- | :---: | --- |
| `allowHtml` | `false` | Raw HTML is escaped, not executed |
| `sanitizeUrls` | `true` | Dangerous link protocols are blocked |

For example, this Markdown:

```md
<img src=x onerror=alert(1)>
```

is treated as text instead of being inserted as active HTML.

> **🔴 Important**
> No Markdown parser should be treated as a complete security boundary for untrusted application data. For user-generated Markdown in production, add server-side validation or sanitization and a **Content Security Policy**.
>
> Never enable `allowHtml: true` for arbitrary untrusted content unless you have your own sanitization layer.

---

## 33 · ⚛️ Using MDView with a SPA

MDView can be used inside React, Vue, Svelte, or other applications. The simplest approach is to give it a DOM element:

```js
MDView.mount(element, markdown);
```

> **⚠️ Warning**
> Make sure the framework is not simultaneously controlling the same element's `innerHTML`.

## 34 · ☁️ CDN / Static Hosting

MDView needs no build process. Host `mdview.js` and `mdview.css` on any static provider:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Your own web server

```html
<link rel="stylesheet" href="/assets/mdview.css">
<script src="/assets/mdview.js"></script>
```

## 35 · ⚡ Performance

MDView is intentionally small and browser-focused. A normal page only needs:

```text
mdview.js
mdview.css
your-file.md
```

**No runtime dependency on:** Node.js · npm · React · Vue · jQuery · a backend server.

Markdown conversion happens entirely in the browser.

---

## 36 · 🧪 Example: Complete Documentation Page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Project Docs</title>

  <link rel="stylesheet" href="mdview.css">

  <style>
    body {
      margin: 0;
      background: #f6f8fa;
    }

    .docs {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 240px minmax(0, 980px);
      justify-content: center;
      gap: 24px;
    }

    .sidebar {
      padding: 32px 0;
    }

    .sidebar a {
      display: block;
      padding: 8px 12px;
      color: inherit;
      text-decoration: none;
    }

    @media (max-width: 900px) {
      .docs {
        display: block;
      }

      .sidebar {
        padding: 16px;
      }
    }
  </style>
</head>

<body>

  <div class="docs">

    <aside class="sidebar">
      <strong>My Project</strong>

      <a href="#" onclick="loadDoc('docs/introduction.md'); return false;">Introduction</a>
      <a href="#" onclick="loadDoc('docs/installation.md'); return false;">Installation</a>
      <a href="#" onclick="loadDoc('docs/api.md'); return false;">API</a>
    </aside>

    <main id="markdown"></main>

  </div>

  <script src="mdview.js"></script>

  <script>
    async function loadDoc(file) {
      try {
        await MDView.renderFile(file, "#markdown");
      } catch (error) {
        console.error(error);
      }
    }

    loadDoc("docs/introduction.md");
  </script>

</body>
</html>
```

---

## 37 · 🌍 Browser Compatibility

MDView uses modern browser APIs: `fetch()`, `Promise`, `URL`, `classList`, and modern JavaScript syntax.

| Browser | Support |
| --- | :---: |
| Chrome | ✅ |
| Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |

## 38 · 📌 API Quick Reference

| Method | Purpose |
| --- | --- |
| `MDView.render(markdown, options)` | Convert Markdown to an HTML string |
| `MDView.mount(target, markdown, options)` | Render Markdown into a DOM element |
| `MDView.renderFile(file, target, options)` | Fetch a `.md` file and render it |
| `MDView.create(target, options)` | Create a reusable renderer instance |

## 39 · 🏁 Recommended Starting Point

**Simple Markdown viewer**

```html
<link rel="stylesheet" href="mdview.css">

<main id="markdown"></main>

<script src="mdview.js"></script>

<script>
  MDView.renderFile("README.md", "#markdown");
</script>
```

**Inline Markdown**

```js
MDView.mount("#markdown", "# Hello\n\nThis is **MDView**.");
```

**Larger documentation site**

```js
const docs = MDView.create("#markdown");

await docs.renderFile("docs/introduction.md");
```

## 40 · 📄 License

Use the project according to the license included with your MDView distribution. For your own fork or project, place your preferred license in the repository.

---

## 🧾 MDView at a Glance

```text
Zero dependencies
        +
Browser-native
        +
Markdown files
        +
GitHub-inspired CSS
        +
Small API
        =
Simple documentation renderer
```

**Made for simple, beautiful documentation.** ⭐
