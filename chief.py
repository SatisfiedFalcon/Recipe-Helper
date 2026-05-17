"""
╔══════════════════════════════════════════════╗
║              C H I E F                       ║
║   Your Recipe Content Agent                  ║
║   Keeps RecipeHelper.com fresh & updated     ║
╚══════════════════════════════════════════════╝

Chief finds new recipes, updates images, and adds
alternative ingredients/methods to your site automatically.
Talk to him like a normal chat — he understands plain English.

Setup:
    pip install anthropic schedule

Set API key:
    Windows  : set ANTHROPIC_API_KEY=your_key_here
    Mac/Linux: export ANTHROPIC_API_KEY=your_key_here

Run:
    python chief.py
"""

import anthropic
import json
import os
import re
import time
import schedule
import threading
from datetime import datetime
from pathlib import Path

# ── Config ─────────────────────────────────────────────────────────────────
API_KEY   = os.environ.get("ANTHROPIC_API_KEY", "YOUR_API_KEY_HERE")
APP_JS    = Path("app.js")
BACKUP_DIR = Path("backups")

AUTO_RECIPES_PER_RUN    = 2       # recipes added on each automatic run
AUTO_SCHEDULE_FREQUENCY = "daily" # "hourly" | "daily" | "weekly"

RECIPE_TOPICS = [
    "South African braai and traditional dishes",
    "quick 30-minute chicken dinners",
    "easy vegan and vegetarian meals",
    "popular Italian pasta dishes",
    "healthy Asian stir-fry recipes",
    "budget-friendly family meals under $5",
    "seafood and fish recipes",
    "Mexican street food and tacos",
    "Indian curry and spice dishes",
    "French bistro classics",
    "Mediterranean salads and mezze",
    "easy breakfast and brunch ideas",
    "classic American comfort food",
    "homemade soups and stews",
    "quick desserts and bakes",
]

client = anthropic.Anthropic(api_key=API_KEY)
_topic_index = 0

# ── Helpers ─────────────────────────────────────────────────────────────────

def get_next_id(text: str) -> int:
    ids = [int(x) for x in re.findall(r'\bid\s*:\s*(\d+)', text)]
    return max(ids, default=0) + 1

def backup_app_js():
    if not APP_JS.exists(): return
    BACKUP_DIR.mkdir(exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    (BACKUP_DIR / f"app.js.{ts}.bak").write_text(
        APP_JS.read_text(encoding="utf-8"), encoding="utf-8")

def inject_meals(new_meals: list):
    text = APP_JS.read_text(encoding="utf-8")
    snippets = []
    for m in new_meals:
        snippet = f"""  {{
    id:{m['id']}, name:{json.dumps(m['name'])}, cuisine:{json.dumps(m['cuisine'])},
    time:{json.dumps(m['time'])}, diff:{json.dumps(m['diff'])}, cost:{json.dumps(m['cost'])},
    emoji:{json.dumps(m['emoji'])}, trending:false, featured:false,
    tags:{json.dumps(m['tags'])},
    img:{json.dumps(m.get('img',''))},
    description:{json.dumps(m['description'])},
    ingredients:{json.dumps(m['ingredients'])},
    steps:{json.dumps(m['steps'])},
    noOven:{json.dumps(m.get('noOven','Stovetop works well for this recipe.'))},
    noStove:{json.dumps(m.get('noStove','Microwave can be used as an alternative.'))},
    subs:{json.dumps(m.get('subs',[]))},
    reviews:[],
  }}"""
        snippets.append(snippet)

    meals_start = text.find("const MEALS = [")
    if meals_start == -1:
        raise ValueError("Cannot find MEALS array in app.js")
    depth, i = 0, text.find("[", meals_start)
    while i < len(text):
        if text[i] == "[": depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                APP_JS.write_text(
                    text[:i] + ",\n" + ",\n".join(snippets) + "\n" + text[i:],
                    encoding="utf-8")
                return
        i += 1
    raise ValueError("Cannot find end of MEALS array")

def update_recipe_field(recipe_id: int, field: str, value):
    """Update a single field on an existing recipe in app.js."""
    text = APP_JS.read_text(encoding="utf-8")
    # Find the recipe block by id
    pattern = rf'(id\s*:\s*{recipe_id}\s*,.*?)(reviews\s*:\s*\[.*?\]\s*,?\s*\}})'
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return False

    # Replace the specific field
    field_pattern = rf'{field}\s*:\s*(?:\'[^\']*\'|"[^"]*"|\[.*?\])'
    new_value_str = json.dumps(value)
    new_text = re.sub(field_pattern, f'{field}:{new_value_str}', text, count=1, flags=re.DOTALL)
    if new_text != text:
        APP_JS.write_text(new_text, encoding="utf-8")
        return True
    return False

EMOJI_MAP = {
    "pasta":"🍝","pizza":"🍕","rice":"🍚","ramen":"🍜","noodle":"🍜",
    "soup":"🥣","stew":"🥘","salad":"🥗","burger":"🍔","sandwich":"🥪",
    "taco":"🌮","curry":"🍛","chicken":"🍗","beef":"🥩","fish":"🐟",
    "seafood":"🦐","egg":"🍳","bread":"🍞","cake":"🎂","dessert":"🍰",
    "breakfast":"🥞","braai":"🔥","bbq":"🔥","grill":"🔥",
    "vegetable":"🥦","vegan":"🥗","pork":"🥩","lamb":"🍖",
}
CUISINE_MAP = {
    "italian":"Italian","asian":"Asian","japanese":"Asian","chinese":"Asian",
    "korean":"Asian","thai":"Asian","vietnamese":"Asian","american":"American",
    "french":"French","mediterranean":"Mediterranean","greek":"Mediterranean",
    "lebanese":"Mediterranean","moroccan":"Mediterranean","mexican":"Mexican",
    "indian":"Indian","south african":"Mediterranean","african":"Mediterranean",
}

def pick_emoji(name, cuisine=""):
    combined = (name+" "+cuisine).lower()
    for k, v in EMOJI_MAP.items():
        if k in combined: return v
    return "🍽️"

def norm_cuisine(raw):
    key = raw.lower().strip()
    for k, v in CUISINE_MAP.items():
        if k in key: return v
    return "Mediterranean"

def norm_diff(raw):
    r = raw.lower()
    if any(w in r for w in ["begin","easy"]): return "beginner"
    if any(w in r for w in ["inter","medium"]): return "intermediate"
    if any(w in r for w in ["pro","hard","adv"]): return "pro"
    return "intermediate"

def build_meal(raw, meal_id):
    diff    = norm_diff(raw.get("difficulty","intermediate"))
    cuisine = norm_cuisine(raw.get("cuisine",""))
    name    = raw.get("name","New Recipe")
    time_str = raw.get("time","30 min")
    tags = [diff]
    try:
        if int(re.search(r'\d+', time_str).group()) <= 20: tags.append("quick")
    except: pass
    try:
        if float(re.search(r'[\d.]+', raw.get("cost","$5")).group()) <= 3: tags.append("budget")
    except: pass
    return {
        "id":          meal_id,
        "name":        name,
        "cuisine":     cuisine,
        "time":        time_str,
        "diff":        diff,
        "cost":        raw.get("cost","$4"),
        "emoji":       pick_emoji(name, raw.get("cuisine","")),
        "trending":    False,
        "featured":    False,
        "tags":        tags,
        "img":         raw.get("img",""),
        "description": raw.get("description",""),
        "ingredients": raw.get("ingredients",[]),
        "steps":       raw.get("steps",[]),
        "noOven":      raw.get("noOven",""),
        "noStove":     raw.get("noStove",""),
        "subs":        raw.get("subs",[]),
    }

# ── Tools ────────────────────────────────────────────────────────────────────

TOOLS = [
    {"name":"web_search","type":"web_search_20250305"},
    {
        "name": "add_recipe",
        "description": "Add a new recipe to the RecipeHelper website. Include COMPLETE ingredients and FULL step-by-step instructions.",
        "input_schema": {
            "type":"object",
            "properties": {
                "name":        {"type":"string"},
                "cuisine":     {"type":"string","description":"Italian, Asian, American, French, Mediterranean, Mexican, Indian"},
                "time":        {"type":"string","description":"e.g. '25 min'"},
                "difficulty":  {"type":"string","enum":["beginner","intermediate","pro"]},
                "cost":        {"type":"string","description":"e.g. '$3'"},
                "img":         {"type":"string","description":"Direct image URL from Unsplash or similar — must end in jpg/png and be publicly accessible"},
                "description": {"type":"string","description":"2-3 vivid sentences with cultural background"},
                "ingredients": {"type":"array","items":{"type":"string"}},
                "steps":       {"type":"array","items":{"type":"string"}},
                "noOven":      {"type":"string"},
                "noStove":     {"type":"string"},
                "subs":        {"type":"array","items":{"type":"string"}},
            },
            "required":["name","cuisine","time","difficulty","cost","description","ingredients","steps"]
        }
    },
    {
        "name": "update_recipe_image",
        "description": "Update the image URL of an existing recipe by its ID.",
        "input_schema": {
            "type":"object",
            "properties": {
                "recipe_id": {"type":"integer","description":"The id field of the recipe to update"},
                "new_image_url": {"type":"string","description":"New direct image URL — must be publicly accessible"}
            },
            "required":["recipe_id","new_image_url"]
        }
    },
    {
        "name": "update_recipe_alternatives",
        "description": "Update the noOven, noStove, or subs list of an existing recipe.",
        "input_schema": {
            "type":"object",
            "properties": {
                "recipe_id": {"type":"integer"},
                "noOven":    {"type":"string"},
                "noStove":   {"type":"string"},
                "subs":      {"type":"array","items":{"type":"string"}}
            },
            "required":["recipe_id"]
        }
    },
    {
        "name": "report_done",
        "description": "Call this when all tasks are complete to give the user a summary.",
        "input_schema": {
            "type":"object",
            "properties": {
                "summary": {"type":"string","description":"Friendly plain-English summary of what was done"}
            },
            "required":["summary"]
        }
    }
]

SYSTEM_PROMPT = """You are Chief — the recipe content agent for RecipeHelper, a cooking website.

Your personality:
- Friendly, direct, and conversational. Talk like a helpful assistant, not a robot.
- Keep responses short and clear unless detail is needed.
- When you finish a task, give a brief summary of what you did.

Your job:
- Find and add new recipes to the site (searches the web for real, complete recipes)
- Update recipe images with better/newer ones from the web
- Add or improve alternative methods (no-oven, no-stove) and ingredient substitutions
- Always include COMPLETE ingredients with quantities and FULL step-by-step instructions

Rules:
- Never summarise or skip ingredients/steps — users need the full recipe
- Only use publicly accessible image URLs (Unsplash, Pexels, etc.)
- Call report_done at the end of every task with a friendly summary
"""

# ── Agent logic ──────────────────────────────────────────────────────────────

def run_chief_task(user_message: str, conversation_history: list) -> tuple[str, list]:
    """
    Run Chief on a user message. Returns (reply_text, updated_history).
    """
    if not APP_JS.exists():
        return f"⚠️ I can't find app.js. Make sure I'm in the same folder as your site files.", conversation_history

    app_js_text = APP_JS.read_text(encoding="utf-8")
    next_id = get_next_id(app_js_text)
    collected_meals = []
    reply_text = ""

    # Add user message to history
    conversation_history.append({"role":"user","content":user_message})

    messages = list(conversation_history)

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=8192,
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

                if block.name == "web_search":
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":"Search executed."
                    })

                elif block.name == "add_recipe":
                    meal = build_meal(block.input, next_id + len(collected_meals))
                    collected_meals.append(meal)
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":f"Recipe '{meal['name']}' queued (id {meal['id']})."
                    })

                elif block.name == "update_recipe_image":
                    backup_app_js()
                    success = update_recipe_field(
                        block.input["recipe_id"], "img", block.input["new_image_url"])
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":"Image updated." if success else "Recipe ID not found."
                    })

                elif block.name == "update_recipe_alternatives":
                    backup_app_js()
                    inp = block.input
                    rid = inp["recipe_id"]
                    if "noOven"  in inp: update_recipe_field(rid,"noOven",inp["noOven"])
                    if "noStove" in inp: update_recipe_field(rid,"noStove",inp["noStove"])
                    if "subs"    in inp: update_recipe_field(rid,"subs",inp["subs"])
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":"Alternatives updated."
                    })

                elif block.name == "report_done":
                    reply_text = block.input.get("summary","Done!")
                    tool_results.append({
                        "type":"tool_result","tool_use_id":block.id,
                        "content":"Summary delivered."
                    })

        # Write any collected meals
        if collected_meals:
            backup_app_js()
            inject_meals(collected_meals)
            print(f"\n  ✓ Chief injected {len(collected_meals)} recipe(s) into app.js")
            collected_meals = []

        if response.stop_reason == "end_turn":
            break

        messages.append({"role":"assistant","content":assistant_content})
        if tool_results:
            messages.append({"role":"user","content":tool_results})

    # Save assistant reply to history
    if reply_text:
        conversation_history.append({"role":"assistant","content":reply_text})

    return reply_text, conversation_history


# ── Auto-scheduler (background thread) ──────────────────────────────────────

def auto_run():
    global _topic_index
    topic = RECIPE_TOPICS[_topic_index % len(RECIPE_TOPICS)]
    _topic_index += 1
    print(f"\n  [Chief Auto-Run] Topic: {topic}")
    msg = f"Find and add {AUTO_RECIPES_PER_RUN} recipes for: {topic}"
    reply, _ = run_chief_task(msg, [])
    print(f"  [Chief] {reply}")
    print("  → Remember to git push to update your live site.")

def start_auto_schedule():
    if AUTO_SCHEDULE_FREQUENCY == "hourly":
        schedule.every().hour.do(auto_run)
    elif AUTO_SCHEDULE_FREQUENCY == "daily":
        schedule.every().day.at("08:00").do(auto_run)
    elif AUTO_SCHEDULE_FREQUENCY == "weekly":
        schedule.every().monday.at("09:00").do(auto_run)

    def runner():
        while True:
            schedule.run_pending()
            time.sleep(60)

    t = threading.Thread(target=runner, daemon=True)
    t.start()
    print(f"  ✓ Auto-schedule active ({AUTO_SCHEDULE_FREQUENCY})")


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    print("╔══════════════════════════════════════════════╗")
    print("║              C H I E F                       ║")
    print("║   Recipe Content Agent — RecipeHelper        ║")
    print("╚══════════════════════════════════════════════╝")
    print(f"\n  Site file  : {APP_JS.resolve()}")
    print(f"  Auto-runs  : {AUTO_SCHEDULE_FREQUENCY} ({AUTO_RECIPES_PER_RUN} recipes each time)")
    print()
    print("  Examples of what you can say:")
    print("    Add 3 South African braai recipes")
    print("    Find 5 quick vegan meals")
    print("    Update the image for recipe 4")
    print("    Add better alternatives to recipe 9")
    print("    Find me some budget Indian recipes")
    print()
    print("  Type 'quit' to exit.\n")

    start_auto_schedule()

    conversation_history = []

    while True:
        try:
            user_input = input("  You → Chief: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\n  Chief: Later! Your site's in good hands. 👋")
            break

        if user_input.lower() in ("quit","exit","bye","q"):
            print("\n  Chief: Signing off. Site's looking great! 👋")
            break

        if not user_input:
            continue

        print("  Chief: On it...\n")
        reply, conversation_history = run_chief_task(user_input, conversation_history)
        print(f"\n  Chief: {reply}\n")
        print("  ─────────────────────────────────────────────")
        print("  → git add app.js && git commit -m 'Chief update' && git push")
        print()


if __name__ == "__main__":
    main()
