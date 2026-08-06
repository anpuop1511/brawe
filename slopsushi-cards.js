(() => {
  const icons={Epic:'🍙',Mythic:'🍣',Legendary:'🍱',Exotic:'🧬'};
  const C=(rarity,name,desc,effects)=>({rarity,name,desc,effects,icon:icons[rarity]});
  const D=(id,cards)=>cards.map((card,index)=>({id:`${id}_sushi_${index+1}`,...card}));

  // Each entry supplies the real move names and a unique visual/flavor identity.
  // Cards are generated from rotating mechanic mutations so all 360 cards alter
  // an attack, Super, resource loop, or survivability state in live gameplay.
  const S={
    outlit:['Scatter Pump','Boom Break','Shell'],fuser:['Eight-Fuse Salvo','Wall-Fuser Barrage','Instability'],predator:['Through the Prey','No Escape','Hunt'],orbo:['Crisscross Orbit','Orbital Horizon','Cosmos'],homer:['Learning Shot','Targeting Pair','Lock-On'],peter_pickle:['Pickle Pitch','Petah\'s Pickles','Brine'],unstable:['Containment Failure','Going Unstable','Genome'],echo:['Sound Wave','Resonance','Reverb'],cheseypuff:['Cheese Ball','Cheese Aura','Fondue'],decayer:['Decay Shot','Dark Orbit','Void'],
    unopcoloco:['Scarf & Whack','Scarf Clonin','Fiesta'],dashaholic:['Claw Slash','Unleash the Dashaholic','Adrenaline'],trapper:['Slam Gate','Sound Fence','Backstage'],classy:['Note Burst','Bass Drop','Encore'],
    hyperorigin:['Origin Slam','Purple Unleashed','Origin'],heater_miser:['Thermal Tether','Intergalactic Heat','Furnace'],minigunnin:['Minigun Stream','Bullet Storm','Ammo'],steamer:['Steam Stream','Railroad Rush','Boiler'],
    bowlin_rida:['Bowling Burst','Pin Strike','Perfect Game'],money_and_tax:['Coin Waves','Market Crash','Profit'],hunter:['Delay Sweep','I Found You','Tracker'],chaird:['Chair Toss','Chair Spin','Furniture'],
    forest:["Nature's Wrath",'Avian Ally','Canopy'],bouncin_balls:['Ricochet Volley','Bouncy House','Pinball'],goonbob:['Gooey Splatter','Blobert Jar','Slime'],tempo_maker:['Twin Cadence','Tempo Break','Rhythm'],
    overlord:['Royal Impact','Ascension','Crown'],copyphase:['Phase Orb','Phase Theft','Glitch'],fightnfire:['Firework Shot','Firestorm','Spark'],beast:['Twin Claws','Unleash the Beast','Feral'],
    amplifier:['Ampifin','Screws and Nuts','Toolbox'],skeleflying:['Parachute Drop','Skeleton Portals','Bone'],crystila:['Crystal Arms','Overreflect','Prism'],hope:['Hopeful Shot','You Broke My Hope','Heart'],
    evil_doctor:['Infectious Shot','Spread My Virus','Virus'],splitter:['Split Grenade','Splitin Off','Fractal'],scuba_diver:['Bubble Barrage','Dash Underwater','Deep Sea'],hoop:['Bounce Breaker','Full-Court Crash','Heat Check'],
    screener:['Projected Sweep','Projected Charge','Pixel'],malakor:['Putting You Down','Hell Is Forever','Infernal'],beam:['Focus Beam','Golden Beam','Prism'],paradox:['Temporal Skip','Relativity Zone','Time'],
    sera_eclipse:['Eclipse Flare','Eclipse Orbit','Corona'],boom_arang:['Boomerang Toss','Gravity Recall','Orbit'],teether:['Bite Pattern','Tooth Fairy','Dental'],fuel:['Finger Flames','Five Flame Finger','Blowtorch'],
    xray:['Infrared Reading','Full Body Scan','Radiology'],angel:['Guiding Light','Second Life','Halo'],demon:['Hellblade','Demonic Doom','Abyss'],warrior:['Twin Spears','Final Stand','Phalanx'],relay:['Shield Signal','Move My Damage','Bandwidth'],upiedown:['Pie in the Sky','Upside-Down Pie','Bakery'],chickpig:['Breakfast Blast','Farmyard Rush','Farmhouse'],jetpack:['Crash Landing','I Drop Bombs','Flight Deck'],snapper:['Marking Orb','Snap!','Perfect Mark'],robber:['Stolen Fortune','Grand Theft Ammo','Heist'],ice_cream:['Frozen Cone','Brain Freeze Dash','Soft Serve'],swimmer:['Power Stroke','Release the Tide','Gold Medal'],boomer:['Boom-Nite Quartet','Big Boomer','Powder Keg'],blade_vane:['Vane Cleave','Blood Cyclone','Bloodline'],adlof:['Master Plan','Hostile Takeover','Scheme'],cluster:['Airburst Cluster','Uppercut Minefield','Demolition']
  };

  S.rocketeer=['Breakup Rocket','Triple Impact','Warhead'];

  const attackMutations=[
    (a,n)=>[`${n} Colossus`,`${a} becomes 55% larger.`,{sushiAttackSizePct:.55}],
    (a,n)=>[`${n} Longline`,`${a} travels 75% farther.`,{sushiAttackRangePct:.75}],
    (a,n)=>[`${n} Fork`, `Every ${a} forks into 2 angled copies dealing 62% damage.`,{sushiAttackForks:2}],
    (a,n)=>[`${n} Guidance`,`${a} strongly homes toward enemies within 620 pixels.`,{sushiAttackHoming:.9,sushiAttackHomingRadius:620}],
    (a,n)=>[`${n} Pinball`,`${a} bounces and gains 220% additional travel.`,{sushiAttackBounceRangePct:2.2}],
    (a,n)=>[`${n} Recall`,`${a} turns around halfway and returns through enemies.`,{sushiAttackReturn:1}],
    (a,n)=>[`${n} Needle`,`${a} pierces every enemy it touches.`,{sushiAttackPierce:1}],
    (a,n)=>[`${n} Rail`,`${a} flies 45% faster and 35% farther.`,{sushiAttackSpeedPct:.45,sushiAttackRangePct:.35}]
  ];
  const superMutations=[
    (s,n)=>[`${n} Grand Finale`,`${s} projectiles become 80% larger.`,{sushiSuperSizePct:.8}],
    (s,n)=>[`${n} Full Reach`,`${s} projectiles travel 100% farther.`,{sushiSuperRangePct:1}],
    (s,n)=>[`${n} Encore`,`${s} projectiles fork into 2 additional copies.`,{sushiSuperForks:2}],
    (s,n)=>[`${n} Lock-On`,`${s} projectiles home toward enemies.`,{sushiSuperHoming:1,sushiSuperHomingRadius:760}],
    (s,n)=>[`${n} Breakthrough`,`${s} projectiles pierce enemies.`,{sushiSuperPierce:1}],
    (s,n)=>[`${n} Rebound`,`${s} projectiles bounce with 250% extra travel.`,{sushiSuperBounceRangePct:2.5}],
    (s,n)=>[`${n} Aftershock`,`Casting ${s} grants 2400 shield and 28% speed for 4 seconds.`,{superShield:2400,superSpeedPct:.28,superSpeedMs:4000,shieldCap:5200}],
    (s,n)=>[`${n} Second Serving`,`Casting ${s} restores 2 ammo and heals 1600 HP.`,{superAmmo:2,superHeal:1600}]
  ];

  // These Supers are transformations, zones, summons, dashes, shields or
  // deployables. Projectile modifiers did nothing on them, so they receive
  // cast-triggered powers that the shared Super runtime can always apply.
  const nonProjectileSupers=new Set([
    'cheseypuff','decayer','unopcoloco','dashaholic','trapper','classy','hyperorigin',
    'steamer','hunter','chaird','forest','tempo_maker','overlord','copyphase','beast',
    'amplifier','skeleflying','crystila','scuba_diver','screener','malakor','beam',
    'paradox','sera_eclipse','fuel','xray','angel','demon','warrior','relay','upiedown','chickpig','jetpack','snapper','unstable','predator','ice_cream','swimmer','boomer','blade_vane','cluster'
  ]);
  const castSuperMutations=[
    (s,n)=>[`${n} Aftershock`,`Casting ${s} grants 2400 shield and 28% speed for 4 seconds.`,{superShield:2400,superSpeedPct:.28,superSpeedMs:4000,shieldCap:5200}],
    (s,n)=>[`${n} Second Serving`,`Casting ${s} restores 2 ammo and heals 1600 HP.`,{superAmmo:2,superHeal:1600}],
    (s,n)=>[`${n} Emergency Plating`,`Casting ${s} immediately grants a 3200 shield.`,{superShield:3200,shieldCap:5600}],
    (s,n)=>[`${n} Full Recovery`,`Casting ${s} immediately heals 2600 HP.`,{superHeal:2600}],
    (s,n)=>[`${n} Instant Reload`,`Casting ${s} restores all 3 ammo.`,{superAmmo:3}],
    (s,n)=>[`${n} Overdrive`,`Casting ${s} grants 45% speed for 5 seconds.`,{superSpeedPct:.45,superSpeedMs:5000}],
    (s,n)=>[`${n} Safe Deployment`,`Casting ${s} grants 1800 shield and heals 1400 HP.`,{superShield:1800,superHeal:1400,shieldCap:4800}],
    (s,n)=>[`${n} Combat Reset`,`Casting ${s} restores 1 ammo, heals 1200 HP and grants 25% speed.`,{superAmmo:1,superHeal:1200,superSpeedPct:.25,superSpeedMs:4000}]
  ];

  function makeDeck(id,index){
    const [attack,superName,flavor]=S[id];
    // Fixed offsets guarantee three different attack cards in every deck.
    const a1=attackMutations[index%8](attack,flavor),a2=attackMutations[(index+3)%8](attack,flavor),a3=attackMutations[(index+5)%8](attack,flavor);
    const superPool=nonProjectileSupers.has(id)?castSuperMutations:superMutations;
    // A +3 offset cannot collide in an eight-card pool.
    const s1=superPool[(index+1)%8](superName,flavor),s2=superPool[(index+4)%8](superName,flavor);
    return [
      C('Epic',a1[0],a1[1],a1[2]),
      C('Epic',a2[0],a2[1],a2[2]),
      C('Epic',`${flavor} Momentum`,`${attack} grants 18% speed on hit; fire and reload 14% faster.`,{hitSpeedPct:.18,hitSpeedMs:1800,fireDelayPct:.14,reloadPct:.14}),
      C('Mythic',a3[0],a3[1],a3[2]),
      C('Mythic',s1[0],s1[1],s1[2]),
      C('Mythic',`${flavor} Feedback`,`${attack} chains 30% damage to a nearby enemy and converts 18% damage into shield.`,{chainDamagePct:.30,chainRadius:300,damageShieldPct:.18,shieldCap:3800}),
      C('Legendary',s2[0],s2[1],s2[2]),
      C('Legendary',`${flavor} Impossible Course`,`${attack} gains 40% size and range; casting ${superName} restores 1 ammo and grants 1800 shield.`,{sushiAttackSizePct:.4,sushiAttackRangePct:.4,superAmmo:1,superShield:1800,shieldCap:4600})
    ];
  }

  const ids=Object.keys(S);
  const decks={}; ids.forEach((id,index)=>decks[id]=makeDeck(id,index));

  // Signature overrides use dedicated runtime hooks for the most identity-heavy kits.
  const O=(id,slot,card)=>{decks[id][slot]=card;};
  O('ice_cream',0,C('Epic','Triple Scoop Stack','Frozen Cone becomes 3 tightly packed scoops. Each deals 55% damage and adds 18% Freeze.',{iceCreamTripleScoop:1}));
  O('ice_cream',1,C('Epic','Waffle Cone Shatter','Frozen Cone grows 65% wider and shatters into 2 side scoops on its first enemy hit.',{iceCreamWaffleShatter:1}));
  O('ice_cream',2,C('Epic','Deep Freezer Dial','Every Ice Cream attack, dash scoop, and puddle applies 45% more Freeze.',{iceCreamFreezePct:.45}));
  O('ice_cream',3,C('Mythic','Brain Freeze Express','Brain Freeze Dash plants 3 additional firing cones along its route.',{iceCreamExtraDashCones:3}));
  O('ice_cream',4,C('Mythic','Black Ice Sundae','Hyper puddles become 80% larger and remain for 1.5 additional seconds.',{iceCreamPuddleRadiusPct:.8,iceCreamPuddleBonusMs:1500}));
  O('ice_cream',5,C('Mythic','Scoop Crossfire','Every Brain Freeze cone fires forward and backward in addition to left and right.',{iceCreamCrossfire:1}));
  O('ice_cream',6,C('Legendary','Shatter Celebration','Freezing an enemy bursts for 450 damage and adds 25% Freeze to every nearby enemy.',{iceCreamFreezeBurst:450}));
  O('ice_cream',7,C('Exotic','ABSOLUTE ZERO','A direct Frozen Cone sets enemies to at least 70% Freeze. Super scoops pierce, and Hyper puddles pull enemies toward their frozen center.',{iceCreamAbsoluteZero:1}));
  O('swimmer',0,C('Epic','Olympic Lane','Power Stroke becomes 55% wider without reducing its center-hit reward.',{swimmerWidthPct:.55}));
  O('swimmer',1,C('Epic','Dolphin Kick','Every Power Stroke swims 85% farther forward.',{swimmerDashPct:.85}));
  O('swimmer',2,C('Epic','Center-Lane Buoys','The perfect center lane becomes 100% wider.',{swimmerCenterWidthPct:1}));
  O('swimmer',3,C('Mythic','Protein Tide','All successful strokes build 50% more Strength.',{swimmerStrengthGainPct:.5}));
  O('swimmer',4,C('Mythic','High-Tide Release','Release the Tide splash areas become 45% larger.',{swimmerSuperRadiusPct:.45}));
  O('swimmer',5,C('Mythic','Ice-Bath Current','Release the Tide slows enemies for 1.5 additional seconds.',{swimmerSuperSlowMs:1500}));
  O('swimmer',6,C('Legendary','Backwash Championship','Every Super splash smoothly carries enemies away from its center.',{swimmerSuperBackwash:1}));
  O('swimmer',7,C('Exotic','PERFECT OLYMPIAN','Power Stroke calculates range and damage with +2 Strength and every hit earns the center reward. Release the Tide always creates 3 splash areas.',{swimmerOlympic:1}));
  O('boomer',0,C('Epic','Three Becomes Five','Every Boom-Nite throw carries 2 additional sticks.',{boomerExtraSticks:2}));
  O('boomer',1,C('Epic','Blast-Cap Buffet','Every Boom-Nite blast becomes 40% larger.',{boomerBlastRadiusPct:.4}));
  O('boomer',2,C('Epic','Lightning Fuse Braid','Ignited sticks chain 55% faster.',{boomerChainSpeedPct:.55}));
  O('boomer',3,C('Mythic','Practice Ricochets','Boom-Nite always records one extra bounce explosion, even outside Hypercharge.',{boomerPracticeBounce:1}));
  O('boomer',4,C('Mythic','Patient Powder Keg','Big Boomer gains 0.9 seconds of fuse time for feeding.',{boomerFuseBonusMs:900}));
  O('boomer',5,C('Mythic','Overfeed the Beast','Each absorbed volley adds 20% more Big Boomer damage.',{boomerFeedPct:.2}));
  O('boomer',6,C('Legendary','Compass of Chaos','Hyper Big Boomer gains 4 additional release directions.',{boomerRadialDirections:4}));
  O('boomer',7,C('Exotic','THE LAST BOOM','Every main throw records all 3 bounce explosions. Hyper Big Boomer releases a third 360-degree wave.',{boomerGrandFinale:1}));
  O('money_and_tax',0,C('Epic','Money Printer Platter','Money mode fires 2 additional waves of coins.',{moneyExtraWaves:2}));
  O('money_and_tax',1,C('Epic','Center-Coin Stimulus','At full ammo, center coins grow 90% and deal 35% more damage.',{moneyCenterSizePct:.9,moneyCenterDamagePct:.35}));
  // Bouncin' Balls has a fully bespoke deck. Every card changes his volley,
  // wall-bank, split-ball, or Bouncy House loop instead of borrowing a shared
  // projectile/stat template.
  O('bouncin_balls',0,C('Epic','Around-the-World Roll','Every attack and Super ball gets 400% more travel distance for absurd cross-map bank shots.',{bouncyRangePct:4}));
  O('bouncin_balls',1,C('Epic','Ball Pit Collision','The first enemy hit by each ball bursts it into 2 smaller balls that rebound in opposite directions.',{bouncySplitOnHit:1}));
  O('bouncin_balls',2,C('Epic','Rapid-Fire Rack','Ricochet Volley loads 4 extra balls and releases the entire rack 35% faster.',{bouncyExtraBalls:4,bouncyVolleyDelayPct:.35}));
  O('bouncin_balls',3,C('Mythic','Bank Interest','Each wall bounce grows that ball by 18% and raises its current damage by 12%, stacking up to 5 banks.',{bouncyBounceSizePct:.18,bouncyBounceDamagePct:.12}));
  O('bouncin_balls',4,C('Mythic','Called Bank','After its first wall bounce, each ball locks onto the nearest enemy while keeping its rebound speed.',{bouncyCalledBank:1}));
  O('bouncin_balls',5,C('Mythic','Bouncy House Speakers','Every Bouncy House ball creates a 420-damage, 82-radius shockwave whenever it hits a wall.',{bouncySuperBounceBlast:420,bouncySuperBounceBlastRadius:82}));
  O('bouncin_balls',6,C('Legendary','Third-Bank Jackpot','On its third wall bounce, each ball explodes and launches 6 mini-balls in every direction. This happens once per ball.',{bouncyThirdBounceBurst:6}));
  O('bouncin_balls',7,C('Exotic','Perpetual Motion','Every attack and Super ball bounces forever, keeps full damage, pierces enemies, and has infinite range.',{bouncyInfiniteBounce:1}));
  // Minigunnin's deck is built around his belt-fed firing loop, permanent
  // Max-HP growth, and the walls/healing/turret pieces of Healing Fort.
  O('minigunnin',0,C('Epic','Bottomless Belt Buffet','Minigun Stream consumes 1 belt round per shot instead of 2, effectively doubling sustained fire time.',{minigunAmmoCost:1}));
  O('minigunnin',1,C('Epic','Brass Avalanche','Every trigger tick fires 2 additional rounds in a wider layered spray.',{minigunExtraRounds:2}));
  O('minigunnin',2,C('Epic','Redline Receiver','Continuous fire builds 1 Redline stage per shot, up to 20. Each stage adds 4% bullet damage; pausing resets the engine.',{minigunRedlinePct:.04,minigunRedlineCap:20}));
  O('minigunnin',3,C('Mythic','Wall-Eater Tracer','Every 8th round becomes a huge piercing tracer that explodes for 520 damage on its first enemy hit.',{minigunTracerEvery:8,minigunTracerBlast:520}));
  O('minigunnin',4,C('Mythic','Hospital-Sized Hospital','Healing Fort gains 55% healing radius and restores 80% more HP every pulse.',{minigunFortRadiusPct:.55,minigunFortHealPct:.8}));
  O('minigunnin',5,C('Mythic','Concrete Donut','Healing Fort builds 12 additional wall blocks, and every block gains 60% more HP.',{minigunExtraWalls:12,minigunWallHpPct:.6}));
  O('minigunnin',6,C('Legendary','Fort With Benefits','Healing Fort is always armed—even without Hypercharge. Its attack pulses 65% faster and deal 75% more damage.',{minigunArmedFort:1,minigunTurretSpeedPct:.65,minigunTurretDamagePct:.75}));
  O('minigunnin',7,C('Exotic','THE ENTIRE AMMO FACTORY','Minigunnin has unlimited belt ammo, always fires 5 rounds, stays at maximum Redline, and every round becomes an explosive piercing tracer. Healing Fort receives every fort upgrade.',{minigunAmmoFactory:1}));
  // Boom-Arang's deck is entirely built around his one-weapon throw/catch,
  // enemy tags, returning lane, and Gravity Recall pull path.
  O('boom_arang',0,C('Epic','Twin Flight Plan','Boomerang Toss throws a second angled boomerang dealing 65% damage. Both must return before the next throw.',{boomTwinToss:1}));
  O('boom_arang',1,C('Epic','Tag Popcorn','Every TAG BOOM launches 4 mini-boomerangs outward from the tagged enemy.',{boomTagBurst:4}));
  O('boom_arang',2,C('Epic','Express Return','Returning boomerangs fly 65% faster, deal 105% of outgoing damage instead of 80%, and heal 900 HP when caught.',{boomReturnSpeedPct:.65,boomReturnDamagePct:.25,boomCatchHeal:900}));
  O('boom_arang',3,C('Mythic','Catch and Release','Catching a main boomerang instantly sprays 6 mini-boomerangs in a full circle.',{boomCatchBurst:6}));
  O('boom_arang',4,C('Mythic','Tag, You Are All It','Applying a fresh tag copies it to the 2 nearest enemies around the target.',{boomTagRelay:2}));
  O('boom_arang',5,C('Mythic','Gravity Traffic Jam','Gravity Recall launches 5 boomerangs instead of 3 and each path has 75% more pull radius.',{boomSuperExtra:2,boomPullRadiusPct:.75}));
  O('boom_arang',6,C('Legendary','Orbit Guard','Every catch creates 3 orbiting boomerangs for 5 seconds. They repeatedly slice enemies who approach Boom-Arang.',{boomOrbitGuard:3}));
  O('boom_arang',7,C('Exotic','Boomerang Galaxy','Boom-Arang gains unlimited throws: every main attack launches 5 boomerangs and Gravity Recall launches 9.',{boomGalaxy:1}));
  // Skeleflying turns the arena itself into an airborne skeleton invasion.
  // These cards mutate his para-shoot formations, landing events, portals,
  // and summoned troopers instead of using shared projectile stat templates.
  O('skeleflying',0,C('Epic','Bone Carpet Formation','Para-Shoot Barrage drops 7 parachutes across a much wider formation instead of 3.',{skeleMainExtraDrops:4,skeleMainSpreadPct:.7}));
  O('skeleflying',1,C('Epic','Dead-Air Encore','Every para-shoot landing calls down a smaller encore parachute on the same spot 0.55 seconds later.',{skeleDropEcho:1}));
  O('skeleflying',2,C('Epic','Vacuum Landing Permit','Each falling skeleton drags nearby enemies into its landing marker immediately before exploding.',{skeleDropVacuum:260}));
  O('skeleflying',3,C('Mythic','Surprise Skeleton Passenger','Every main-attack parachute leaves behind a temporary skeletrooper, even without Hypercharge.',{skeleMainPassenger:1}));
  O('skeleflying',4,C('Mythic','Portal Constellation','Comin Down! opens 7 portals in a huge curved constellation instead of 3.',{skeleSuperExtraPortals:4,skeleSuperSpreadPct:.8}));
  O('skeleflying',5,C('Mythic','Two Skeletons, One Chute','Every Super portal lands with 2 skeletroopers shoulder-to-shoulder.',{skelePortalTroopers:2}));
  O('skeleflying',6,C('Legendary','Ossuary Titans','All summoned troopers become giant Bone Titans with 250% more HP, 80% larger sword swipes, and double sword damage.',{skeleTitanHpPct:2.5,skeleTitanSizePct:.7,skeleTitanSwordPct:1,skeleTitanSlashSizePct:.8}));
  O('skeleflying',7,C('Exotic','THE SKY HAS BONES','Main attacks rain 9 homing parachutes that all leave troopers; Comin Down! tears open 12 moving portals, each carrying 2 troopers.',{skeleSkyTakeover:1}));
  // Heater Miser's deck rewires the tether ramp, reconnection economy, Flux
  // network, and Furnace Zone rather than borrowing generic projectile stats.
  O('heater_miser',0,C('Epic','Industrial Extension Cord','Thermal Tether gains 70% lock and hold range. The starter spark and aiming line extend to match.',{heaterRangePct:.7}));
  O('heater_miser',1,C('Epic','Microwave Preheat Button','Every new tether begins with 4 seconds of heat already built, starting at Ramp Stage 3.',{heaterPreheatMs:4000}));
  O('heater_miser',2,C('Epic','Heat Insurance Policy','When a tether breaks, bank 70% of its ramp for 5 seconds. Your next connection resumes from that stored heat.',{heaterHeatBankPct:.7,heaterHeatBankMs:5000}));
  O('heater_miser',3,C('Mythic','Neighborhood Heating Grid','Every tether tick chains to the 3 nearest matching targets at 65% power—even without Three-Way Flux.',{heaterFluxTargets:3,heaterFluxPowerPct:.65}));
  O('heater_miser',4,C('Mythic','Closed-Loop Radiator','Hostile tether damage heals Heater Miser for 30% of every direct and chained heat tick.',{heaterFeedbackHealPct:.3}));
  O('heater_miser',5,C('Mythic','Three-Furnace Problem','Intergalactic Heat creates 3 Furnace Zones in a triangular formation instead of one.',{heaterExtraZones:2}));
  O('heater_miser',6,C('Legendary','Stage Seven: Core Meltdown','At maximum ramp, Thermal Tether detonates a 420-damage heat blast around its target every 0.9 seconds.',{heaterMeltdownDamage:420,heaterMeltdownRadius:180}));
  O('heater_miser',7,C('Exotic','GLOBAL WARMING SPEEDRUN','Thermal Tether has map-wide range, ignores walls, begins at Stage 7, and chains to 5 targets. Intergalactic Heat creates 5 pulling Furnace Zones.',{heaterGlobalHeating:1}));
  O('classy',7,C('Exotic','Endless Encore','Note Burst has unlimited ammo, infinite range, perfect homing, and pierces every enemy.',{classyEndlessEncore:1}));
  O('outlit',0,C('Epic','Open-Faced Scatter','Scatter Pump opens into a much wider fan and fires 2 extra pellets.',{outlitSpreadMult:1.85,outlitExtraPellets:2}));
  O('outlit',1,C('Epic','Cannonball Crumbs','Pellets become 70% larger but travel 15% slower.',{outlitProjectileSizePct:.7,outlitProjectileSpeedPct:-.15}));
  O('teether',0,C('Epic','Second Row of Teeth','Bite Pattern adds a fourth delayed row with 3 wide teeth.',{teetherExtraToothWave:1}));
  O('teether',1,C('Epic','Dental-Floss Longline','Floss Line gains 55% range and a larger enemy lock.',{teetherFlossRangePct:.55,teetherLockRadius:70}));
  O('fuel',0,C('Epic','Six-Finger Cycle','The flame cycle continues to 5 and 6 before resetting.',{fuelCycleMax:6}));
  O('fuel',1,C('Epic','Ten-Second Stove','Five Flame Finger lasts 6.75 extra seconds.',{fuelSuperBonusMs:6750}));
  O('xray',0,C('Epic','Full-Penetration Plate','Infrared Reading pierces and grows 45% wider.',{xrayPierce:1,sushiAttackSizePct:.45}));
  O('xray',1,C('Epic','Lead-Lined Machine','The X-ray machine gains 60% HP and stops decaying.',{xrayMachineHpPct:.6,xrayNoDecay:1}));
  O('angel',0,C('Epic','Three-Ray Halo','Guiding Light always fires 3 rays in quick succession.',{angelExtraBurst:2}));
  O('angel',1,C('Epic','Everyone Gets Another Life','Second Life protects the entire living team.',{angelSuperTeam:1}));
  O('demon',0,C('Epic','Twin Hellblades','Every main attack throws a second spectral blade.',{demonExtraBlade:1}));
  O('demon',1,C('Epic','Longer Temptation','The glide decision window lasts 2.5 seconds.',{demonGlideBonusMs:1500}));
  O('warrior',0,C('Epic','Four-Spear Formation','Normal attacks throw 4 spears instead of 2.',{warriorExtraSpears:2}));
  O('warrior',1,C('Epic','Explosive Tips','Normal spear landings explode for area damage.',{warriorExplosiveMain:1}));
  O('relay',0,C('Epic','Overcharged Signal','Shield Signal grants 75% more shield with a 12000 cap.',{relayShieldPct:.75,relayShieldCap:12000}));
  O('relay',1,C('Epic','Industrial Relay','The device gains 75% HP and 65% connection radius.',{relayDeviceHpPct:.75,relayLinkRadiusPct:.65}));
  O('splitter',7,C('Exotic','Split Into Split Into Split!','Main grenades gain a third full splitting generation.',{splitterExoticCascade:1}));
  O('rocketeer',0,C('Epic','Six-Pack Separation','Every Breakup Rocket releases 3 additional mini-rockets.',{rocketeerExtraMinis:3}));
  O('rocketeer',1,C('Epic','Napalm Pockets','Mini-rocket fire zones are 55% larger and last 75% longer.',{rocketeerFireRadiusPct:.55,rocketeerFireDurationPct:.75}));
  O('rocketeer',2,C('Epic','Hotter Exhaust','Breakup Rockets fire and reload 25% faster.',{fireDelayPct:.25,reloadPct:.25}));
  O('rocketeer',3,C('Mythic','Chain of Command','Breakup Rocket launches two angled copies dealing 62% damage.',{rocketeerExtraMainRockets:2}));
  O('rocketeer',4,C('Mythic','Five-Rocket Forecast','Triple Impact calls down 2 additional big rockets.',{rocketeerExtraSuperStrikes:2}));
  O('rocketeer',5,C('Mythic','Permanent Burn Notice','Every big Super rocket leaves a 4-second fire zone, even without Gravity Warheads.',{rocketeerSuperFire:1}));
  O('rocketeer',6,C('Legendary','Sixteen Directions','Hypercharged Super impacts launch 16 radial rockets instead of 8.',{rocketeerHyperRadial:16}));
  O('rocketeer',7,C('Exotic','Rocket Weather','Breakup Rocket releases 12 mini-rockets with 100% extra range; Triple Impact rains 7 big rockets.',{rocketeerExtraMinis:9,sushiAttackRangePct:1,rocketeerExtraSuperStrikes:4}));
  O('robber',0,C('Epic','Pyramid Scheme','Every successful coin hit adds 3 attack waves. The wave cap becomes 12.',{robberWaveGain:3,robberWaveCap:12}));
  O('robber',1,C('Epic','Coin-Shotgun Getaway','Every wave fires 9 coins across an enormous fan.',{robberCoinsPerWave:9,robberFanMult:2.4}));
  O('robber',2,C('Epic','Accelerated Assets','Each later wave gains 35% projectile speed and 25% damage.',{robberWaveSpeedPct:.35,robberWaveDamagePct:.25}));
  O('robber',3,C('Mythic','Laundered Ricochet','Stolen coins ricochet 5 times without losing damage.',{robberRicochet:5}));
  O('robber',4,C('Mythic','Pickpocket Payroll','The first coin hit from every attack steals 1 ammo immediately.',{robberHitSteal:1}));
  O('robber',5,C('Mythic','Getaway Convoy','Grand Theft Ammo travels twice as far, steals from every enemy crossed and grants 2500 shield per victim.',{robberDashRangePct:1,robberVictimShield:2500}));
  O('robber',6,C('Legendary','Hostile Takeover','Casting Grand Theft Ammo grants 12 waves and 9 maximum ammo for 10 seconds.',{robberTakeoverMs:10000,robberTakeoverWaves:12,robberTakeoverAmmo:9}));
  O('robber',7,C('Exotic','The Perfect Crime','Stolen Fortune has unlimited ammo, fires 16 waves with infinite range, perfect homing and piercing; every hit steals ammo.',{robberPerfectCrime:1}));
  O('blade_vane',0,C('Epic','Longsword License','Vane Cleave gains 45% reach and a wider swing arc.',{bladeVaneRangePct:.45,bladeVaneArcBonus:.18}));
  O('blade_vane',1,C('Epic','Floor Is Blood','Every sword hit drops a damaging blood pool, even outside Hypercharge.',{bladeVaneBloodEveryHit:1}));
  O('blade_vane',2,C('Epic','Five Percent Is Cowardice','Each Blood Cyclone step adds 12% damage instead of 5%.',{bladeVaneDamageStepPct:.07}));
  O('blade_vane',3,C('Mythic','Vane Turbine','Each Blood Cyclone stage adds 35% swing speed instead of 20%.',{bladeVaneSpeedStepPct:.15}));
  O('blade_vane',4,C('Mythic','Blood Bank','Blood Cyclone lifesteal increases from 20% to 40%.',{bladeVaneLifestealPct:.20}));
  O('blade_vane',5,C('Mythic','Room-Sized Cyclone','Blood Cyclone’s opening blast becomes 65% larger.',{bladeVaneCycloneRadiusPct:.65}));
  O('blade_vane',6,C('Legendary','Six Seconds Was Nothing','Blood Cyclone lasts 6 additional seconds.',{bladeVaneFrenzyBonusMs:6000}));
  O('blade_vane',7,C('Exotic','THE RED WEDDING','Every swing permanently uses maximum frenzy speed, drops blood, and consumes no ammo.',{bladeVaneRedWedding:1,bladeVaneBloodEveryHit:1}));

  window.SLOP_SUSHI_DECKS={};
  ids.forEach(id=>window.SLOP_SUSHI_DECKS[id]=D(id,decks[id]));
})();
