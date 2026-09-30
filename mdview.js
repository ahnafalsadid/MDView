/*!
 * MDView v1.0.0
 * Zero-dependency Markdown renderer for the browser.
 * Supports headings, paragraphs, emphasis, links, images, lists, blockquotes,
 * fenced code blocks, inline code, tables, task lists, horizontal rules,
 * escaping, and .md file loading.
 */
(function (global) {
  "use strict";

  const VERSION = "1.0.0";

  const defaults = {
    gfm: true,
    breaks: false,
    allowHtml: false,
    sanitizeUrls: true,
    className: "mdview-body"
  };

  function mergeOptions(options) {
    return Object.assign({}, defaults, options || {});
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(url) {
    const value = String(url || "").trim();
    if (!defaults.sanitizeUrls) return value;

    try {
      const parsed = new URL(value, global.location.href);
      const protocol = parsed.protocol.toLowerCase();

      if (["http:", "https:", "mailto:", "tel:", "ftp:"].includes(protocol)) {
        return value;
      }

      if (protocol === "blob:" && value.startsWith("blob:")) {
        return value;
      }

      if (value.startsWith("#") || value.startsWith("/") || value.startsWith("./") ||
          value.startsWith("../") || value.startsWith("?")) {
        return value;
      }
    } catch (_) {}

    return "#";
  }

  function normalizeLines(markdown) {
    return String(markdown || "")
      .replace(/\r\n?/g, "\n")
      .replace(/\t/g, "    ")
      .split("\n");
  }

  function parseInline(input, options) {
    let s = String(input || "");

    const stash = [];
    const hold = (html) => {
      const id = `\u0000MDV${stash.length}\u0000`;
      stash.push(html);
      return id;
    };

    // Escape first unless explicit raw HTML is enabled.
    if (!options.allowHtml) {
      s = escapeHtml(s);
    }

    // Images before links.
    s = s.replace(
      /!\[([^\]]*)\]\(\s*<?([^)\s]+)>?(?:\s+["']([^"']*)["'])?\s*\)/g,
      (_, alt, url, title) => {
        const src = safeUrl(unescapeHtml(url));
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return hold(`<img src="${escapeHtml(src)}" alt="${escapeHtml(unescapeHtml(alt))}" loading="lazy"${titleAttr}>`);
      }
    );

    // Links.
    s = s.replace(
      /\[([^\]]+)\]\(\s*<?([^)\s]+)>?(?:\s+["']([^"']*)["'])?\s*\)/g,
      (_, text, url, title) => {
        const href = safeUrl(unescapeHtml(url));
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return hold(`<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`);
      }
    );

    // Autolinks.
    s = s.replace(
      /&lt;(https?:\/\/[^&]+)&gt;/g,
      (_, url) => {
        const href = safeUrl(unescapeHtml(url));
        return hold(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(unescapeHtml(url))}</a>`);
      }
    );

    // Inline code.
    s = s.replace(/`([^`]+)`/g, (_, code) => hold(`<code>${code}</code>`));

    // Strong, emphasis, strikethrough.
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
    s = s.replace(/~~(.+?)~~/g, "<del>$1</del>");
    s = s.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");
    s = s.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, "<em>$1</em>");

    // Bare URLs.
    s = s.replace(
      /(^|[\s(])((?:https?:\/\/|mailto:)[^\s<]+)/g,
      (_, prefix, url) => {
        const clean = url.replace(/[),.;!?]+$/, "");
        const tail = url.slice(clean.length);
        const href = safeUrl(clean);
        return `${prefix}${hold(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(clean)}</a>`)}${tail}`;
      }
    );

    s = s.replace(/\u0000MDV(\d+)\u0000/g, (_, i) => stash[Number(i)]);

    return s;
  }

  function unescapeHtml(value) {
    return String(value)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }

  function isTableSeparator(line) {
    const cells = splitTableRow(line);
    if (cells.length < 1) return false;
    return cells.every(cell => /^:?-{3,}:?$/.test(cell.trim()));
  }

  function splitTableRow(line) {
    let s = line.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);

    const cells = [];
    let current = "";
    let escaped = false;

    for (const char of s) {
      if (char === "\\" && !escaped) {
        escaped = true;
        current += char;
        continue;
      }
      if (char === "|" && !escaped) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
      escaped = false;
    }

    cells.push(current.trim());
    return cells;
  }

  function getHeadingId(text) {
    const plain = unescapeHtml(String(text))
      .replace(/<[^>]+>/g, "")
      .toLowerCase()
      .replace(/&[a-z0-9#]+;/gi, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    return plain || "section";
  }

  function render(markdown, userOptions) {
    const options = mergeOptions(userOptions);
    const lines = normalizeLines(markdown);
    const out = [];
    let i = 0;
    let headingCounts = Object.create(null);

    function addHeading(level, content) {
      const base = getHeadingId(content);
      headingCounts[base] = (headingCounts[base] || 0) + 1;
      const id = headingCounts[base] === 1 ? base : `${base}-${headingCounts[base]}`;
      out.push(`<h${level} id="${escapeHtml(id)}">${parseInline(content, options)}</h${level}>`);
    }

    function isBlank(line) {
      return /^\s*$/.test(line);
    }

    function isBlockStart(line, next) {
      return /^#{1,6}\s+/.test(line) ||
        /^(```|~~~)/.test(line) ||
        /^>\s?/.test(line) ||
        /^(\s{0,3})([-*+]|\d+\.)\s+/.test(line) ||
        /^(\s{0,3})([-*_])(?:\s*\2){2,}\s*$/.test(line) ||
        /^\s*(<https?:\/\/[^>]+>|https?:\/\/\S+)\s*$/.test(line) ||
        (next && isTableSeparator(next));
    }

    while (i < lines.length) {
      const line = lines[i];

      if (isBlank(line)) {
        i++;
        continue;
      }

      // YAML front matter: render as metadata block instead of visible Markdown.
      if (i === 0 && line.trim() === "---") {
        let j = i + 1;
        const meta = [];
        while (j < lines.length && lines[j].trim() !== "---") {
          meta.push(lines[j]);
          j++;
        }
        if (j < lines.length) {
          i = j + 1;
          continue;
        }
      }

      // Fenced code blocks.
      const fence = line.match(/^ {0,3}(```+|~~~+)\s*([^\s]*)\s*$/);
      if (fence) {
        const marker = fence[1];
        const language = fence[2] || "";
        const code = [];
        i++;
        while (i < lines.length && !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}\\s*$`).test(lines[i])) {
          code.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++;

        const langClass = language ? ` class="language-${escapeHtml(language)}"` : "";
        out.push(`<pre><code${langClass}>${escapeHtml(code.join("\n"))}</code></pre>`);
        continue;
      }

      // ATX headings.
      const heading = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (heading) {
        addHeading(heading[1].length, heading[2]);
        i++;
        continue;
      }

      // Horizontal rule.
      if (/^ {0,3}((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})$/.test(line.trim())) {
        out.push("<hr>");
        i++;
        continue;
      }

      // Blockquote.
      if (/^ {0,3}>\s?/.test(line)) {
        const quote = [];
        while (i < lines.length && (/^ {0,3}>\s?/.test(lines[i]) || isBlank(lines[i]))) {
          quote.push(lines[i].replace(/^ {0,3}>\s?/, ""));
          i++;
        }
        out.push(`<blockquote>${render(quote.join("\n"), options)}</blockquote>`);
        continue;
      }

      // Table.
      if (i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const headers = splitTableRow(line);
        const separators = splitTableRow(lines[i + 1]);

        const alignments = separators.map(cell => {
          const c = cell.trim();
          if (c.startsWith(":") && c.endsWith(":")) return "center";
          if (c.startsWith(":")) return "left";
          if (c.endsWith(":")) return "right";
          return "";
        });

        i += 2;
        const rows = [];
        while (i < lines.length && !isBlank(lines[i]) && lines[i].includes("|")) {
          rows.push(splitTableRow(lines[i]));
          i++;
        }

        let table = "<div class=\"mdview-table-wrap\"><table><thead><tr>";
        headers.forEach((cell, index) => {
          const align = alignments[index];
          table += `<th${align ? ` align="${align}"` : ""}>${parseInline(cell.replace(/\\\|/g, "|"), options)}</th>`;
        });
        table += "</tr></thead><tbody>";

        rows.forEach(row => {
          table += "<tr>";
          headers.forEach((_, index) => {
            const cell = row[index] || "";
            const align = alignments[index];
            table += `<td${align ? ` align="${align}"` : ""}>${parseInline(cell.replace(/\\\|/g, "|"), options)}</td>`;
          });
          table += "</tr>";
        });

        table += "</tbody></table></div>";
        out.push(table);
        continue;
      }

      // Ordered/unordered lists with basic nesting.
      const listMatch = line.match(/^ {0,3}([-*+]|\d+[.)])\s+(.+)$/);
      if (listMatch) {
        const ordered = /^\d/.test(listMatch[1]);
        const baseIndent = line.match(/^\s*/)[0].length;
        const items = [];

        while (i < lines.length) {
          const m = lines[i].match(/^(\s*)([-*+]|\d+[.)])\s+(.+)$/);
          if (!m) break;
          const indent = m[1].length;
          if (indent < baseIndent) break;
          if (indent > baseIndent) break;

          let item = m[3];
          let checked = null;

          const task = item.match(/^\[([ xX])\]\s+(.*)$/);
          if (task) {
            checked = task[1].toLowerCase() === "x";
            item = task[2];
          }

          items.push({ item, checked });
          i++;

          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
            item += `\n${lines[i].trim()}`;
            i++;
          }
        }

        const tag = ordered ? "ol" : "ul";
        let html = `<${tag}>`;

        for (const item of items) {
          let body = item.item.replace(/\n+/g, "<br>");
          body = parseInline(body, options);
          if (item.checked !== null) {
            body = `<label class="mdview-task"><input type="checkbox" disabled${item.checked ? " checked" : ""}> <span>${body}</span></label>`;
          }
          html += `<li>${body}</li>`;
        }

        html += `</${tag}>`;
        out.push(html);
        continue;
      }

      // Indented code block.
      if (/^( {4}|\t)/.test(line)) {
        const code = [];
        while (i < lines.length && (/^( {4}|\t)/.test(lines[i]) || isBlank(lines[i]))) {
          code.push(lines[i].replace(/^( {4}|\t)/, ""));
          i++;
        }
        out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        continue;
      }

      // Raw HTML.
      if (options.allowHtml && /^ {0,3}<([a-z][\w-]*)(?:\s|>)/i.test(line)) {
        const htmlLines = [];
        while (i < lines.length && !isBlank(lines[i])) {
          htmlLines.push(lines[i]);
          i++;
        }
        out.push(htmlLines.join("\n"));
        continue;
      }

      // Paragraph.
      const paragraph = [line];
      i++;
      while (i < lines.length && !isBlank(lines[i]) && !isBlockStart(lines[i], lines[i + 1])) {
        paragraph.push(lines[i]);
        i++;
      }

      let paragraphHtml = parseInline(paragraph.join(options.breaks ? "<br>" : "\n"), options);
      if (!options.breaks) paragraphHtml = paragraphHtml.replace(/\n/g, "\n");
      out.push(`<p>${paragraphHtml}</p>`);
    }

    return out.join("\n");
  }

  function mount(target, markdown, options) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) throw new Error(`MDView: target not found: ${target}`);

    const opts = mergeOptions(options);
    element.classList.add(opts.className);
    element.innerHTML = render(markdown, opts);
    return element;
  }

  async function renderFile(file, target, options) {
    const opts = mergeOptions(options);
    const response = await fetch(file, {
      headers: { Accept: "text/markdown,text/plain,*/*" }
    });

    if (!response.ok) {
      throw new Error(`MDView: failed to load "${file}" (${response.status} ${response.statusText})`);
    }

    const markdown = await response.text();
    return mount(target, markdown, opts);
  }

  function create(element, options) {
    const opts = mergeOptions(options);
    return {
      element: typeof element === "string" ? document.querySelector(element) : element,
      render(markdown) {
        return mount(this.element, markdown, opts);
      },
      async renderFile(file) {
        return renderFile(file, this.element, opts);
      }
    };
  }

  global.MDView = {
    version: VERSION,
    defaults,
    escapeHtml,
    render,
    mount,
    renderFile,
    create
  };
})(window);
