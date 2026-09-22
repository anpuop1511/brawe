# BRAWE gadget testing

## Speed tests

The Gadget Test Lab includes a **Speed Test** section. Press **START**, run a repeatable route, then press **STOP + SAVE BASELINE**. Activate the gadget or other speed effect, repeat the same route with **START** and **STOP**, and read the automatic percentage difference. It shows live speed, peak speed, distance, elapsed time, and average result. Teleports and respawn jumps are excluded.

Open **Training → Gadget Test Lab** at the top of the controls.

1. Choose a fighter and **G1** or **G2**.
2. Read **What should happen** (the current in-game description).
3. Leave **No cooldown** checked for rapid testing. This bypass applies only to your Training gadgets, not normal matches or bots.
4. Press **Use Gadget**, then perform the required attack or Super. Place a summon first for summon-dependent gadgets.
5. Write notes and choose **PASS** or **FAIL**. Results save in this browser.
6. **Export checklist + results** downloads all active fighters' gadget descriptions, normal cooldowns, verdicts, and notes as a text document.

## Setups

- Damage/control: use a dummy, then an active enemy bot.
- Healing: use **SELF HP 25%** or wound an allied bot. Check full HP too.
- Summons: charge and cast Super before activating.
- Empowered attack: activate, attack, then attack again to check consumption.
- Team effects: compare allies and enemies; check unintended friendly fire.
- Knockback: test near walls and water as well as open ground.
- Cooldowns: disable the bypass and check the normal timer separately.

## Verdicts

**PASS:** You observed the described effect, duration, and target restrictions.

**FAIL:** Explain expected versus actual behavior, including missing visuals or descriptions, crashes, or repeated effects.

**UNTESTED:** No conclusion yet, never a pass.

Example: `G2 FAIL — turret placed, gadget used, attack speed unchanged twice. No Hyper.`

Use an armed attack before switching gadgets so pending effects do not mix. Disabled fighters remain excluded. Export before clearing browser data or changing browsers.
