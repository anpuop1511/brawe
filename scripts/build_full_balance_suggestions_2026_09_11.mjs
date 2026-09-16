import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputDir = new URL('../outputs/balance_suggestions_2026_09_11/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const rows = [
  // NERFS — highest urgency first.
  ['NERF','Beast','Tank','Signature','BeastyBeast attacks every 0.01s at -40% damage.','Attack interval 0.01s → 0.05s and damage penalty -40% → -55%.','A 100-hit-per-second loop overwhelms collision checks and erases targets despite the damage penalty. The signature stays frantic at 20 hits per second.','Immediate','Test DPS, input lock and low-end performance.'],
  ['NERF','Kage','Assassin','Base stats','9,200 HP, 2,350 damage and very fast movement.','HP 9,200 → 8,500. Keep the narrower cone and current damage.','Kage has tank durability, assassin speed and premium burst at the same time. Trimming HP preserves his lethal identity while restoring punish windows.','Immediate','Test dive survival against tanks and marksmen.'],
  ['NERF','The Deleter','Assassin / Specialist','Hypercharge','Hyper main executes below 35% HP; three clones deal 50% damage.','Execute threshold 35% → 30%; Hyper clone damage 50% → 42%.','The base 20% execute is already matchup-warping. Hyper should improve certainty without deleting one-third of every health bar behind clone pressure.','Immediate','Test boss/structure exclusions and clone attribution.'],
  ['NERF','JackTrade','Damage Dealer / Specialist','ALL IN','Overlapping Hyper Super sources can deal full stacked damage.','Second and later overlapping ALL IN sources deal 75% damage.','Stacking is fun, but full multiplication creates extreme large-target burst and frame spikes. Diminishing repeats keep the jackpot fantasy.','High','Test poison return, slow zones and multi-target impact.'],
  ['NERF','Mageny','Controller','Projectile control','Main magnetic aura slows enemy projectiles 40%; Heavy Flux raises it to 70%.','Base slow 40% → 32%; Heavy Flux 70% → 55%.','A large moving aura should bend fights, not invalidate every projectile brawler. The Super remains the hard projectile-control tool.','High','Test slow restoration after leaving the aura.'],
  ['NERF','King','Support','Hyper princess ramp','Focused princesses gain +10 damage per hit up to +550.','Per-hit growth +10 → +8; cap remains +550.','The no-minimum-fire-interval design already scales rapidly. Slower damage growth preserves the teamwork payoff without instant snowballing.','High','Test two-princess focus and target switching.'],
  ['NERF','Cinderion','Damage Dealer','Stored flames','Up to 17 orbit flames each last 16s.','Individual flame lifetime 16s → 13s.','Seventeen persistent hitboxes create too much passive control. A shorter lifetime makes full formations require continued accuracy.','High','Test orbit refresh and Hyper fourth layer.'],
  ['NERF','Ramage','Assassin','Hyper sustain','Returning lifesteal projectiles heal 300 each, up to 3,000.','Per-projectile heal stays 300; activation cap 3,000 → 2,400.','The fixed heal solved scaling abuse, but ten confirmed returns still erase too much counter-damage during a high-pressure Hyper.','High','Test green return shots and 80% bonus travel.'],
  ['NERF','Relay','Support','Damage transfer','Hyper device redirects 90% of damage and shields do not naturally decay.','Hyper redirect 90% → 82%; base redirect unchanged.','Permanent shields make near-total redirection compound too safely. Hyper remains elite protection while focused damage can break through.','High','Test teammate-only transfer and shield caps.'],
  ['NERF','Ghoul','Controller / Assassin','Darkness','Darkness stacks to 4.0s.','Maximum stacked Darkness 4.0s → 3.2s.','Vision denial is stronger than a normal stun in team fights because it disrupts aim and positioning. The cap needs a clearer recovery window.','High','Test repeated hand hits and respawn cleanup.'],
  ['NERF','Portalo','Controller / Specialist','Main displacement','Every hit teleports the enemy 5 tiles backward.','Teleport distance 5 → 4.5 tiles.','Reliable long-range displacement plus a usable portal pair can remove defenders too easily. A small trim keeps the unique routing identity.','Medium','Test wall-safe destination and objective displacement.'],
  ['NERF','BlinkEye','Marksman','Hyper defense','Hyper grants 70% damage reduction with frequent homing eye missiles.','Hyper damage reduction 70% → 55%.','The controlled eye form already provides information and pressure. Tank-level mitigation removes the risk of entering the mode.','High','Test manual detonation and missile cadence.'],
  ['NERF','Orbo','Marksman','Super recharge','Super hits recharge at 23.4% of normal damage-based charge and also build Hyper.','Super recharge coefficient 23.4% → 20%.','Piercing multiple enemies now charges per enemy. A modest coefficient trim prevents back-to-back Supers in clustered modes.','Medium','Test single-target and three-target recharge.'],
  ['NERF','Unopcoloco','Skirmisher','Whack follow-up','One scarf enables three Whack attacks with large Hyper range extensions.','Whack chain 3 attacks → 2; keep the current range and damage penalties.','The rework improved mobility and clarity, but three follow-ups make one safe scarf connection decide too much of the fight.','High','Test scarf-wall jumps and Hyper range telegraph.'],
  ['NERF','Snapper','Marksman / Support','Hyper percentage damage','Hyper wave deals 50% current HP; mini wave deals 10%.','Main wave 50% → 44%; mini wave 10% → 8%.','Global percentage pressure should start engagements, not remove half a full team with limited positional counterplay.','High','Confirm both effects remain non-lethal.'],
  ['NERF','Crystila','Controller','Hyper reflector','Hyper glass absorbs 15,000 damage while reflecting in 360 degrees.','Absorption 15,000 → 12,500.','The reflector can remain spectacular, but its current durability stalls objectives longer than most full Supers.','Medium','Test reflected ownership and shield interaction.'],
  ['NERF','Malakor','Assassin','Permanent zones','Hell zones can accumulate for an entire match.','Maximum 5 active Hell zones per owner; the sixth removes the oldest.','Unlimited permanent terrain guarantees late-match takeover and adds avoidable update/render load.','High','Test oldest-zone cleanup and team ownership.'],
  ['NERF','Skeleflying','Artillery','Summon count','Large groups of flying and ground skeletons can overlap.','Maximum 9 living skeleton summons per owner.','The swarm fantasy remains, but a cap reduces body-blocking, pathfinding cost and unavoidable objective control.','High','Test portal spawns at cap and summon deaths.'],
  ['NERF','Peter Pickle','Controller','Summons','Repeated hits and jars can produce very large walking-pickle armies.','Cap walking pickles at 12 normally and 20 during Hyper.','Autonomous pressure scales faster than player interaction and becomes a performance problem in team modes.','High','Test owner death and oldest-summon cleanup.'],
  ['NERF','Decayer','Controller','Permanent shield','Main hits repeatedly add shield in a no-decay shield system.','Shield gained per hit -15%; do not change damage.','A permanent resource must build more slowly than temporary health. This keeps the identity without allowing safe poke to create a second health bar.','Medium','Test cap stacking with Trinkets.'],
  ['NERF','Angel','Support','Second Life','Team-wide survival protection covers a long coordinated push.','Team Takeback duration -1s; personal Second Life unchanged.','Saving several allies at 1 HP is already one of the strongest team effects. The team window should be tighter than the personal version.','Medium','Test simultaneous lethal damage and respawns.'],
  ['NERF','Homer','Marksman','Permanent homing','Repeated Supers permanently improve homing toward near-perfect accuracy.','Permanent homing cap 80% → 70%; Hyper may still temporarily exceed it.','Long-term progression should improve consistency without eventually removing the ability to miss.','Medium','Test save/reset boundaries between matches.'],
  ['NERF','Chickpig','Skirmisher','Hyper mount','High-speed mount combines durability, ram pressure and charge resistance.','Pig HP -10%; Hyper charge resistance 40% → 32%.','Opponents currently have to solve too many defensive layers while also avoiding the ram.','Medium','Test dismount and summon attribution.'],
  ['NERF','Ice Cream','Controller','Freeze buildup','Two Hyper cones can build Freeze extremely quickly.','Hyper Freeze per cone 25% → 20%.','Two accurate hits should create strong setup, not nearly complete a hard-control effect by themselves.','Medium','Test multi-cone overlap and immunity windows.'],
  ['NERF','Paradox','Controller','Relativity Zone','Enemy shots are slowed 30% while allied shots gain speed.','Enemy projectile slow 30% → 24%; allied +10% speed unchanged.','The zone already improves friendly tracking and safety. Reducing the denial side keeps projectile matchups playable.','Medium','Verify visual tags match actual speed.'],
  ['NERF','Darkener','Controller','Star Power 1','Each consecutive cloud tick gains 25% damage.','Per-tick ramp +25% → +18%; reset immediately after leaving the cloud.','The ramp is healthy when earned through positioning, but 25% compounds too sharply on slowed or trapped targets.','Medium','Test tick ownership and reset timing.'],
  ['NERF','Anti-Royal','Controller / Specialist','Mortar opening burst','Stored rounds create an immediate multi-shell area-control burst.','Maximum opening stored-round burst 8 → 6; ongoing 1.3s fire unchanged.','The mortar should establish territory, but the opening burst currently front-loads too much unavoidable area damage.','Medium','Confirm opening shells use distinct landing points.'],
  ['NERF','Cursed','Controller','Curse reliability','Main hit has a 50% chance to force random ammo use.','Mini Curse chance 50% → 40%.','Forced attacks remove player control and can spend scarce ammo. The effect should be threatening without deciding every second hit.','Medium','Test one- and two-ammo curse outcomes.'],
  ['NERF','Dashaholic','Assassin','Main consistency','Main attack retains a very large size bonus while Super has two uses per charge.','Main attack size bonus +100% → +70%; keep two Super uses.','Two dashes already provide exceptional access. The oversized follow-up makes successful dives too automatic.','Medium','Test both Super charges and edge hits.'],
  ['NERF','Overlord','Tank','Final stage','Late Ascension grows size and damage together after successful hits.','Final-stage growth cap 45% → 35%; earlier stages unchanged.','The final form should dominate space, but simultaneous size and damage growth currently removes too much room to outplay it.','Medium','Test stage loss, respawn and large targets.'],

  // REWORKS — disabled/problem kits stay out until their foundations are safe.
  ['REWORK','Robber','Skirmisher','Whole kit','Disabled; rows, ammo theft and projectile scaling compound together.','Keep disabled. Rebuild around a 6-row cap, 7 stored ammo maximum and one clearly telegraphed theft event.','Several separate economies snowball at once, so number tuning alone will not create readable counterplay.','Immediate','Full kit, bot logic, saves and performance.'],
  ['REWORK','Boomer','Artillery','Ignition flow','Disabled after repeated manual-ignite state failures.','Keep disabled. Make each bomb own its fuse state and use one universal ignite input with a visible hold meter.','The core idea is good, but global input variables made the brawler fragile and caused match-wide runtime errors.','Immediate','Desktop/mobile input and bomb cleanup.'],
  ['REWORK','Daggershard','Damage Dealer','Hit chain','Disabled; dagger stages and destructible display have unreliable damage paths.','Keep disabled. Centralize 1→2→3 stage advancement and make every dagger/shard use the universal damage endpoint.','Multiple custom hit paths caused attacks to miss enemies and objectives. A single damage contract fixes both balance and reliability.','Immediate','Players, boxes, vaults and structures.'],
  ['REWORK','Cluster','Artillery','Mine ownership','Disabled; persistent mines and airborne effects have repeatedly desynced.','Keep disabled. Use a strict five-mine owner cap and one shared trigger/launch function for players and objectives.','The kit needs predictable ownership and cleanup before its radius or damage can be balanced.','Immediate','Mine replacement, knock-up and boxes.'],
  ['REWORK','Witch','Controller','Summon lifecycle','Disabled; tombstone recast and skeleton ownership are unstable.','Keep disabled. Make tombstone → monster a formal two-state Super with one owner summon registry.','Independent summon timers and recasts create leaks and inconsistent team behavior.','Immediate','Recast, death cleanup and bot usage.'],
  ['REWORK','Adlof','Controller','Control identity','Disabled; forced retargeting and takeover create unreliable AI states.','Keep disabled. Replace hard AI takeover with a short fear/retreat state, while preserving the mastermind theme.','Directly rewriting enemy targeting conflicts with bot logic and is difficult to read or counter.','High','Target restoration and team modes.'],
  ['REWORK','Swimmer','Assassin','Strength and pull','Disabled; non-projectile hits and Hyper pull have inconsistent objective support.','Keep disabled. Route swim strokes through universal melee damage and make Strength modify one documented value at a time.','Custom collision paths caused boxes and structures to ignore attacks. The ramp also needs clearer tuning hooks.','High','Walls, water, boxes and Hyper pull.'],
  ['REWORK','Blade Vane','Damage Dealer','Accelerating sword','Disabled; sword hits have failed against objectives and Super scaling compounds too many stats.','Keep disabled. Rebuild swings as universal melee arcs; let Super ramp speed and reload only, then cap damage separately.','Damage, swing speed and reload multiplying together caused extreme tower DPS and inconsistent collision.','High','Boxes, towers, melee arcs and Hyper cap.'],

  // ADJUSTMENTS — power-neutral redistributions.
  ['ADJUST','Rocketeer','Artillery','Main split','Direct hit and child rockets share too much of the same payoff.','Direct rocket damage +6%; each split rocket damage -8%.','Accuracy should matter more than stacking every child projectile on large targets. Total ideal damage stays close.','Medium','Point-blank and max-range damage.'],
  ['ADJUST','Hope','Support','Structure damage','Percent-max-HP attacks scale differently across fighters and giant objectives.','Keep 16%/18% versus fighters; add a documented structure cap equal to a normal heavy hit.','Hope should counter high-HP fighters without deleting Arena Forge towers through percentage scaling.','High','Rally Cry, Hyper and Forge modifiers.'],
  ['ADJUST','Money and Tax','Damage Dealer','Mode parity','Money has wider, larger coins; Tax has higher damage and tighter spread.','Tax first hit +8% damage, but returning ammo steal 0.25 → 0.20 per pair. Money unchanged.','Tax needs a clearer immediate reward without becoming an ammo-locking control mode.','Medium','Mode swap, mutation and Tower cards.'],
  ['ADJUST','Outlit','Damage Dealer','Super pellets','Super now fires three large knockback pellets and chains into walls.','Center pellet damage +8%; side pellets -4%.','The center line should reward aim while the wall-chain spectacle remains coverage rather than free full damage.','Medium','Multiple walls and Super recharge.'],
  ['ADJUST','Fight’nFire','Artillery','Flaming Core','Max-range shards add control and structure pressure.','Core direct damage +5%; shard damage -7%.','Shift value toward landing the core instead of farming every shard on large targets.','Medium','Max-range split and wall impact.'],
  ['ADJUST','Bouncin’ Balls','Skirmisher','Turret command','Turret has 6,000 decaying HP, loses 750 HP per command and fires two waves every 10s.','Command cost 750 → 900 turret HP; wave ball damage +8%.','Fewer but more meaningful commands improve readability and stop a long-lived turret from flooding the arena.','Medium','Decay timing and command cooldown.'],
  ['ADJUST','Fastpass','Support / Assassin','Momentum','Hits build shared movement and projectile-speed Momentum.','Movement Momentum cap unchanged; projectile-speed benefit uses 90% of current Momentum.','Separating the two outputs slightly keeps movement exciting without making late-stack projectiles too hard to dodge.','Low','HUD meter and stacked Super caps.'],
  ['ADJUST','Freestyle','Controller / Support','Setlist','Three attacks have very different reliability and sustain.','Disco Ball damage +4%; DJ Board outer keys -6%; microphone unchanged.','Move a little power toward precision without weakening Freestyle’s signature healing pickup.','Low','Full Disco→DJ→Mic cycle.'],
  ['ADJUST','Upiedown','Artillery','Pie split','Landing pie and mini pies can overlap on large targets.','Landing impact +10%; each mini pie -5%.','A clean throw should carry more value than unavoidable overlap after the split.','Low','Direct impact and four-mini overlap.'],
  ['ADJUST','Tempo Maker','Skirmisher','Cadence reward','Returning notes combine repeated damage and crowd control.','First return hit full damage; later contacts from the same attack deal 85%.','The rhythm payoff remains, but repeated body overlap stops multiplying burst uncontrollably.','Medium','Multi-contact attribution.'],
  ['ADJUST','Warrior','Tank','Final Stand','Stationary Super grants extreme reload but removes mobility.','Spear hitbox +8%; Final Stand reload bonus -12%.','Improve the base attack while trimming the stationary damage ceiling.','Low','Normal poke and full Super DPS.'],
  ['ADJUST','Chaird','Tank','Super pull','Pull is now in the base Super; the Star Power ramps speed over time.','Base pull strength -8%; Star Power ends at the current 80% speed ceiling.','Moving pull into the kit is a real buff. A small base trim keeps the new Star Power from creating an unavoidable late spin.','Medium','Pull immunity and late-Super speed.'],
  ['ADJUST','Bowlin Rida','Tank / Skirmisher','Bull form','Always rides the bull; one ammo launches horns and contact deals damage.','Contact damage -10%; horn projectile damage +8%.','Shift power from passive collision into the attack players intentionally aim.','Medium','Contact cooldown and bots.'],
  ['ADJUST','AxeyWaxy','Tank','Chaird overlap','Axe control can feel too similar to Chaird’s close-range displacement.','Returning axe gains +15% speed; remove knockback from the outgoing half only.','This creates a catch-and-return identity instead of competing with Chaird on the same CC pattern.','Medium','Outbound/return hit attribution.'],
  ['ADJUST','Sera Eclipse','Support','Eclipse zone','Zone heals, buffs allies, damages and slows enemies.','Enemy slow -5 percentage points; ally healing +6%.','Lean the zone further into support and away from doing every job equally well.','Low','Team ownership and overlapping zones.'],
  ['ADJUST','Amplifier','Support','Machines','Team amplifier creates strong shared damage windows.','Machine HP -8%; placement range +10%.','Make good placement more expressive while leaving the device easier to answer once found.','Low','Wall-safe placement and team buffs.'],

  // BUFFS — reliability first, raw burst second.
  ['BUFF','Trampaheal','Support','Super charge','Healing teammates now charges Super, but the deployed Super is easy to erase.','Super deployable HP +12%; healing charge rate unchanged.','The new healing loop works only if the reward survives long enough to matter. This buffs payoff rather than charge speed.','High','Enemy damage, owner damage and team healing.'],
  ['BUFF','Minigunnin','Damage Dealer','Base firing','Recent range and cone changes improved consistency, but base bullets still feel weak.','Main bullet damage +8%; Super charge bonus stays +25%.','Sustained tracking needs a better normal payoff without accelerating the already-buffed Super cycle.','Medium','Full belt DPS and Super charge time.'],
  ['BUFF','Steamer','Damage Dealer','Respawn flow','Boiler-based attacks can restart with little usable pressure.','Respawn with 20% boiler resource.','A small reserve removes dead time without improving maximum Steam Stream output.','Low','Initial spawn must remain unchanged.'],
  ['BUFF','Trapper','Controller','Trap activation','Enemies often cross the warning before the fence becomes active.','Fence activation delay -15%; damage unchanged.','Prediction should pay off. Faster activation improves reliability without making a triggered trap more lethal.','Medium','Bot pathing and fast movement.'],
  ['BUFF','Boom-Arang','Marksman','Return loop','Long out-and-back timing leaves the brawler exposed in open lanes.','Outgoing speed +8%; catch recovery lockout -10%.','The player still has to route the return, but spends less time unable to pressure.','Low','Catch, pull and wall interaction.'],
  ['BUFF','Hoop','Skirmisher','Precision hit','Direct pre-bounce contact is not much better than the easier splash.','Direct impact damage +10%; splash unchanged.','Rewarding the difficult hit adds skill expression without widening area damage.','Low','Direct plus bounce overlap.'],
  ['BUFF','Screener','Controller','Battery','Confirmed hits do not refill the special loop quickly enough.','Battery restored per confirmed hit +15%.','Active accuracy should matter more than passive waiting. Capacity and burst remain unchanged.','Low','Multi-hit attacks and structures.'],
  ['BUFF','Fuel','Controller','Hyper pull','Hyper’s long-range payoff feels too similar to the base flame cycle.','Hyper pull distance +18%.','A stronger displacement payoff differentiates Hyper without adding more damage.','Low','CC immunity and edge collisions.'],
  ['BUFF','Echo','Support','Instinct repeat','Aftershock Reflex repeats after 800ms but can be hard to read and land.','Repeated wave radius +10%; repeat damage unchanged.','A modest reliability buff makes the Instinct visible and useful without increasing its burst.','Low','Water movement and repeat cleanup.'],
  ['BUFF','Forest','Tank','Parrot reliability','Pet pathing can waste attacks around water and obstacles.','Parrot retarget interval -20% and stuck recovery after 0.5s.','This fixes lost pressure through better behavior instead of inflating summon damage.','Medium','Water, walls and owner death.'],
  ['BUFF','Scuba Diver','Controller','Mode clarity','Terrain-dependent pressure is difficult to convert consistently.','Surface attack projectile size +8%; underwater values unchanged.','The accessible form needs slightly better reliability while the terrain advantage remains special.','Low','Water transitions and aim telegraph.'],
  ['BUFF','Beam','Damage Dealer','Ramp entry','Continuous beam takes too long to become threatening after target swaps.','First ramp interval 0.45s → 0.38s; maximum damage unchanged.','Beam reaches its identity sooner but still needs sustained tracking for peak damage.','Low','Target swap and Golden Beam.'],
  ['BUFF','Demon','Assassin','Blade return','Correct glide choices can still miss the return damage by a small margin.','Returning blade hitbox +10%; outgoing hitbox unchanged.','Reward the planned return path without making the initial throw easier.','Low','Pull shield and wall contact.'],
  ['BUFF','Jetpack','Assassin','Landing reliability','Charged landings are readable but inconsistent near the target edge.','Landing damage radius +8%; invulnerability timing unchanged.','The committed jump should connect slightly more reliably without restoring old repeat-flight safety.','Medium','Edge hits and water landings.'],
  ['BUFF','Upgradart','Support','Upgrade pacing','Early upgrades take too long to affect a short match.','First upgrade requirement -15%; later requirements unchanged.','Earlier identity helps normal modes while preserving late-game scaling limits.','Low','Respawn and mode resets.'],
  ['BUFF','Draflygon','Artillery','Aerial flames','Outer scattered flames are difficult to confirm on moving targets.','Outer flame projectile size +10%; center flame unchanged.','Improve the edges of the pattern without raising the reliable center burst.','Low','Super pattern and Cinderion comparison.'],
  ['BUFF','Sir Cheeseburger','Tank','Engage','The large body reaches targets inconsistently in open maps.','Movement speed +4%; HP and damage unchanged.','A small mobility buff improves access without increasing brawl-winning durability.','Low','Collision and speed stacking.'],
  ['BUFF','WeeFee','Support','Signal uptime','Team utility falls off too sharply when a connection breaks.','Grace period after lost connection +0.4s.','Short connection drops should not erase the support loop, but opponents can still create real downtime.','Low','Reconnect, death and range limits.'],
  ['BUFF','dr0ne','Controller','Command feedback','Drone commands are difficult to convert when targets change quickly.','Command retarget speed +15%; damage unchanged.','More responsive control improves the intended specialist feel without adding passive DPS.','Low','Multiple drones and owner death.'],
  ['BUFF','Goonbob','Controller','Blobert collection','Self-created puddles are easy to miss by a few pixels.','Puddle collection radius +15%; stored-liquid cap unchanged.','The setup loop should fail from enemy pressure, not tiny pathing misses.','Low','Collection and water overlap.'],
  ['BUFF','Cheseypuff','Marksman','Close reliability','Long-range cheese is stable, but close shots feel unusually thin.','Minimum projectile size +8%; maximum evolved size unchanged.','This smooths the weak end without buffing already-powerful evolved shots.','Low','Evolution and wall contact.'],
  ['BUFF','Hunter','Marksman','Target acquisition','Marked-target pressure drops when the mark chooses an unreachable enemy.','If a marked target is unreachable for 2s, retarget the nearest visible enemy.','The buff removes dead states rather than increasing damage or homing.','Medium','Walls, invisibility and respawns.'],
  ['BUFF','Duck','Damage Dealer','Bread stream','The narrower, shorter cone can lose too many crumbs at its edge.','Crumb projectile size +6%; lifesteal remains 18%.','A tiny consistency buff supports the sweeping pattern without restoring the old wide cone.','Low','Held fire and homing Hyper crumbs.'],
  ['BUFF','Predator','Assassin','Warning payoff','The longer latch warning gives opponents fair counterplay.','Successful latch claw damage +6%.','After adding reaction time, confirmed execution should remain rewarding.','Low','Warning, latch and CC immunity.'],
  ['BUFF','Awakenator','Controller','Wake transition','Nightmare setup can be lost when enemies wake at the edge of an effect.','Wake-trigger effect radius +10%; damage unchanged.','Improve consistency on the signature transition without making sleep easier to apply.','Low','Wake causes and ally corruption.'],
  ['BUFF','Unstable','Controller','Container threat','Containers can be destroyed before creating meaningful DNA pressure.','Container HP +8%; DNA damage and growth unchanged.','A little more setup durability supports the summoner identity without increasing the snowball reward.','Low','Owner death and hostile DNA.'],

  // HOLDS — explicitly no immediate number change.
  ['HOLD','Fuser','Damage Dealer','Recent pass','Now fires 8 bullets, +50% size, wider lanes; every 4 attacks banks 2 full-flight Curve Volleys with 60% weaker steering.','No further numerical change for one test cycle.','Several linked variables just changed. More tuning now would hide whether the new bullet count, size and homing tradeoff is healthy.','Monitor','Track hit rate, burst and Curve Volley accuracy.'],
  ['HOLD','Outlit','Damage Dealer','Base kit','Short-range fan and wall-chain Super now have clearer identities.','No additional change beyond the proposed Super redistribution.','The base starter kit has understandable strengths and weaknesses; only the new Super needs focused measurement.','Monitor','Win rate by range and wall density.'],
  ['HOLD','Classy','Skirmisher','Core kit','Symphony ramp and mobile-speaker Signature are functioning after recent fixes.','No normal-kit change.','The latest Signature HP cost and speaker behavior need live data before another power move.','Monitor','Signature uptime and Hyper charge.'],
  ['HOLD','Hyperorigin','Skirmisher','Energy loop','Energy, shields and heavy slams form a complete ramping kit.','No change.','The kit has strong payoff but visible setup and close-range exposure.','Monitor','Energy UI and shield caps.'],
  ['HOLD','Heater Miser','Damage Dealer','Damage-over-time charge','Damage ticks now contribute to Super charge correctly.','No change.','The missing charge path was a functional weakness. Re-evaluate only after the repaired tick behavior has data.','Monitor','Time to first Super and Hyper pull.'],
  ['HOLD','Copyphase','Skirmisher','Copied kits','Power depends heavily on the copied target and cleanup correctness.','No number change; audit copied-state cleanup first.','Base balance cannot be judged while copied shields, summons or UI may persist incorrectly.','Monitor','Death, respawn and target swaps.'],
  ['HOLD','Evil Doctor','Artillery','Mutation and Chain Reaction','Double Trouble and kill-attributed DNA now create complex delayed pressure.','No damage change.','The kit is powerful only when poison and kill attribution chain correctly; reliability data should come before tuning.','Monitor','Recursion cap and every kill source.'],
  ['HOLD','Splitter','Artillery','Reworked split tree','Main 1→5 and Super 1→2→4→8→16 create high coverage with short pre-split range.','No immediate change.','The rework fundamentally changed hit distribution, so old damage assumptions no longer apply.','Monitor','Large targets, Hyper three-way shot and Instinct.'],
  ['HOLD','Teether','Controller','Grapple','Delayed teeth and attached movement create clear warning and payoff stages.','No change.','The enemy gets a readable decision window and existing immunity systems provide counterplay.','Monitor','Pull distance and untargetability.'],
  ['HOLD','Xray','Marksman','Scanner','Information and vulnerability are strong but require a destructible machine.','No change.','Recent machine and vulnerability tuning should settle before another adjustment.','Monitor','Team damage amplification.'],
  ['HOLD','Bouncin’ Balls','Skirmisher','Main ricochet','Aim telegraph, bounce range and Signature collector were recently rebuilt.','No main-attack number change.','The geometry system needs accuracy data; only turret economy is ready for adjustment.','Monitor','Telegraph match and wall-heavy maps.'],
  ['HOLD','Freestyle','Controller / Support','Microphones','Pickup healing, Setlist order and speaker walls have defined tradeoffs.','No sustain change.','Reducing healing again would risk erasing the Microphone identity.','Monitor','Pickup count and wall trapping.'],
  ['HOLD','Fastpass','Support / Assassin','Fast Lane','Momentum caps, delayed two-shot pattern and split self/team Hyper healing were recently tuned.','No direct buff or nerf.','The kit now has clear ramp and coordination requirements. Measure before moving the cap again.','Monitor','Peak speed and team pulse value.'],
  ['HOLD','Drainbow','Support','Track zones','Speed and regeneration depend on staying on luminous tracks.','No change.','The power has clear terrain dependency and counterplay through displacement.','Monitor','Track stacking and off-road drain.'],
  ['HOLD','Trampaheal','Support','Healing charge','Healing allies now charges Super.','Use only the proposed deployable HP buff.','Do not also raise charge speed until the new teammate-healing path is measured.','Monitor','Charge from overheal and pets.'],
  ['HOLD','Mageny','Controller','Signature duration','Permanent Attraction has 14s maximum life, 18s cooldown and projectile caps.','Keep duration, cooldown and caps unchanged.','Those limits already solve permanent-vortex abuse; only projectile slowdown needs trimming.','Monitor','Manual detonation and cap explosion.'],
  ['HOLD','Ramage','Assassin','Projectile travel','Normal shadows cross and lifesteal returns gain 80% extra range.','Keep travel behavior unchanged.','The route is now readable and unique. Balance through healing cap, not by breaking the visual pattern.','Monitor','Crossing and return endpoints.'],
  ['HOLD','Cinderion','Damage Dealer','Main pattern','Aimed scattered flames mirror Draflygon’s aerial pattern at longer range.','Keep damage, spread and symmetry unchanged.','The orbit lifetime is the safer lever because it reduces passive control without weakening skill shots.','Monitor','Flame generation per hit.'],
  ['HOLD','Cursed','Controller','Super storm','Moving storm curses each enemy once and Hyper releases a Darkness cloud.','Keep Super duration and one-trigger rule.','The main curse chance is the clearer frustration lever; the Super already has a once-per-target limit.','Monitor','Target memory and team modes.'],
  ['HOLD','Anti-Royal','Controller / Specialist','Royal Blocker','Front shield blocks one qualifying projectile every 4.5s.','Keep shield cooldown and Hyper conversion unchanged.','The defensive identity has strict projectile rules and a visible cooldown. Adjust mortar burst first.','Monitor','Princess arrows and multi-projectile attacks.'],
  ['HOLD','King','Support','Princess baseline','Princesses have 3,500 HP, fire every 0.5s for 250 and max two active.','Keep base princess stats.','The baseline summon is now clear; the Hyper focus ramp is the only part needing a trim.','Monitor','Two-princess sustained DPS.'],
  ['HOLD','Sir Cheeseburger','Tank','Durability','High HP and normal damage support a simple frontline identity.','Only apply the proposed small speed buff.','Changing HP and speed together would make the result hard to judge.','Monitor','Engage success by map size.'],
  ['HOLD','WeeFee','Support','Base output','Current damage and movement sit near support baselines.','Only apply the proposed signal grace buff.','Reliability, not raw output, is the likely weakness.','Monitor','Connection uptime.'],
  ['HOLD','BlinkEye','Marksman','Base attack','Ricochet Gaze gains range from wall bounces.','Keep main damage, speed and bounce range.','The main attack has skill-based geometry; Hyper durability is the overloaded layer.','Monitor','Open versus wall maps.'],
  ['HOLD','dr0ne','Controller','Damage','Commanded units create distributed pressure.','Only apply the proposed retarget-speed buff.','More raw damage would increase passive value and summon load.','Monitor','Target selection.'],
  ['HOLD','Unhitabble','Specialist','New release','Very new kit with limited matchup data.','No numerical change this cycle.','New mechanics need functional and counterplay testing before balance changes.','Monitor','Invulnerability, targeting and objectives.'],
];

// Remove deliberate secondary HOLD notes for fighters that already have a primary
// recommendation, except where the note protects a different mechanic. Keep the
// workbook readable by presenting one actionable row per fighter.
const priorityRank = { Immediate: 0, High: 1, Medium: 2, Low: 3, Monitor: 4 };
const typeRank = { NERF: 0, REWORK: 1, ADJUST: 2, BUFF: 3, HOLD: 4 };
const seen = new Set();
const uniqueRows = [];
for (const row of rows) {
  const key = row[1].toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  uniqueRows.push(row);
}
uniqueRows.sort((a,b) => typeRank[a[0]] - typeRank[b[0]] || priorityRank[a[7]] - priorityRank[b[7]] || a[1].localeCompare(b[1]));

const wb = Workbook.create();
const ws = wb.worksheets.add('Balance Suggestions');
ws.showGridLines = false;
ws.tabColor = '#243B64';

const font = 'Arial';
const palette = {
  NERF: { dark:'#B3261E', light:'#FCE8E6' },
  REWORK: { dark:'#6B3FA0', light:'#F3E8FF' },
  ADJUST: { dark:'#B06000', light:'#FFF1D6' },
  BUFF: { dark:'#137333', light:'#E6F4EA' },
  HOLD: { dark:'#536273', light:'#EEF2F7' },
};

ws.getRange('A2').values = [['BRAWE balance suggestions']];
ws.getRange('A2').format.font = { name:font, size:16, bold:true, color:'#18283F' };
ws.getRange('A3').values = [['Fresh developer proposal based on the current roster and mechanics. Suggestions only; no game values were changed.']];
ws.getRange('A3:I3').format.font = { name:font, size:10, italic:true, color:'#5E6C7E' };
ws.getRange('A4:I4').format.borders = { bottom:{style:'thin',color:'#9CB0C8'} };

ws.getRange('A6:B6').values = [['Recommendation','Count']];
ws.getRange('A7:A11').values = [['NERF'],['REWORK'],['ADJUST'],['BUFF'],['HOLD']];
ws.getRange('B7:B11').formulas = [
  [`=COUNTIF($A$16:$A$${15+uniqueRows.length},A7)`],
  [`=COUNTIF($A$16:$A$${15+uniqueRows.length},A8)`],
  [`=COUNTIF($A$16:$A$${15+uniqueRows.length},A9)`],
  [`=COUNTIF($A$16:$A$${15+uniqueRows.length},A10)`],
  [`=COUNTIF($A$16:$A$${15+uniqueRows.length},A11)`],
];
ws.getRange('A6:B6').format = { fill:'#243B64', font:{name:font,size:10,bold:true,color:'#FFFFFF'}, horizontalAlignment:'center', verticalAlignment:'center' };
for (let i=0;i<5;i++) {
  const r=7+i, type=['NERF','REWORK','ADJUST','BUFF','HOLD'][i], p=palette[type];
  ws.getRange(`A${r}:B${r}`).format = { fill:p.light, font:{name:font,size:10,bold:true,color:p.dark}, verticalAlignment:'center' };
}
ws.getRange('B7:B11').format.horizontalAlignment = 'right';

ws.getRange('D6:I6').values = [['Developer priorities','','','','','']];
ws.getRange('D6:I6').format = { fill:'#243B64', font:{name:font,size:10,bold:true,color:'#FFFFFF'}, verticalAlignment:'center' };
ws.getRange('D7:I11').values = [
  ['1','Stabilize disabled kits','Robber, Boomer, Daggershard, Cluster, Witch, Adlof, Swimmer and Blade Vane stay disabled until their shared damage/state paths are rebuilt.','','',''],
  ['2','Cut extreme loops','BeastyBeast’s 0.01s attack loop and large summon armies are balance and performance risks.','','',''],
  ['3','Respect permanent shields','No-decay shields make Relay, Decayer and other shield engines stronger than their original tuning assumed.','','',''],
  ['4','Reward accuracy','Several adjustments move damage from child fragments or passive overlap into direct hits.','','',''],
  ['5','Measure recent reworks','Fuser, Splitter, Fastpass and other freshly changed kits should get one stable data cycle before more tuning.','','',''],
];
ws.getRange('D7:I11').format = { fill:'#F5F8FC', font:{name:font,size:10,color:'#243247'}, wrapText:true, verticalAlignment:'center' };
ws.getRange('D7:D11').format.font = { name:font,size:11,bold:true,color:'#2B63A7' };
ws.getRange('E7:E11').format.font = { name:font,size:10,bold:true,color:'#243247' };

ws.getRange('A13').values = [['Color key: red = nerf, purple = rework, amber = power-neutral adjustment, green = buff, gray = hold.']];
ws.getRange('A13:I13').format.font = { name:font,size:9,italic:true,color:'#65758A' };
ws.getRange('A14').values = [['Review order: Immediate items are safety/performance or severe counterplay risks. High items should lead the next normal balance patch.']];
ws.getRange('A14:I14').format.font = { name:font,size:9,italic:true,color:'#65758A' };

const headerRow = 15;
const dataStart = 16;
const dataEnd = dataStart + uniqueRows.length - 1;
const headers = ['Type','Fighter','Role','Area','Current state','Proposed change','Why','Priority','Risk / test focus'];
ws.getRange(`A${headerRow}:I${headerRow}`).values = [headers];
ws.getRange(`A${headerRow}:I${headerRow}`).format = {
  fill:'#18283F', font:{name:font,size:10,bold:true,color:'#FFFFFF'},
  horizontalAlignment:'center', verticalAlignment:'center', wrapText:true,
  borders:{bottom:{style:'medium',color:'#FFFFFF'}}
};
ws.getRange(`A${dataStart}:I${dataEnd}`).values = uniqueRows;
ws.getRange(`A${dataStart}:I${dataEnd}`).format = {
  font:{name:font,size:10,color:'#243247'}, verticalAlignment:'top', wrapText:true,
  borders:{bottom:{style:'thin',color:'#D6DEE9'}}
};

let lastType='';
for (let i=0;i<uniqueRows.length;i++) {
  const excelRow=dataStart+i, type=uniqueRows[i][0], p=palette[type];
  ws.getRange(`A${excelRow}:I${excelRow}`).format.fill = p.light;
  ws.getRange(`A${excelRow}`).format = { fill:p.dark, font:{name:font,size:10,bold:true,color:'#FFFFFF'}, horizontalAlignment:'center', verticalAlignment:'center' };
  ws.getRange(`B${excelRow}`).format.font = { name:font,size:10,bold:true,color:'#18283F' };
  ws.getRange(`H${excelRow}`).format.font = { name:font,size:10,bold:true,color: uniqueRows[i][7]==='Immediate'?'#B3261E':uniqueRows[i][7]==='High'?'#8A4300':'#34465C' };
  if (type!==lastType) {
    ws.getRange(`A${excelRow}:I${excelRow}`).format.borders = { top:{style:'medium',color:p.dark}, bottom:{style:'thin',color:'#D6DEE9'} };
    lastType=type;
  }
}

ws.getRange(`A${dataStart}:A${dataEnd}`).format.horizontalAlignment='center';
ws.getRange(`H${dataStart}:H${dataEnd}`).format.horizontalAlignment='center';
ws.getRange(`A${dataStart}:I${dataEnd}`).format.rowHeight = 56;
ws.getRange(`A${headerRow}:I${headerRow}`).format.rowHeight = 28;
ws.getRange('A:A').format.columnWidth = 14;
ws.getRange('B:B').format.columnWidth = 18;
ws.getRange('C:C').format.columnWidth = 22;
ws.getRange('D:D').format.columnWidth = 22;
ws.getRange('E:E').format.columnWidth = 34;
ws.getRange('F:F').format.columnWidth = 42;
ws.getRange('G:G').format.columnWidth = 48;
ws.getRange('H:H').format.columnWidth = 12;
ws.getRange('I:I').format.columnWidth = 34;
ws.getRange('D7:D11').format.columnWidth = 5;
ws.freezePanes.freezeRows(headerRow);
ws.freezePanes.freezeColumns(2);

// Keep the long review sortable/filterable without allowing a default table style
// to overwrite the requested recommendation colors.
ws.getRange(`A${headerRow}:I${dataEnd}`).format.autofitRows();
for (let r=dataStart;r<=dataEnd;r++) {
  const height = ws.getRange(`A${r}:I${r}`).format.rowHeight;
  if (!Number.isFinite(height) || height < 42) ws.getRange(`A${r}:I${r}`).format.rowHeight = 42;
  if (height > 92) ws.getRange(`A${r}:I${r}`).format.rowHeight = 92;
}

wb.recalculate();

const inspect = await wb.inspect({kind:'table',range:`Balance Suggestions!A1:I${Math.min(dataEnd,30)}`,include:'values,formulas',tableMaxRows:30,tableMaxCols:9,maxChars:12000});
console.log(inspect.ndjson);
const errors = await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:100},summary:'final formula error scan'});
console.log(errors.ndjson);

for (const [name,start,end] of [['top',1,30],['middle',31,70],['bottom',71,dataEnd]]) {
  if (start>end) continue;
  const preview = await wb.render({sheetName:'Balance Suggestions',range:`A${start}:I${end}`,scale:1,format:'png'});
  await fs.writeFile(new URL(`preview-${name}.png`,outputDir),new Uint8Array(await preview.arrayBuffer()));
}

const out = await SpreadsheetFile.exportXlsx(wb);
const outputUrl = new URL('BRAWE_Balance_Suggestions_2026-09-11.xlsx', outputDir);
const outputPath = fileURLToPath(outputUrl);
await out.save(outputPath);
console.log(JSON.stringify({output:outputPath,rowCount:uniqueRows.length,dataEnd}));
