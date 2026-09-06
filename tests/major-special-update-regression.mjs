import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync(new URL('../game.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const anomaly=fs.readFileSync(new URL('../modules/brawlers/anomaly/roster.js',import.meta.url),'utf8');

// Generic persistent framework and guaranteed free paths.
for(const marker of [
  'const SPECIAL_ABILITY_DEFS = Object.freeze',
  "type: 'mutation'", "type: 'signature'", "type: 'instinct'",
  'function getSpecialAbilityState', 'function addSpecialAbilityPiece',
  'function isSpecialAbilityAvailableForEntity', 'SPECIAL_BREAKTHROUGH_QUESTS',
  "title:'Pressure Building'", "title:'Nine Round Rhythm'", "title:'Break the Limit'",
  "title:'Elastic Test'", "title:'Ricochet Research'", "title:'Build the House'",
  "title:'Sound Check'", "title:'Frequency Test'", "title:'Resonance'"
]) assert.ok(game.includes(marker),`missing major-update marker: ${marker}`);
assert.match(game,/ability\.pieces = Math\.min\(3/,'Special pieces cap at 3');
assert.match(game,/if \(ability\.unlocked\)[\s\S]{0,120}playerData\.coins/,'Completed piece rolls convert to a fallback reward');
assert.match(game,/special: createSpecialBreakthroughView/,'Special Breakthrough uses the existing Quest view architecture');
assert.match(game,/makeTab\('special', `✨ Unleash Potential/,'Unleash Potential is a real Quest tab');
assert.match(game,/function getSpecialClaimableCount\(\)/,'Quest badges use the implemented Special claim-count helper');
assert.match(game,/UNLEASH_POTENTIAL_DURATION_MS = 7 \* 24 \* 60 \* 60 \* 1000/,'Unleash Potential lasts seven days');
assert.match(game,/UNLEASH_POTENTIAL_FIGHTERS = Object\.freeze\(Object\.keys\(SPECIAL_ABILITY_DEFS\)\)/,'Every registered Special is obtainable through Unleash Potential');
assert.doesNotMatch(game,/minigunnin: \[[\s\S]{0,600}kind:'play_match'/,'Minigunnin Unleash Potential quests use combat objectives instead of match chores');
assert.doesNotMatch(game,/classy: \[[\s\S]{0,600}kind:'play_match'/,'Classy Unleash Potential quests use combat objectives instead of match chores');
assert.doesNotMatch(game,/splitter: \[[\s\S]{0,600}kind:'play_match'/,'Splitter Unleash Potential quests use combat objectives instead of match chores');
assert.match(game,/addSpecialQuestProgress\('minigunnin','use_super',1\)/,'Minigunnin Fortress deployments progress Unleash Potential');
assert.match(game,/addSpecialQuestProgress\('classy','main_attack',1\)/,'Classy Note Bursts progress Unleash Potential');
assert.match(game,/getSpecialAbilityDef\(ownerBaseBrawler\)[\s\S]{0,220}addSpecialQuestProgress\(ownerBaseBrawler,'main_hit',1\)/,'Main hits generically progress the matching Special quest path');
assert.match(game,/completed:false,rewardClaimed:false/,'Special quests separate completion from reward claims');
assert.match(game,/if\(!def\|\|!quest\|\|[\s\S]{0,180}!entry\?\.completed\|\|entry\.rewardClaimed\)return false/,'Special quest rewards can only be claimed once');
assert.match(game,/function addSpecialQuestProgress[\s\S]{0,420}isTraining \|\| isTutorialMode/,'Training and tutorial activity cannot progress Special quests');
assert.match(game,/const completedMatchFighter = selectedBrawler/,'Match end captures the Fighter who actually played');
assert.match(game,/addSpecialQuestProgress\(completedMatchFighter, 'play_match', 1\)/,'Play-match progress is awarded from the actual match-end flow');
assert.match(game,/changed && kind === 'play_match'[\s\S]{0,180}saveProgress\(\)/,'Special Play Match progress saves immediately at match completion');
assert.match(game,/UNLEASH_POTENTIAL_EVENT_ID = 'unleash-potential-2026-08-all-specials-v3'/,'Existing players receive the all-Special seven-day quest window without losing persistent ability data');
assert.doesNotMatch(game,/startBtn\.addEventListener[\s\S]{0,300}addSpecialQuestProgress\([^)]*'play_match'/,'Pressing Start does not progress Special play-match quests');

// Launch Specials.
assert.match(game,/outlitMutationShotCounter[\s\S]{0,260}>= 9[\s\S]{0,120}outlitMutationCharges = 4/,'Outlit charges four overpressure attacks after nine activations');
assert.match(game,/next 4 Scatter Pumps get \+100% range/,'Outlit Mutation UI describes all four overcharged shots');
assert.doesNotMatch(game,/Math\.min\(8, Math\.floor\(entity\.outlitMutationShotCounter/,'Outlit counter is not capped below its nine-shot trigger');
assert.match(game,/brawler==='outlit'.*outlitMutationCharges.*fireDelay\*=\.5/,'Outlit Mutation halves unload delay');
assert.match(game,/hcRangeMult[\s\S]{0,120}mutationOvercharged \? 2\.0 : 1\.0/,'Outlit Mutation doubles range');
assert.match(game,/echoInstinctStartedAt >= 8000|now - entity\.echoInstinctStartedAt >= 8000/,'Echo Instinct charges for eight seconds');
assert.match(game,/echoInstinctDuplicateAt = performance\.now\(\) \+ 800/,'Echo repeats exactly after 800ms');
assert.match(game,/ringSizeMod: 1\.6[\s\S]{0,420}maxLife: 1\.7/,'Echo repeat is 60% larger and travels farther');
assert.match(game,/Math\.min\(1000, Math\.max\(0, entity\.hp - 1\)\)/,'Signature cost cannot defeat its owner');
assert.match(game,/function paySignatureHpCost[\s\S]{0,420}entity\.lastDamagedAt=now[\s\S]{0,120}entity\.idleRegenNextAt=0/,'Signature HP payment resets the real natural-regeneration clock');
assert.match(game,/const perWave = 12[\s\S]{0,100}wave < 2/,'Bouncy Turret Signature fires two bounded radial waves');
assert.match(game,/function payBouncinTurretSignatureHpCost[\s\S]{0,240}Math\.min\(750,[\s\S]{0,180}TURRET HP/,'Bouncy Turret pays up to 750 HP when its Signature command activates');
assert.match(game,/bouncySignatureCounted\s*=\s*true/,'A collector projectile cannot count one overlap repeatedly');
assert.match(game,/bouncySignatureCollectorHitBalls\[ballKey\]/,'G1 Signature counts each collector ball at most once');
assert.match(game,/bouncySignatureFollowupBalls=gained/,'G1 Signature transfers the number of hit collector balls to exactly one follow-up volley');
assert.match(game,/owner\.bouncySignatureFollowupBalls=owner\.bouncySignatureCollectorHits/,'G1 Signature exposes the live collector result to the immediate next eligible attack');
assert.match(game,/signatureFollowup > 0[\s\S]{0,500}bouncySignatureCollectorActive = false/,'Consuming the Signature reward closes the collector and prevents later duplicate generations');
assert.match(game,/BOUNCIN_SIGNATURE_COOLDOWN_MS = 10000/,'Bouncin Signature has the requested ten-second cooldown');
assert.equal((game.match(/isBouncyTurret: true/g) || []).length >= 2,true,'both player and bot Bouncy Turrets remain implemented');
assert.equal((game.match(/hp: 6000, maxHp: 6000[\s\S]{0,120}decayPerSec: 6000 \/ 17\.5/g) || []).length,2,'player and bot Bouncy Turrets have 6000 HP while preserving their original lifetime');
assert.match(game,/bouncySignatureCollectorArmed = true[\s\S]{0,100}bouncySignatureCooldownUntil/,'G1 collector activation starts its Signature cooldown');
assert.match(game,/g1 \? 1\.5 : 1\.0/,'Signature collector keeps Elasticity flat range');
assert.match(game,/bouncySignatureWallRangePct=\.20/,'Signature collector balls gain twenty-percent range on wall bounce');
assert.match(game,/b\.bouncySignatureCollector&&b\.bouncySignatureWallRangePct>0[\s\S]{0,420}b\.maxBounceDist=/,'Wall collisions extend Signature collector travel distance');
assert.match(game,/const signatureCollector=!!player\.bouncySignatureCollectorArmed[\s\S]{0,1000}const baseTravel=projectileSpeed\*projectileLife/,'Bouncin aim telegraph mirrors the live attack geometry');
assert.match(game,/const signatureWallTravelGain=signatureCollector\?baseTravel\/1\.5\*\.20:0/,'Signature aim telegraph calculates twenty-percent pre-G1 wall range gain');
assert.match(game,/if\(signatureCollector\)[\s\S]{0,100}distLeft\+=signatureWallTravelGain/,'Signature aim telegraph previews its additive wall range gain');
assert.match(game,/function lockMainAttackSequence\(owner, durationMs,[\s\S]{0,500}owner\.mainAttackSequenceUntil=/,'Scheduled volleys use a centralized attack-sequence lock');
assert.match(game,/if\((?:!cursedForcedAttack && )?now < \(fromEntity\.mainAttackSequenceUntil\|\|0\)\)return;/,'A new ammo attack cannot begin during the current launch sequence');
assert.match(game,/brawler === 'fuser'[\s\S]{0,520}lockMainAttackSequence\(fromEntity,\s*11\s*\*\s*delay,\s*now\)/,'Fuser cannot overlap twelve-round bursts');
assert.match(game,/lockMainAttackSequence\(fromEntity,\(balls-1\)\*88,now\)/,'Bouncin Balls cannot overlap multi-ball volleys');
assert.match(game,/progress\.selectedGadget=selectedGadget[\s\S]{0,220}saveProgress\(\)/,'Changing gadgets persists the selected slot');
assert.match(game,/if\(b\.echoInstinctVisual\)/,'Echo Instinct projectile has dedicated visible VFX');
assert.match(game,/isInstinctRing = !!r\.sourceBullet\?\.echoInstinctVisual/,'Echo Instinct impact ring has dedicated visible VFX');
assert.match(game,/if\(b\.isEchoRingProj\)[\s\S]{0,700}bezierCurveTo/,'Regular Echo attacks have a dedicated traveling waveform visual');
assert.doesNotMatch(game,/distFromPlayer > coneRange/,'Legacy 140px Outlit limiter cannot cancel normal or Mutation range');
assert.match(game,/mutationReady\?2:1/,'Outlit telegraph includes the active Mutation range multiplier');
assert.match(game,/b\.outlitMutationPull[\s\S]{0,1000}target\.ghoulPushUntil/,'Outlit Mutation applies a smooth inward displacement');
assert.match(game,/color: '#ff4b55'/,'Mutation uses its red family color');
assert.match(game,/color: '#ffd34f'/,'Signature uses its gold family color');
assert.match(game,/color: '#62ef88'/,'Instinct uses its green family color');
assert.match(game,/else if \(b\.ownerBrawler === 'outlit'\) \{[\s\S]{0,1200}if\(b\.mutationVisual\)/,'Outlit render branch prioritizes red Mutation projectiles over normal/skin colors');

// Minigunnin Mutation and Classy Signature.
assert.match(game,/minigunnin:[\s\S]{0,180}type: 'mutation'[\s\S]{0,180}Incendiary Belt/,'Minigunnin has the Incendiary Belt Mutation');
assert.match(game,/classy:[\s\S]{0,180}type: 'signature'[\s\S]{0,180}Marching Encore/,'Classy has the Marching Encore Signature');
assert.match(game,/MINIGUNNIN_MUTATION_TRIGGER_BULLETS = 50/,'Minigunnin Mutation triggers after fifty bullets');
assert.match(game,/MINIGUNNIN_MUTATION_INCENDIARY_ROUNDS = 20/,'Minigunnin Mutation arms twenty incendiary rounds');
assert.match(game,/minigunninMutationFireZones\.push\(\{[^}]*until:performance\.now\(\)\+1200/,'Minigunnin incendiary fire zones last 1.2 seconds');
assert.match(game,/minigunninMutationZoneStage: mutationExplosive \? Math\.floor\(Math\.random\(\)\*3\)/,'Each incendiary round independently chooses launch, middle, or endpoint placement');
assert.match(game,/zoneProgress = b\.minigunninMutationZoneStage === 0 \? 0\.12 : 0\.50/,'Launch and midpoint zones appear during projectile travel');
assert.match(game,/if \(hitCube && b\.minigunninMutationExplosive\) ensureMinigunninMutationImpactZone\(b\)/,'An early wall impact cannot waste the incendiary zone');
assert.match(game,/if \(b\.minigunninMutationExplosive\) ensureMinigunninMutationImpactZone\(b\)/,'An early entity impact cannot waste the incendiary zone');
assert.equal((game.match(/ownerId: (?:player|bot)\.id[^}\n]*expiresAt: now \+ 7000/g)||[]).length>=3,true,'Player, skin, and bot Minigunnin Super walls expire after seven seconds');
assert.match(game,/function updateMinigunninMutationZones\(now\)[\s\S]{0,900}isMinigunninMutationFire:true/,'Minigunnin fire zones use their shared runtime updater');
assert.match(game,/classySignatureUntil=now\+6000/,'Classy Signature commands its speaker for six seconds');
assert.match(game,/fighterId === 'classy'[\s\S]{0,420}paySignatureHpCost\(entity\)/,'Classy pays its Signature HP cost only when Marching Encore is ready');
assert.match(game,/classySignatureMirror:true/,'Classy Signature speaker mirrors Classy attacks');
assert.match(game,/pod\.isClassySpeaker && now < \(pod\.classySignatureUntil \|\| 0\)[\s\S]{0,650}canMoveToPosition/,'Classy Signature speaker walks without ignoring collision');
assert.match(game,/if \(b\.minigunninMutationExplosive\)[\s\S]{0,500}#ff9a42/,'Incendiary bullets have dedicated lightweight visuals');
assert.match(game,/b\.classySignatureMirror \? 'rgba\(255,232,112/,'Mirrored Classy notes use Signature gold visuals');
assert.match(game,/brawler === 'classy' \? \.4/,'Classy projectile hits have a dedicated Hyper-charge reduction');

// Splitter rework and Fractal Reflex Instinct.
assert.match(game,/splitter:[\s\S]{0,180}type: 'instinct'[\s\S]{0,180}Fractal Reflex/,'Splitter has the Fractal Reflex Instinct');
assert.match(game,/SPLITTER_INSTINCT_COOLDOWN_MS = 4000/,'Fractal Reflex refreshes every four seconds');
assert.match(game,/splitPlan: \[5\][\s\S]{0,80}generationCaps: \[5\]/,'Normal Splitter main fractures one core into five');
assert.match(game,/splitPlan = \[\.\.\.splitPlan, 2\][\s\S]{0,120}generationCaps = \[5, 10\]/,'Fractal Reflex adds a final five-to-two generation');
assert.match(game,/const instinctPair = !!b\.splitterInstinctVisual && generationIndex > 0/,'Fractal Reflex identifies only its final 5-to-2 generation');
assert.match(game,/const fanCap = instinctPair \? 0\.48 : \(b\.splitterHyperMain \? 2\.55 : 2\.25\)/,'Instinct pairs use a small local cone while Hyper keeps its wide main fan');
assert.match(game,/maxLife: SPLITTER_SUPER_INITIAL_LIFE[\s\S]{0,100}splitterPostSplitLife: SPLITTER_SUPER_POST_SPLIT_LIFE/,'Super core loses 90% pre-split range while preserving post-split reach');
assert.match(game,/splitPlan:\s*\[2,2,2,2\][\s\S]{0,100}generationCaps:\s*\[2,4,8,16\]/,'Splitter Super uses its 1-2-4-8-16 fracture tree');
assert.match(game,/directions\s*=\s*isHyper\s*\?\s*\[angle, angle \+ Math\.PI \* 2 \/ 3, angle - Math\.PI \* 2 \/ 3\]/,'Hyper Splitter fires the Super tree in three directions');
assert.match(game,/else if \(b\.ownerBrawler === 'splitter'\)[\s\S]{0,900}splitterInstinctVisual/,'Splitter projectiles have dedicated lightweight visuals');
assert.match(game,/INSTINCT - 1 > 5 > 2 READY/,'Splitter HUD communicates the current Instinct pattern');

// Peter Pickle Instinct and Evil Doctor Mutation.
assert.match(game,/peter_pickle:[\s\S]{0,200}type: 'instinct'[\s\S]{0,200}Pickle Proliferation/,'Peter Pickle has a personalized Instinct');
assert.match(game,/instinctEligible=isSpecialAbilityAvailableForEntity\(fromEntity,'peter_pickle'\)&&sizeMult>2/,'Peter Instinct arms only above 2x attack size');
assert.match(game,/b\.peterPickleInstinctEligible[\s\S]{0,160}spawnPeterPickleMinion\(owner, target\.x, target\.y/,'An eligible real hit hatches a living pickle at impact');
assert.match(game,/evil_doctor:[\s\S]{0,200}type: 'mutation'[\s\S]{0,200}Double Trouble/,'Evil Doctor has the Double Trouble Mutation');
assert.match(game,/evilDoctorMutationAttackCount >= EVIL_DOCTOR_MUTATION_SETUP_ATTACKS[\s\S]{0,420}return true/,'The attack after three setup syringes is empowered');
assert.match(game,/600 \* \(b\.evilDoctorDoubleTrouble \? 2 : 1\)/,'Double Trouble doubles syringe poison damage');
assert.match(game,/function applyEvilDoctorDoubleTroubleHeal[\s\S]{0,900}grantShield\(entity, overflow/,'Double Trouble converts excess healing into real shield HP');

// Fuser Live Fuse repair and Fusebox Override Signature.
assert.match(game,/fuser:[\s\S]{0,200}type: 'signature'[\s\S]{0,200}Fusebox Override/,'Fuser has a registered Signature and quest path');
assert.match(game,/function triggerFuserLiveFuseExplosion[\s\S]{0,500}AOEDamage/,'Live Fuse has an explicit endpoint explosion');
assert.match(game,/if \(b\.isFuserBullet && b\.fuserLiveFuse && !b\.super\)[\s\S]{0,150}triggerFuserLiveFuseExplosion/,'Live Fuse triggers only from main-bullet maximum-range expiry');
assert.match(game,/fuserLiveFuse:liveFuse&&!curved/,'Curved Gadget shots stay distinct from Live Fuse straight-shot explosions');
assert.match(game,/fuserCurved:curved[\s\S]{0,240}fuserCurveCycles:signatureWiggle\?1\.55:\.55/,'Crossed Wires curves normally and uses a stronger Signature swiggle');
assert.match(game,/player\.fuserSignatureArmed = false;[\s\S]{0,100}player\.fuserStoredAmmo = 0/,'Fuser Signature state resets safely between matches');
assert.match(game,/player\.fuserStoreFourthOnReload = true[\s\S]{0,180}4TH AMMO ON NEXT RELOAD/,'Signature Spare Magazine arms the stored fourth-ammo reward');
assert.match(game,/selectedBrawler === 'fuser' && player\.fuserStoreFourthOnReload[\s\S]{0,260}player\.fuserStoredAmmo = 1/,'The next real reload creates exactly one stored fourth ammo');
assert.match(game,/useFuserStoredAmmo[\s\S]{0,1000}player\.fuserStoredAmmo = Math\.max/,'Stored Fuser ammo is consumed once without removing normal ammo');

// Controls and Training.
assert.match(html,/id="signature"[\s\S]{0,120}Signature \(R\)/,'Desktop Signature button exposes its R binding');
assert.match(game,/if\(k === 'r'\)[\s\S]{0,80}activateSignatureAbility/,'R activates Signature');
assert.match(game,/signatureTouchBtn[\s\S]{0,420}setAttribute\('aria-label', 'Use Signature'\)/,'Mobile Signature control exists');
assert.match(game,/TRAINING MODE · ALL ABILITIES ENABLED/,'Training explicitly advertises the sandbox override');
assert.match(game,/if \(isTraining\) return true;[\s\S]{0,180}isSpecialAbilityUnlocked/,'Training bypasses Special ownership without save mutation');

// Retirement migration and terminology.
assert.match(game,/retired = countOwnedSlots[\s\S]{0,180}const refund = retired \* 350/,'Retired Tool/Talent Attachies refund exactly 350 each');
assert.match(game,/playerData\.attachies\.gadget = \{\}[\s\S]{0,80}playerData\.attachies\.star = \{\}/,'Retired Attachie runtime buckets are cleared');
assert.match(game,/Core Surge Attachies remain active/,'Core Surge Attachies remain player-facing and preserved');
assert.match(game,/function toBraweTerms/,'Central player-facing BRAWE terminology formatter exists');
assert.match(game,/rarity === 'Super Rare' \? 'Elite'/,'Legacy Super Rare displays as Elite');

// Awakenator and Anomaly.
for(const id of ['awakenator','darkener','crystila']) assert.match(anomaly,new RegExp(`'${id}'`),`${id} is in Anomaly roster`);
assert.match(game,/Anomaly: 750/,'Anomaly Soul cost is 750');
assert.match(game,/awakenator:[\s\S]{0,30}8/,'Awakenator uses an eight-hit Power Move charge rule');
assert.match(game,/ownerBrawler:'awakenator',\s*isAwakenatorMain:true/,'Awakenator main is a distinct projectile');
assert.match(game,/Math\.round\(950 \* scale\)/,'Awakenator Power 11 main damage is 950');
assert.match(game,/awakenatorSleepUntil[\s\S]{0,100}0\.60/,'Sleep applies the 40% movement reduction');
assert.match(game,/awakenatorSleepUntil[\s\S]{0,140}0\.80/,'Sleep applies the 20% outgoing damage reduction');
assert.match(game,/awakenatorCorruptAttacks[\s\S]{0,180}hyper \? 2 : 1/,'Core Surge Power Move corrupts two attacks');
assert.match(game,/target\.hp = Math\.max\(1, target\.hp - target\.hp \* \.30\)/,'Core Surge removes 30% current HP without defeating');
assert.match(game,/awakenatorCorruptFriendlyUntil[\s\S]{0,180}mult \*= 0\.30/,'Corrupted friendly attacks deal 30% damage');

// Known fixes and display-only health smoothing.
assert.match(game,/ownerBrawler: 'sera_eclipse', isSeraFlare: true, super: true/,'Sera Core-Surge flares are Power Move projectiles');
assert.match(game,/if\(brawlerId==='duck'\)return 4/,'Duck native ammo supports its four-ammo stream');
assert.match(game,/about 75% max HP and grants 800ms/,'Angel Second Life description matches runtime');
assert.match(game,/DEBT, slowing reload for 3 seconds/,'Money & Tax copy describes current DEBT behavior');
assert.match(game,/forest:'Controller'/,'Forest standardized role is Controller');
assert.match(game,/function getSmoothDisplayedHp[\s\S]{0,260}entity\.displayHp/,'Object health rendering is smoothed without changing internal HP');

console.log('Major special-system update regression suite passed.');
