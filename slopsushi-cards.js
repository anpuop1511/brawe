(() => {
  const icons={Epic:'🍙',Mythic:'🍣',Legendary:'🍱',Exotic:'🧬'};
  const C=(rarity,name,desc,effects)=>({rarity,name,desc,effects,icon:icons[rarity]});
  const D=(id,cards)=>cards.map((card,index)=>({id:`${id}_sushi_${index+1}`,...card}));

  // Each entry supplies the real move names and a unique visual/flavor identity.
  // Cards are generated from rotating mechanic mutations so all 360 cards alter
  // an attack, Super, resource loop, or survivability state in live gameplay.
  const S={
    outlit:['Scatter Pump','Boom Break','Shell'],fuser:['Eight-Fuse Salvo','Wall-Fuser Barrage','Instability'],echo:['Sound Wave','Resonance','Reverb'],cheseypuff:['Cheese Ball','Cheese Aura','Fondue'],decayer:['Decay Shot','Dark Orbit','Void'],
    unopcoloco:['Scarf & Whack','Scarf Clonin','Fiesta'],dashaholic:['Claw Slash','Unleash the Dashaholic','Adrenaline'],trapper:['Slam Gate','Sound Fence','Backstage'],classy:['Note Burst','Bass Drop','Encore'],
    hyperorigin:['Origin Slam','Purple Unleashed','Origin'],heater_miser:['Thermal Tether','Intergalactic Heat','Furnace'],minigunnin:['Minigun Stream','Bullet Storm','Ammo'],steamer:['Steam Stream','Railroad Rush','Boiler'],
    bowlin_rida:['Bowling Burst','Pin Strike','Perfect Game'],money_and_tax:['Coin Waves','Market Crash','Profit'],hunter:['Delay Sweep','I Found You','Tracker'],chaird:['Chair Toss','Chair Spin','Furniture'],
    forest:["Nature's Wrath",'Avian Ally','Canopy'],bouncin_balls:['Ricochet Volley','Bouncy House','Pinball'],goonbob:['Gooey Splatter','Blobert Jar','Slime'],tempo_maker:['Twin Cadence','Tempo Break','Rhythm'],
    overlord:['Royal Impact','Ascension','Crown'],copyphase:['Phase Orb','Phase Theft','Glitch'],fightnfire:['Firework Shot','Firestorm','Spark'],beast:['Twin Claws','Unleash the Beast','Feral'],
    amplifier:['Ampifin','Screws and Nuts','Toolbox'],skeleflying:['Parachute Drop','Skeleton Portals','Bone'],crystila:['Crystal Arms','Overreflect','Prism'],hope:['Hopeful Shot','You Broke My Hope','Heart'],
    evil_doctor:['Infectious Shot','Spread My Virus','Virus'],splitter:['Split Grenade','Splitin Off','Fractal'],scuba_diver:['Bubble Barrage','Dash Underwater','Deep Sea'],hoop:['Bounce Breaker','Full-Court Crash','Heat Check'],
    screener:['Projected Sweep','Projected Charge','Pixel'],malakor:['Putting You Down','Hell Is Forever','Infernal'],beam:['Focus Beam','Golden Beam','Prism'],paradox:['Temporal Skip','Relativity Zone','Time'],
    sera_eclipse:['Eclipse Flare','Eclipse Orbit','Corona'],boom_arang:['Boomerang Toss','Gravity Recall','Orbit'],teether:['Bite Pattern','Tooth Fairy','Dental'],fuel:['Finger Flames','Five Flame Finger','Blowtorch'],
    xray:['Infrared Reading','Full Body Scan','Radiology'],angel:['Guiding Light','Second Life','Halo'],demon:['Hellblade','Demonic Doom','Abyss'],warrior:['Twin Spears','Final Stand','Phalanx'],relay:['Shield Signal','Move My Damage','Bandwidth'],upiedown:['Pie in the Sky','Upside-Down Pie','Bakery'],chickpig:['Breakfast Blast','Farmyard Rush','Farmhouse'],jetpack:['Crash Landing','I Drop Bombs','Flight Deck'],robber:['Stolen Fortune','Grand Theft Ammo','Heist']
  };

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
    'paradox','sera_eclipse','fuel','xray','angel','demon','warrior','relay','upiedown','chickpig','jetpack'
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
  O('money_and_tax',0,C('Epic','Money Printer Platter','Money mode fires 2 additional waves of coins.',{moneyExtraWaves:2}));
  O('money_and_tax',1,C('Epic','Center-Coin Stimulus','At full ammo, center coins grow 90% and deal 35% more damage.',{moneyCenterSizePct:.9,moneyCenterDamagePct:.35}));
  O('bouncin_balls',0,C('Epic','Around-the-World Roll','Every ball travels 400% farther through its bounces.',{bouncyRangePct:4}));
  O('bouncin_balls',1,C('Epic','Multiply on Contact','Balls split into smaller rebound shots on their first enemy hit.',{bouncySplitOnHit:1}));
  O('bouncin_balls',7,C('Exotic','Perpetual Motion','Every attack and Super ball bounces forever, never loses damage, and has infinite range.',{bouncyInfiniteBounce:1}));
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
  O('robber',0,C('Epic','Pyramid Scheme','Every successful coin hit adds 3 attack waves. The wave cap becomes 12.',{robberWaveGain:3,robberWaveCap:12}));
  O('robber',1,C('Epic','Coin-Shotgun Getaway','Every wave fires 9 coins across an enormous fan.',{robberCoinsPerWave:9,robberFanMult:2.4}));
  O('robber',2,C('Epic','Accelerated Assets','Each later wave gains 35% projectile speed and 25% damage.',{robberWaveSpeedPct:.35,robberWaveDamagePct:.25}));
  O('robber',3,C('Mythic','Laundered Ricochet','Stolen coins ricochet 5 times without losing damage.',{robberRicochet:5}));
  O('robber',4,C('Mythic','Pickpocket Payroll','The first coin hit from every attack steals 1 ammo immediately.',{robberHitSteal:1}));
  O('robber',5,C('Mythic','Getaway Convoy','Grand Theft Ammo travels twice as far, steals from every enemy crossed and grants 2500 shield per victim.',{robberDashRangePct:1,robberVictimShield:2500}));
  O('robber',6,C('Legendary','Hostile Takeover','Casting Grand Theft Ammo grants 12 waves and 9 maximum ammo for 10 seconds.',{robberTakeoverMs:10000,robberTakeoverWaves:12,robberTakeoverAmmo:9}));
  O('robber',7,C('Exotic','The Perfect Crime','Stolen Fortune has unlimited ammo, fires 16 waves with infinite range, perfect homing and piercing; every hit steals ammo.',{robberPerfectCrime:1}));

  window.SLOP_SUSHI_DECKS={};
  ids.forEach(id=>window.SLOP_SUSHI_DECKS[id]=D(id,decks[id]));
})();
