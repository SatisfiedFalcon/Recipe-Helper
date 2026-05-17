"""
╔══════════════════════════════════════════════╗
║              L O K I                         ║
║   Your Web Developer Agent                   ║
║   Rewrites code. Updates design. Fixes bugs. ║
╚══════════════════════════════════════════════╝

Loki is your personal senior web developer. He reads your actual
site code (index.html, style.css, app.js), makes changes on your
command, reports errors in a format you can paste to Claude,
and incorporates new code snippets you receive.

Setup:
    pip install anthropic

Set API key:
    Windows  : set ANTHROPIC_API_KEY=your_key_here
    Mac/Linux: export ANTHROPIC_API_KEY=your_key_here

Run:
    python loki.py

Talk to Loki like a dev:
    "Change the color scheme to dark green and gold"
    "Add a search bar to the browse page"
    "Make the nav sticky and add a shadow on scroll"
    "Incorporate this new code: [paste code here]"
    "Check for errors in my site"
    "Make the recipe cards bigger on mobile"
"""

import anthropic
import json
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────
API_KEY    = os.environ.get("ANTHROPIC_API_KEY", "YOUR_API_KEY_HERE")
SITE_FILES = {
    "index.html": Path("index.html"),
    "style.css":  Path("style.css"),
    "app.js":     Path("app.js"),
}
BACKUP_DIR = Path("backups")

client = anthropic.Anthropic(api_key=API_KEY)


# ── File helpers ──────────────────────────────────────────────────────────────

def read_site_files() -> dict:
    """Read all site files and return as a dict."""
    files = {}
    for name, path in SITE_FILES.items():
        if path.exists():
            files[name] = path.read_text(encoding="utf-8")
        else:
            files[name] = f"[FILE NOT FOUND: {path.resolve()}]"
    return files

def backup_file(filename: str):
    path = SITE_FILES.get(filename)
    if path and path.exists():
        BACKUP_DIR.mkdir(exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        shutil.copy(path, BACKUP_DIR / f"{filename}.{ts}.bak")

def write_file(filename: str, content: str) -> bool:
    path = SITE_FILES.get(filename)
    if not path:
        return False
    backup_file(filename)
    path.write_text(content, encoding="utf-8")
    return True

def patch_file(filename: str, old_snippet: str, new_snippet: str) -> bool:
    """Replace a specific snippet in a file."""
    path = SITE_FILES.get(filename)
    if not path or not path.exists():
        return False
    content = path.read_text(encoding="utf-8")
    if old_snippet not in content:
        return False
    backup_file(filename)
    path.write_text(content.replace(old_snippet, new_snippet, 1), encoding="utf-8")
    return True

def check_site_errors() -> list:
    """Basic static checks for common HTML/JS/CSS issues."""
    errors = []
    files = read_site_files()

    html = files.get("index.html","")
    js   = files.get("app.js","")
    css  = files.get("style.css","")

    # HTML checks
    if html and "[FILE NOT FOUND" not in html:
        open_divs  = html.count("<div")
        close_divs = html.count("</div>")
        if open_divs != close_divs:
            errors.append(f"HTML: Mismatched <div> tags — {open_divs} opening vs {close_divs} closing")
        if "<script src=\"app.js\"" not in html and "<script src='app.js'" not in html:
            errors.append("HTML: app.js script tag not found — your JS may not load")
        if 'href="style.css"' not in html and "href='style.css'" not in html:
            errors.append("HTML: style.css link not found — your styles may not load")

    # JS checks
    if js and "[FILE NOT FOUND" not in js:
        open_br  = js.count("{")
        close_br = js.count("}")
        if abs(open_br - close_br) > 5:
            errors.append(f"JS: Possible missing brace — {open_br} open vs {close_br} close (diff: {abs(open_br-close_br)})")
        # Check for undefined function references in HTML
        js_fns = re.findall(r'function\s+(\w+)\s*\(', js)
        html_calls = re.findall(r'onclick="(\w+)\(', html)
        for call in html_calls:
            if call not in js_fns and call not in ["showPage","toggleSearch","clearSearch","filterBrowse","setBrowseFilter","sendAI","closeModal","switchModalTab","toggleFavModal","openMeal","liveSearch"]:
                errors.append(f"JS: onclick calls '{call}()' but this function isn't found in app.js")

    # CSS checks
    if css and "[FILE NOT FOUND" not in css:
        open_br  = css.count("{")
        close_br = css.count("}")
        if open_br != close_br:
            errors.append(f"CSS: Mismatched braces — {open_br} open vs {close_br} close")

    return errors

def format_error_report(errors: list) -> str:
    """Format errors in a way that's easy to paste to Claude."""
    if not errors:
        return "✅ No errors detected in your site files."

    lines = [
        "═══════════════════════════════════════",
        "  LOKI SITE ERROR REPORT",
        f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "═══════════════════════════════════════",
        "",
        f"  Found {len(errors)} issue(s):",
        "",
    ]
    for i, err in enumerate(errors, 1):
        lines.append(f"  [{i}] {err}")

    lines += [
        "",
        "───────────────────────────────────────",
        "  HOW TO FIX: Copy this entire report",
        "  and paste it to Claude.ai — he will",
        "  give Loki the fix to apply.",
        "═══════════════════════════════════════",
    ]
    return "\n".join(lines)


# ── Tools ─────────────────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "read_site_code",
        "description": "Read the current contents of one or all site files (index.html, style.css, app.js).",
        "input_schema": {
            "type":"object",
            "properties": {
                "filename": {
                    "type":"string",
                    "description":"Which file to read: 'index.html', 'style.css', 'app.js', or 'all'",
                    "enum":["index.html","style.css","app.js","all"]
                }
            },
            "required":["filename"]
        }
    },
    {
        "name": "rewrite_file",
        "description": "Completely rewrite one of the site files with new content. Use this for major redesigns or full file replacements.",
        "input_schema": {
            "type":"object",
            "properties": {
                "filename": {"type":"string","enum":["index.html","style.css","app.js"]},
                "content":  {"type":"string","description":"The complete new file content"}
            },
            "required":["filename","content"]
        }
    },
    {
        "name": "patch_file",
        "description": "Replace a specific snippet of code in a file without rewriting the whole thing. Best for targeted changes.",
        "input_schema": {
            "type":"object",
            "properties": {
                "filename":    {"type":"string","enum":["index.html","style.css","app.js"]},
                "old_snippet": {"type":"string","description":"The exact existing code to find and replace"},
                "new_snippet": {"type":"string","description":"The new code to replace it with"}
            },
            "required":["filename","old_snippet","new_snippet"]
        }
    },
    {
        "name": "check_errors",
        "description": "Run a static analysis check on all site files and return a structured error report.",
        "input_schema": {"type":"object","properties":{},"required":[]}
    },
    {
        "name": "incorporate_code",
        "description": "Take a code snippet provided by the user (e.g. from Claude.ai) and intelligently merge it into the correct site file.",
        "input_schema": {
            "type":"object",
            "properties": {
                "snippet":     {"type":"string","description":"The new code snippet to incorporate"},
                "target_file": {"type":"string","enum":["index.html","style.css","app.js"],"description":"Which file this code belongs in"},
                "insert_after":{"type":"string","description":"Optional: exact text after which to insert the snippet"},
                "description": {"type":"string","description":"What this code does"}
            },
            "required":["snippet","target_file","description"]
        }
    },
    {
        "name": "report_done",
        "description": "Call this when all tasks are complete. Provide a clear report of what was changed.",
        "input_schema": {
            "type":"object",
            "properties": {
                "summary":       {"type":"string","description":"What was done, in plain English"},
                "files_changed": {"type":"array","items":{"type":"string"},"description":"Which files were modified"},
                "next_steps":    {"type":"string","description":"What the user should do next (e.g. push to GitHub)"}
            },
            "required":["summary","files_changed"]
        }
    }
]

SYSTEM_PROMPT = """You are Loki — a senior web developer agent for RecipeHelper, a cooking website.

Your personality:
- Sharp, confident, and technical. You know exactly what you're doing.
- When you make a change, you explain what you did and why in plain English.
- When reporting errors, format them clearly so the user can paste them to Claude.ai for guidance.
- You never break things — always read the code before you patch it.

Your capabilities:
- Read, patch, or fully rewrite index.html, style.css, and app.js
- Change color schemes, fonts, layouts, animations, UI components
- Fix bugs and structural issues
- Incorporate new code snippets from external sources (like Claude.ai) into the site
- Run error checks and produce structured reports

Your workflow:
1. Always READ the relevant file(s) first before making any changes
2. For small targeted changes → use patch_file
3. For major redesigns → use rewrite_file
4. For new feature code given by the user → use incorporate_code
5. Always call report_done at the end with a clear summary

Important rules:
- Never delete MEALS data or CUISINES data from app.js — only modify UI/logic
- Preserve all existing onclick handlers and page IDs in index.html
- When updating colors, update ALL related CSS variables for consistency
- If you spot an error while doing something else, mention it in your report
- Error reports must include the file name, line description, and a paste-ready format

When the user says things like:
- "Change colors to X" → update CSS variables in style.css
- "Add a new section" → patch index.html + style.css + app.js as needed
- "Incorporate this code: [code]" → read current files, find the right place, incorporate cleanly
- "Check for errors" → run check_errors and format the report clearly
- "Make it look more modern" → update CSS with modern design patterns
"""


# ── Agent logic ───────────────────────────────────────────────────────────────

def run_loki_task(user_message: str, conversation_history: list) -> tuple[str, list]:
    reply_text = ""
    conversation_history.append({"role":"user","content":user_message})
    messages = list(conversation_history)

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=16000,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages
        )

        tool_results = []
        assistant_content = response.content

        for block in response.content:
            if block.type == "text" and block.text.strip():
                reply_text = block.text.strip()

            elif block.type == "tool_use":

                if block.name == "read_site_code":
                    fname = block.input.get("filename","all")
                    files = read_site_files()
                    if fname == "all":
                        content_out = "\n\n".join(
                            f"=== {k} ===\n{v}" for k, v in files.items()
                        )
                    else:
                        content_out = files.get(fname, "[not found]")
                    # Trim to avoid context overflow
                    if len(content_out) > 60000:
                        content_out = content_out[:60000] + "\n...[truncated]"
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":content_out
                    })

                elif block.name == "rewrite_file":
                    fname   = block.input["filename"]
                    content = block.input["content"]
                    success = write_file(fname, content)
                    msg = f"✓ {fname} rewritten ({len(content)} chars)." if success else f"✗ Failed to write {fname}."
                    print(f"\n  [Loki] {msg}")
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":msg
                    })

                elif block.name == "patch_file":
                    fname = block.input["filename"]
                    old   = block.input["old_snippet"]
                    new   = block.input["new_snippet"]
                    success = patch_file(fname, old, new)
                    msg = f"✓ {fname} patched." if success else f"✗ Snippet not found in {fname} — patch failed."
                    print(f"\n  [Loki] {msg}")
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":msg
                    })

                elif block.name == "check_errors":
                    errors = check_site_errors()
                    report = format_error_report(errors)
                    print(f"\n{report}")
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":report
                    })

                elif block.name == "incorporate_code":
                    target   = block.input["target_file"]
                    snippet  = block.input["snippet"]
                    after    = block.input.get("insert_after","")
                    desc     = block.input.get("description","")

                    path = SITE_FILES.get(target)
                    if path and path.exists():
                        backup_file(target)
                        current = path.read_text(encoding="utf-8")

                        if after and after in current:
                            new_content = current.replace(after, after + "\n\n" + snippet, 1)
                            path.write_text(new_content, encoding="utf-8")
                            msg = f"✓ Code incorporated into {target} after specified anchor."
                        else:
                            # Append to end of appropriate section
                            if target == "style.css":
                                new_content = current + f"\n\n/* Loki: {desc} */\n{snippet}"
                            elif target == "app.js":
                                new_content = current + f"\n\n/* Loki: {desc} */\n{snippet}"
                            elif target == "index.html":
                                # Insert before closing body tag
                                new_content = current.replace("</body>", f"\n  <!-- Loki: {desc} -->\n{snippet}\n</body>")
                            path.write_text(new_content, encoding="utf-8")
                            msg = f"✓ Code incorporated into {target}."
                    else:
                        msg = f"✗ {target} not found."

                    print(f"\n  [Loki] {msg}")
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":msg
                    })

                elif block.name == "report_done":
                    inp = block.input
                    summary       = inp.get("summary","Done.")
                    files_changed = inp.get("files_changed",[])
                    next_steps    = inp.get("next_steps","Push to GitHub to go live.")

                    report_lines = [
                        "",
                        "╔══════════════════════════════════════════════╗",
                        "║  LOKI REPORT                                 ║",
                        "╚══════════════════════════════════════════════╝",
                        "",
                        f"  {summary}",
                        "",
                    ]
                    if files_changed:
                        report_lines.append(f"  Files modified: {', '.join(files_changed)}")
                    report_lines += [
                        "",
                        f"  Next: {next_steps}",
                        "──────────────────────────────────────────────",
                    ]
                    reply_text = "\n".join(report_lines)
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":"Report delivered."
                    })

        if response.stop_reason == "end_turn":
            break

        messages.append({"role":"assistant","content":assistant_content})
        if tool_results:
            messages.append({"role":"user","content":tool_results})

    if reply_text:
        conversation_history.append({"role":"assistant","content":reply_text})

    return reply_text, conversation_history


# ── CLI ────────────────────────────────────────────────────────────────────────

def main():
    print("╔══════════════════════════════════════════════╗")
    print("║              L O K I                         ║")
    print("║   Web Developer Agent — RecipeHelper         ║")
    print("╚══════════════════════════════════════════════╝")
    print()
    print("  Site files:")
    for name, path in SITE_FILES.items():
        status = "✓" if path.exists() else "✗ NOT FOUND"
        print(f"    {status}  {path.resolve()}")
    print()
    print("  What you can say:")
    print('    "Change the color scheme to dark mode"')
    print('    "Make the hero section taller with a parallax effect"')
    print('    "Add a newsletter signup section at the bottom"')
    print('    "Check my site for errors"')
    print('    "Incorporate this code: [paste code]"')
    print('    "Make recipe cards show cuisine flag and rating"')
    print('    "Update the fonts to something more modern"')
    print()
    print("  When Loki gives you an error report, paste it to Claude.ai")
    print("  and Claude will give you a fix to bring back to Loki.")
    print()
    print("  Type 'quit' to exit.\n")

    conversation_history = []

    while True:
        try:
            user_input = input("  You → Loki: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\n  Loki: Site's locked and loaded. Later. 🔒")
            break

        if user_input.lower() in ("quit","exit","bye","q"):
            print("\n  Loki: Signing off. Site code is clean. 👋")
            break

        if not user_input:
            continue

        print("\n  Loki: Reading your code and getting to work...\n")
        reply, conversation_history = run_loki_task(user_input, conversation_history)
        print(f"\n{reply}\n")
        print("  ─────────────────────────────────────────────")
        print("  → git add . && git commit -m 'Loki update' && git push")
        print()


if __name__ == "__main__":
    main()
