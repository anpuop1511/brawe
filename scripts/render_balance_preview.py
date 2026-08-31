from collections import Counter
from html import escape
from pathlib import Path

from create_next_normal_balance_doc import ROLES


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "next_normal_balance" / "balance-preview.html"

VERDICT_COLORS = {
    "BUFF": ("#eaf6ee", "#187945"),
    "NERF": ("#fcebec", "#b52d37"),
    "ADJUST": ("#fff4e5", "#a15c00"),
    "FIX": ("#fff4e5", "#a15c00"),
    "REWORK": ("#f3eafb", "#6d3fb2"),
    "HOLD": ("#f2f4f7", "#5c6b7e"),
}


def row_html(row):
    name, verdict, change, why = row
    fill, color = VERDICT_COLORS[verdict]
    return (
        "<tr>"
        f"<td class='name'>{escape(name)}</td>"
        f"<td class='verdict' style='background:{fill};color:{color}'>{verdict}</td>"
        f"<td>{escape(change)}</td>"
        f"<td>{escape(why)}</td>"
        "</tr>"
    )


all_rows = [row for rows in ROLES.values() for row in rows]
counts = Counter(row[1] for row in all_rows)
summary_order = ["BUFF", "NERF", "ADJUST", "FIX", "HOLD", "REWORK"]

pages = ["""
<section class='page cover'>
  <div class='kicker'>BALANCE PROPOSAL</div>
  <h1>Next Normal<br>Balance Changes</h1>
  <p class='subtitle'>A complete 69-brawler base-game audit<br>with a reason for every verdict</p>
  <div class='scope'>NORMAL MODES ONLY</div>
  <p>No Tower Transformations, event powers, Trinkets, or Attachies</p>
  <div class='warning'>PROPOSAL ONLY &mdash; NOTHING HERE HAS BEEN APPLIED</div>
</section>
"""]

summary_cards = "".join(
    f"<div class='count' style='border-color:{VERDICT_COLORS[v][1]}'><b>{counts[v]}</b><span>{v}</span></div>"
    for v in summary_order
)
pages.append(f"""
<section class='page'>
  <div class='running'>ARENA FORGE / NEXT NORMAL BALANCE</div>
  <h2>Patch at a glance</h2>
  <p><b>Goal.</b> Reduce unavoidable control, permanent snowballing, and summon overload while improving older base kits that rely on precision or wall geometry.</p>
  <p><b>How to read it.</b> HOLD is an intentional recommendation, not a missing entry. FIX items should ship before numerical tuning, and Robber should remain disabled until the rework is complete.</p>
  <div class='counts'>{summary_cards}</div>
  <h2>Highest-confidence first wave</h2>
  <table><thead><tr><th>Brawler</th><th>Verdict</th><th>Reason</th></tr></thead><tbody>
    <tr><td class='name'>Jetpack</td><td class='verdict fix'>FIX</td><td>End repeat-flight invulnerability before evaluating damage.</td></tr>
    <tr><td class='name'>Relay</td><td class='verdict nerf'>NERF</td><td>Lower Hyper transfer and device HP.</td></tr>
    <tr><td class='name'>Hope</td><td class='verdict nerf'>NERF</td><td>Move the 18% max-HP value into Hypercharge.</td></tr>
    <tr><td class='name'>Splitter</td><td class='verdict nerf'>NERF</td><td>Make the ninth generation coverage, not full burst.</td></tr>
    <tr><td class='name'>Malakor</td><td class='verdict nerf'>NERF</td><td>Cap permanent Hell terrain per owner.</td></tr>
    <tr><td class='name'>Snapper</td><td class='verdict nerf'>NERF</td><td>Reduce unavoidable lobby-wide current-HP damage.</td></tr>
    <tr><td class='name'>Skeleflying</td><td class='verdict nerf'>NERF</td><td>Cap summon pressure and pathfinding load.</td></tr>
    <tr><td class='name'>Minigunnin</td><td class='verdict buff'>BUFF</td><td>Raise the weak unpowered base-kit payoff.</td></tr>
  </tbody></table>
</section>
""")

focus = {
    "Tanks": "survivability windows, transformation reliability, and objective pressure.",
    "Assassins": "access, reaction time, and preventing unavoidable follow-ups.",
    "Marksmen": "lane coverage, accuracy assistance, and reward for precision.",
    "Artillery": "persistent area denial, summon load, and telegraph clarity.",
    "Supports": "team-wide value, protection duration, and stacked utility.",
    "Controllers": "crowd-control uptime, permanent scaling, and entity caps.",
    "Damage Dealers": "base-kit output versus ramp ceilings and sustain.",
    "Skirmishers": "mobility, setup payoff, and snowball mechanics.",
}

for role, rows in ROLES.items():
    pages.append(f"""
<section class='page role-page'>
  <div class='running'>ARENA FORGE / NEXT NORMAL BALANCE</div>
  <h2>{escape(role)} <span>&mdash; {len(rows)} brawlers</span></h2>
  <p class='focus'><b>Normal balance focus:</b> {escape(focus[role])}</p>
  <table class='balance'><thead><tr><th>Brawler</th><th>Verdict</th><th>Proposed normal change</th><th>Why</th></tr></thead>
  <tbody>{''.join(row_html(r) for r in rows)}</tbody></table>
</section>
""")

pages.append("""
<section class='page'>
  <div class='running'>ARENA FORGE / NEXT NORMAL BALANCE</div>
  <h2>Suggested rollout</h2>
  <table><thead><tr><th>Wave</th><th>Contents</th></tr></thead><tbody>
    <tr><td class='name'>1. Behavior safety</td><td>Jetpack and Fight'nFire fixes; summon caps for Skeleflying, Peter Pickle, and Malakor.</td></tr>
    <tr><td class='name'>2. High-confidence nerfs</td><td>Relay, Hope, Splitter, Snapper, Xray, Decayer, and Ice Cream.</td></tr>
    <tr><td class='name'>3. Targeted buffs</td><td>Beast, Chaird, Bowlin Rida, Swimmer, Trapper, Minigunnin, and Bouncin' Balls.</td></tr>
    <tr><td class='name'>4. New-release watch</td><td>Do not touch Fastpass, Freestyle, or Portalo until normal-mode matchup data exists.</td></tr>
    <tr><td class='name'>5. Disabled rework</td><td>Keep Robber unavailable until row count and stolen-ammo caps are rebuilt and tested.</td></tr>
  </tbody></table>
  <p class='recommend'><b>Recommendation:</b> ship the behavior fixes and high-confidence group first. Applying all 69 verdicts at once would make cause-and-effect impossible to read.</p>
</section>
""")

css = """
@page { size: Letter; margin: .72in 1in; }
* { box-sizing: border-box; }
body { margin:0; color:#202b3a; font-family:Calibri, Arial, sans-serif; font-size:10pt; line-height:1.22; }
.page { page-break-after:always; min-height:9.55in; position:relative; }
.page:last-child { page-break-after:auto; }
.running { color:#5c6b7e; font-size:7.5pt; font-weight:700; letter-spacing:.7px; margin-bottom:.26in; }
.cover { text-align:center; padding-top:1.0in; }
.cover .kicker { color:#a15c00; font-size:10pt; font-weight:700; letter-spacing:1.4px; }
.cover h1 { color:#17365d; font-size:31pt; line-height:1.04; margin:.28in 0 .14in; }
.cover .subtitle { color:#5c6b7e; font-size:14pt; line-height:1.35; }
.scope { color:#187945; font-size:12pt; font-weight:700; margin-top:1.05in; }
.warning { color:#b52d37; font-size:10pt; font-weight:700; margin-top:.7in; }
h2 { color:#2e74b5; font-size:16pt; margin:0 0 .13in; }
h2 span { color:#5c6b7e; font-size:10pt; }
p { margin:.04in 0 .12in; }
.focus { margin-bottom:.14in; }
.counts { display:flex; gap:.08in; margin:.25in 0 .28in; }
.count { border-top:4px solid; background:#f7f9fc; flex:1; text-align:center; padding:.12in .04in; }
.count b { display:block; font-size:17pt; color:#17365d; }
.count span { font-size:7.5pt; font-weight:700; color:#5c6b7e; }
table { width:100%; border-collapse:collapse; table-layout:fixed; margin-top:.08in; }
th { background:#e8eef5; color:#17365d; font-size:8pt; text-align:left; padding:.07in .08in; border:1px solid #aab7c7; }
td { vertical-align:top; font-size:8.4pt; padding:.07in .08in; border:1px solid #c7d0dc; overflow-wrap:anywhere; }
tbody tr:nth-child(even) td:not(.verdict) { background:#f7f9fc; }
.balance th:nth-child(1), .balance td:nth-child(1) { width:15%; }
.balance th:nth-child(2), .balance td:nth-child(2) { width:10%; }
.balance th:nth-child(3), .balance td:nth-child(3) { width:34%; }
.balance th:nth-child(4), .balance td:nth-child(4) { width:41%; }
.name { font-weight:700; }
.verdict { font-weight:700; text-align:center; }
.nerf { background:#fcebec; color:#b52d37; }
.buff { background:#eaf6ee; color:#187945; }
.fix { background:#fff4e5; color:#a15c00; }
.recommend { margin-top:.25in; padding:.14in; background:#fcebec; border-left:4px solid #b52d37; }
"""

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("<!doctype html><html><head><meta charset='utf-8'><style>" + css + "</style></head><body>" + "".join(pages) + "</body></html>", encoding="utf-8")
print(OUT)
