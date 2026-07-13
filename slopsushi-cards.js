(() => {
  const icons = { Epic:'🍙', Mythic:'🍣', Legendary:'🍱', Exotic:'🧬' };
  const C = (rarity, name, desc, effects) => ({ rarity, name, desc, effects, icon: icons[rarity] });
  const D = (id, cards) => cards.map((card, index) => ({ id:`${id}_sushi_${index+1}`, ...card }));
  window.SLOP_SUSHI_DECKS = {
    outlit: D('outlit', [
      C('Epic','Pellet Pantry','Every blast deals 11% more damage.',{damagePct:.11}),
      C('Epic','Hot Barrel Hustle','Landing a blast grants 18% speed for 1.5 seconds.',{hitSpeedPct:.18,hitSpeedMs:1500}),
      C('Epic','Crumb-Catcher Stock','Each hit converts 18% of its damage into shield, up to 2,400.',{damageShieldPct:.18,shieldCap:2400}),
      C('Mythic','Door-Breacher Dinner','Boom Break deals 35% more damage and restores 1 ammo.',{superDamagePct:.35,superAmmo:1}),
      C('Mythic','Three-Shell Special','Every third hit restores 1 ammo.',{thirdHitAmmo:1}),
      C('Mythic','Table-Clearing Blast','Hits shove enemies 95 pixels away and slow them for 0.5 seconds.',{knockback:95,slowMs:500}),
      C('Legendary','Last Shell Standing','Below 35% HP, deal 32% more damage and fire 18% faster.',{lowHpDamagePct:.32,fireDelayPct:.18}),
      C('Legendary','Encore Entrée','The first knockout instead revives Outlit with 3,200 HP.',{reviveHp:3200})
    ]),
    echo: D('echo', [
      C('Epic','Ripple Roll','Sound Waves deal 10% more damage and slow for 0.65 seconds.',{damagePct:.10,slowMs:650}),
      C('Epic','Reverb Refresh','Heal for 13% of all damage dealt.',{lifestealPct:.13}),
      C('Epic','Bassline Barrier','Every third hit grants a 500 shield.',{thirdHitShield:500,shieldCap:2600}),
      C('Mythic','Feedback Loop','Hits chain 28% damage to the nearest enemy within 280 pixels.',{chainDamagePct:.28,chainRadius:280}),
      C('Mythic','Resonant Recharge','Each hit adds 2.5% Super charge.',{hitSuperCharge:2.5}),
      C('Mythic','Quiet Between Notes','Regenerate 110 HP every second throughout the stage.',{regenPerSec:110}),
      C('Legendary','Surround Sound Supper','Resonance deals 45% more damage and heals Echo for 1,400 on cast.',{superDamagePct:.45,superHeal:1400}),
      C('Legendary','Phase Cancellation','Echo has a 14% chance to completely dodge projectile hits.',{dodgeChance:.14})
    ]),
    cheseypuff: D('cheseypuff', [
      C('Epic','Fresh Curds','Cheese Balls deal 14% more damage.',{damagePct:.14}),
      C('Epic','Rolling Rind','Hits grant 14% speed for 2 seconds.',{hitSpeedPct:.14,hitSpeedMs:2000}),
      C('Epic','Cheesecloth Guard','Take 9% less damage and begin with a 900 shield.',{damageReductionPct:.09,startShield:900}),
      C('Mythic','Aged to Perfection','Enemies below 40% HP take 25% extra damage.',{executeThreshold:.40,executeDamagePct:.25}),
      C('Mythic','Fondue Splash','Hits splash 32% damage in a 125-pixel pool.',{splashDamagePct:.32,splashRadius:125}),
      C('Mythic','Gouda Getaway','Knockouts heal 1,100 HP and grant 20% speed for 3 seconds.',{killHeal:1100,killSpeedPct:.20,killSpeedMs:3000}),
      C('Legendary','Aura Au Gratin','Casting Cheese Aura grants a 2,200 shield and refills 1 ammo.',{superShield:2200,superAmmo:1,shieldCap:3600}),
      C('Legendary','Unbreakable Wheel','Below 35% HP, take 28% less damage and regenerate 160 HP/sec.',{lowHpReductionPct:.28,regenPerSec:160})
    ]),
    decayer: D('decayer', [
      C('Epic','Orbit Appetizer','Decay Shots deal 9% more damage and charge Super 18% faster.',{damagePct:.09,superGainPct:.18}),
      C('Epic','Shield Shavings','Hits convert 25% of damage into shield, capped at 3,200.',{damageShieldPct:.25,shieldCap:3200}),
      C('Epic','Dark-Matter Diet','Maximum HP increases 16%.',{hpPct:.16}),
      C('Mythic','Sacrificial Serving','Attacking grants 180 shield; shield is capped at 3,600.',{attackShield:180,shieldCap:3600}),
      C('Mythic','Gravitational Decay','Hits pull enemies 70 pixels toward Decayer.',{pull:70}),
      C('Mythic','Orbiting Leftovers','Every third hit heals 420 and grants 420 shield.',{thirdHitHeal:420,thirdHitShield:420,shieldCap:4000}),
      C('Legendary','Event Horizon Entrée','Dark Orbit grants 3,000 extra shield and 25% speed for 3.5 seconds.',{superShield:3000,superSpeedPct:.25,superSpeedMs:3500,shieldCap:5200}),
      C('Legendary','Nothing Ever Wasted','On the first knockout, revive with 2,500 HP and a 1,500 starting shield.',{reviveHp:2500,startShield:1500})
    ]),
    unopcoloco: D('unopcoloco', [
      C('Epic','Scarf Snack','Scarf and Whack damage increases 10%.',{damagePct:.10}),
      C('Epic','Healing Handful','Heal for 18% of damage dealt.',{lifestealPct:.18}),
      C('Epic','Loco Footwork','Base speed increases 11%; hits grant another 10% for 1.5 seconds.',{speedPct:.11,hitSpeedPct:.10,hitSpeedMs:1500}),
      C('Mythic','Third Whack Takeout','Every third hit heals 700 HP.',{thirdHitHeal:700}),
      C('Mythic','Scarf Snare','Hits pull enemies 55 pixels closer and slow for 0.8 seconds.',{pull:55,slowMs:800}),
      C('Mythic','Clone Cuisine','Scarf Clonin deals 30% more damage and heals 1,200 on cast.',{superDamagePct:.30,superHeal:1200}),
      C('Legendary','Never-Ending Combo Meal','Gain +1 ammo and reload 20% faster.',{ammoBonus:1,reloadPct:.20}),
      C('Legendary','Party of One More','The first knockout revives UnoPcoLoco with 3,000 HP.',{reviveHp:3000})
    ]),
    dashaholic: D('dashaholic', [
      C('Epic','Carving Board','Claw Slash deals 13% more damage.',{damagePct:.13}),
      C('Epic','Blood Orange Roll','Heal for 16% of damage dealt.',{lifestealPct:.16}),
      C('Epic','Wasabi Footwork','Move 13% faster; hits grant another 12% for 1.2 seconds.',{speedPct:.13,hitSpeedPct:.12,hitSpeedMs:1200}),
      C('Mythic','Predator Platter','Enemies below 45% HP take 28% extra damage.',{executeThreshold:.45,executeDamagePct:.28}),
      C('Mythic','Clawback','Each hit has a 24% chance to refund 1 ammo.',{ammoRefundChance:.24}),
      C('Mythic','Deep-Cut Chili','Hits burn enemies for 2.4 seconds.',{burnMs:2400,burnStacks:1}),
      C('Legendary','All-You-Can-Dash','Casting Super restores 2 ammo and grants 32% speed for 4 seconds.',{superAmmo:2,superSpeedPct:.32,superSpeedMs:4000}),
      C('Legendary','Feast or Flee','Knockouts heal 1,800 HP, grant 1 ammo, and add 20% Super charge.',{killHeal:1800,killAmmo:1,killSuperCharge:20})
    ]),
    trapper: D('trapper', [
      C('Epic','Gateau Gate','Slam Gate deals 10% more damage and slows for 0.7 seconds.',{damagePct:.10,slowMs:700}),
      C('Epic','Bass Bento','Every third hit grants 500 shield.',{thirdHitShield:500,shieldCap:2800}),
      C('Epic','Fence Runner','Move 10% faster and take 7% less damage.',{speedPct:.10,damageReductionPct:.07}),
      C('Mythic','No Reservations','Hits drag enemies 40 pixels closer.',{pull:40}),
      C('Mythic','Encore Entrapment','Sound Fence deals 38% more damage and slows hit enemies for 1.2 seconds.',{superDamagePct:.38,slowMs:1200}),
      C('Mythic','Cover Charge','Damage dealt becomes shield at a 20% rate, capped at 3,000.',{damageShieldPct:.20,shieldCap:3000}),
      C('Legendary','Sold-Out Show','Casting Super grants a 2,200 shield and 28% speed for 4 seconds.',{superShield:2200,superSpeedPct:.28,superSpeedMs:4000,shieldCap:4200}),
      C('Legendary','Finale Lockdown','Below 35% HP, reload 24% faster and take 25% less damage.',{reloadPct:.24,lowHpReductionPct:.25})
    ]),
    classy: D('classy', [
      C('Epic','Seven-Note Sushi','Note Burst deals 10% more damage.',{damagePct:.10}),
      C('Epic','Perfect Pitch Pickle','Every hit adds 2% extra Super charge.',{hitSuperCharge:2}),
      C('Epic','Backstage Bite','Every third hit heals 500 HP.',{thirdHitHeal:500}),
      C('Mythic','Crescendo Course','Enemies below 50% HP take 18% extra damage.',{executeThreshold:.50,executeDamagePct:.18}),
      C('Mythic','Fanfare Chain','Hits chain 25% damage to a nearby enemy within 260 pixels.',{chainDamagePct:.25,chainRadius:260}),
      C('Mythic','Eight-Note Entrée','Gain +1 maximum ammo and reload 12% faster.',{ammoBonus:1,reloadPct:.12}),
      C('Legendary','Golden Reservation','Casting Bass Drop grants a 2,000 shield and instantly restores 2 ammo.',{superShield:2000,superAmmo:2,shieldCap:3500}),
      C('Legendary','Standing Ovation','Knockouts heal 1,400, grant 20 Super charge, and give 22% speed for 3 seconds.',{killHeal:1400,killSuperCharge:20,killSpeedPct:.22,killSpeedMs:3000})
    ]),
    hyperorigin: D('hyperorigin', [
      C('Epic','Core Sample','Origin Slam deals 11% more damage.',{damagePct:.11}),
      C('Epic','Mantle Meal','Maximum HP increases 18% and damage taken falls 6%.',{hpPct:.18,damageReductionPct:.06}),
      C('Epic','Fault-Line Fuel','Hits grant 12% speed for 1.8 seconds.',{hitSpeedPct:.12,hitSpeedMs:1800}),
      C('Mythic','Seismic Seconds','Every third hit grants 650 shield.',{thirdHitShield:650,shieldCap:3400}),
      C('Mythic','Gravity Gravy','Hits pull enemies 75 pixels toward Hyperorigin.',{pull:75}),
      C('Mythic','Pressure-Cooked Core','Below 35% HP, deal 25% more damage and take 18% less.',{lowHpDamagePct:.25,lowHpReductionPct:.18}),
      C('Legendary','Purple Feast Unleashed','Purple Unleashed deals 42% more damage, heals 1,500, and grants 1 ammo.',{superDamagePct:.42,superHeal:1500,superAmmo:1}),
      C('Legendary','Continental Breakfast','The first knockout revives Hyperorigin with 3,600 HP.',{reviveHp:3600})
    ]),
    heater_miser: D('heater_miser', [
      C('Epic','Simmering Skewer','Thermal Tether deals 9% more damage and burns for 1.8 seconds.',{damagePct:.09,burnMs:1800}),
      C('Epic','Heat Exchange','Heal for 15% of all damage dealt.',{lifestealPct:.15}),
      C('Epic','Boiling Point','Hits grant 13% speed for 1.8 seconds.',{hitSpeedPct:.13,hitSpeedMs:1800}),
      C('Mythic','Seven-Stage Stir-Fry','Every third hit adds 3.5% Super charge and heals 350.',{thirdHitSuperCharge:3.5,thirdHitHeal:350}),
      C('Mythic','Convection Current','Hits pull enemies 60 pixels toward Heater Miser.',{pull:60}),
      C('Mythic','Furnace Fondue','Intergalactic Heat deals 40% more damage and slows for 1 second.',{superDamagePct:.40,slowMs:1000}),
      C('Legendary','Intergalactic Hot Pot','Casting Super grants a 2,400 shield and heals 1,000 HP.',{superShield:2400,superHeal:1000,shieldCap:4200}),
      C('Legendary','Maximum Temperature','Below 35% HP, deal 30% more damage, reload 20% faster, and resist 15% damage.',{lowHpDamagePct:.30,reloadPct:.20,lowHpReductionPct:.15})
    ]),
    minigunnin: D('minigunnin', [
      C('Epic','Bullet Buffet','Minigun damage increases 8%.',{damagePct:.08}),
      C('Epic','Iron Stomach','Maximum HP increases 20%.',{hpPct:.20}),
      C('Epic','Mobile Meal Cart','Move 9% faster; hits grant another 8% for 1 second.',{speedPct:.09,hitSpeedPct:.08,hitSpeedMs:1000}),
      C('Mythic','Lead-Plated Lunch','Damage dealt becomes shield at a 22% rate, capped at 3,800.',{damageShieldPct:.22,shieldCap:3800}),
      C('Mythic','Bottomless Belt','Gain +1 maximum ammo and reload 18% faster.',{ammoBonus:1,reloadPct:.18}),
      C('Mythic','Fort Food Court','Healing Fort grants 2,500 shield and heals 1,200 on cast.',{superShield:2500,superHeal:1200,shieldCap:4800}),
      C('Legendary','Desperate Seconds','Below 35% HP, take 30% less damage and deal 22% more.',{lowHpReductionPct:.30,lowHpDamagePct:.22}),
      C('Legendary','One More Belt','The first knockout revives Minigunnin with 4,000 HP.',{reviveHp:4000})
    ]),
    steamer: D('steamer', [
      C('Epic','Sweet-Spot Sashimi','Steam Lance deals 11% more damage.',{damagePct:.11}),
      C('Epic','Pressure Pickles','Hits slow enemies for 0.75 seconds.',{slowMs:750}),
      C('Epic','Boiler Dash','Hits grant 15% speed for 1.5 seconds.',{hitSpeedPct:.15,hitSpeedMs:1500}),
      C('Mythic','Scalding Seconds','Hits burn enemies for 2.5 seconds.',{burnMs:2500}),
      C('Mythic','Pressure Refund','Each hit has a 22% chance to refund ammo.',{ammoRefundChance:.22}),
      C('Mythic','Steam Shielding','Every third hit grants 600 shield.',{thirdHitShield:600,shieldCap:3200}),
      C('Legendary','Two-Lap Teppanyaki','Railroad deals 45% more damage and grants 30% speed for 4 seconds.',{superDamagePct:.45,superSpeedPct:.30,superSpeedMs:4000}),
      C('Legendary','Emergency Vent','Below 35% HP, reload 26% faster, take 22% less damage, and regenerate 140 HP/sec.',{reloadPct:.26,lowHpReductionPct:.22,regenPerSec:140})
    ]),
    bowlin_rida: D('bowlin_rida', [
      C('Epic','Lane Snack','Bowling Roll deals 12% more damage.',{damagePct:.12}),
      C('Epic','Oiled Nori','Move 14% faster.',{speedPct:.14}),
      C('Epic','Pinball Pickle','Hits knock enemies 105 pixels away.',{knockback:105}),
      C('Mythic','Turkey Dinner','Every third hit heals 600 and restores 1 ammo.',{thirdHitHeal:600,thirdHitAmmo:1}),
      C('Mythic','Flaming Gutter','Hits burn enemies for 2.6 seconds.',{burnMs:2600}),
      C('Mythic','Perfect-Game Plating','Damage dealt becomes shield at a 20% rate, capped at 2,800.',{damageShieldPct:.20,shieldCap:2800}),
      C('Legendary','Strike Supper','Pin Strike deals 50% more damage, restores 2 ammo, and grants 35% speed for 4 seconds.',{superDamagePct:.50,superAmmo:2,superSpeedPct:.35,superSpeedMs:4000}),
      C('Legendary','Tenth-Frame Feast','Knockouts heal 1,700 and grant 25 Super charge.',{killHeal:1700,killSuperCharge:25})
    ]),
    money_and_tax: D('money_and_tax', [
      C('Epic','Liquid Lunch','Coin and banknote attacks deal 10% more damage.',{damagePct:.10}),
      C('Epic','Cashback Cuisine','Every hit has an 18% chance to refund 1 ammo.',{ammoRefundChance:.18}),
      C('Epic','Compound Appetizer','Every third hit heals 400 and adds 3% Super charge.',{thirdHitHeal:400,thirdHitSuperCharge:3}),
      C('Mythic','Tax Bracket Trap','Hits slow enemies for 0.8 seconds and pull them 35 pixels closer.',{slowMs:800,pull:35}),
      C('Mythic','Bull-Market Bento','Knockouts grant 1 ammo and 20% speed for 3 seconds.',{killAmmo:1,killSpeedPct:.20,killSpeedMs:3000}),
      C('Mythic','Hostile Takeover','Hits chain 24% damage to the nearest enemy within 250 pixels.',{chainDamagePct:.24,chainRadius:250}),
      C('Legendary','Market Crash Meal','Super damage increases 45%; casting it heals 1,300 and restores 1 ammo.',{superDamagePct:.45,superHeal:1300,superAmmo:1}),
      C('Legendary','Golden Parachute','The first knockout revives Money & Tax with 2,800 HP and a 1,200 shield.',{reviveHp:2800,startShield:1200})
    ]),
    hunter: D('hunter', [
      C('Epic','Tracker Roll','Delay Sweep deals 12% more damage.',{damagePct:.12}),
      C('Epic','Trail Mix-Up','Hits grant 16% speed for 1.8 seconds.',{hitSpeedPct:.16,hitSpeedMs:1800}),
      C('Epic','Camouflage Crumbs','Gain a 12% projectile dodge chance.',{dodgeChance:.12}),
      C('Mythic','Marked for Dessert','Enemies below 50% HP take 24% extra damage.',{executeThreshold:.50,executeDamagePct:.24}),
      C('Mythic','Hook-and-Cook','Hits pull enemies 85 pixels closer and slow for 0.6 seconds.',{pull:85,slowMs:600}),
      C('Mythic','Relentless Rations','Below 35% HP, take 24% less damage and move 20% faster.',{lowHpReductionPct:.24,lowHpSpeedPct:.20}),
      C('Legendary','I Found Food','Casting I Found You grants 38% speed for 5 seconds and restores 2 ammo.',{superSpeedPct:.38,superSpeedMs:5000,superAmmo:2}),
      C('Legendary','Trophy Course','Knockouts heal 1,600, grant 30 Super charge, and restore 1 ammo.',{killHeal:1600,killSuperCharge:30,killAmmo:1})
    ]),
    chaird: D('chaird', [
      C('Epic','Chaircuterie','Chair Toss deals 11% more damage.',{damagePct:.11}),
      C('Epic','Reinforced Tray','Maximum HP increases 17% and damage taken falls 5%.',{hpPct:.17,damageReductionPct:.05}),
      C('Epic','Second Explosion Seasoning','Hits splash 25% damage in a 110-pixel radius.',{splashDamagePct:.25,splashRadius:110}),
      C('Mythic','Furniture Fling','Hits knock enemies 115 pixels away.',{knockback:115}),
      C('Mythic','Spinning Supper','Chair Spin deals 35% more damage and heals 1,000 on cast.',{superDamagePct:.35,superHeal:1000}),
      C('Mythic','Upholstered Armor','Attacking grants 220 shield, capped at 3,400.',{attackShield:220,shieldCap:3400}),
      C('Legendary','All-You-Can-Spin','Casting Super grants 30% speed, 2,500 shield, and 1 ammo.',{superSpeedPct:.30,superSpeedMs:4500,superShield:2500,superAmmo:1,shieldCap:4600}),
      C('Legendary','Reserved Seating','The first knockout revives Chaird with 3,700 HP.',{reviveHp:3700})
    ]),
    forest: D('forest', [
      C('Epic','Garden Roll','Nature’s Wrath deals 10% more damage.',{damagePct:.10}),
      C('Epic','Root-to-Table','Regenerate 120 HP each second.',{regenPerSec:120}),
      C('Epic','Vinegar Vines','Hits slow enemies for 0.7 seconds.',{slowMs:700}),
      C('Mythic','Flaming Flora','Hits burn enemies for 2.5 seconds.',{burnMs:2500}),
      C('Mythic','Grasping Garnish','Hits pull enemies 60 pixels toward Forest.',{pull:60}),
      C('Mythic','Parrot Platter','Avian Ally damage increases 40%; casting it heals 1,200.',{superDamagePct:.40,superHeal:1200}),
      C('Legendary','Canopy Chain','Hits chain 30% damage to a nearby enemy within 300 pixels.',{chainDamagePct:.30,chainRadius:300}),
      C('Legendary','Reforestation Feast','Knockouts heal 1,500 and grant a 1,200 shield.',{killHeal:1500,killShield:1200,shieldCap:3600})
    ]),
    bouncin_balls: D('bouncin_balls', [
      C('Epic','Ricochet Rice','Ricochet Volley deals 11% more damage.',{damagePct:.11}),
      C('Epic','Rubber Roll','Hits grant 12% speed for 1.6 seconds.',{hitSpeedPct:.12,hitSpeedMs:1600}),
      C('Epic','Lucky Rebound','Each hit has a 20% chance to refund 1 ammo.',{ammoRefundChance:.20}),
      C('Mythic','Bank-Shot Bento','Every third hit restores 1 ammo and 350 HP.',{thirdHitAmmo:1,thirdHitHeal:350}),
      C('Mythic','Pinball Platter','Hits chain 32% damage to the nearest enemy within 320 pixels.',{chainDamagePct:.32,chainRadius:320}),
      C('Mythic','Elastic Entrée','Gain +1 maximum ammo and charge Super 18% faster.',{ammoBonus:1,superGainPct:.18}),
      C('Legendary','Bouncy House Banquet','Bouncy House deals 48% more damage and restores 2 ammo.',{superDamagePct:.48,superAmmo:2}),
      C('Legendary','Impossible Angle','Projectile hits have a 16% chance to stun for 0.65 seconds.',{stunChance:.16,stunMs:650})
    ]),
    goonbob: D('goonbob', [
      C('Epic','Gooey Gunkan','Gooey Splatter deals 10% more damage and slows for 0.55 seconds.',{damagePct:.10,slowMs:550}),
      C('Epic','Puddle Punch','Heal for 12% of damage dealt.',{lifestealPct:.12}),
      C('Epic','Slippery Service','Move 11% faster and dodge 6% of projectile hits.',{speedPct:.11,dodgeChance:.06}),
      C('Mythic','Industrial Leftovers','Hits burn for 1.8 seconds and slow for 0.7 seconds.',{burnMs:1800,slowMs:700}),
      C('Mythic','Overflow Bowl','Hits splash 30% damage in a 135-pixel puddle.',{splashDamagePct:.30,splashRadius:135}),
      C('Mythic','Recycled Recipe','Every third hit heals 650 HP.',{thirdHitHeal:650}),
      C('Legendary','Blobert in a Bento','Super damage increases 50%; casting it grants 2,000 shield.',{superDamagePct:.50,superShield:2000,shieldCap:3800}),
      C('Legendary','Bottomless Jar','Regenerate 170 HP/sec and gain +1 maximum ammo.',{regenPerSec:170,ammoBonus:1})
    ]),
    tempo_maker: D('tempo_maker', [
      C('Epic','Two-Note Tuna','Twin Cadence deals 12% more damage.',{damagePct:.12}),
      C('Epic','Return-Trip Rice','Hits grant 14% speed for 1.5 seconds.',{hitSpeedPct:.14,hitSpeedMs:1500}),
      C('Epic','Syncopated Snack','Every third hit adds 5% Super charge.',{thirdHitSuperCharge:5}),
      C('Mythic','Staccato Stun Roll','Hits have a 14% chance to stun for 0.7 seconds.',{stunChance:.14,stunMs:700}),
      C('Mythic','Center-Ring Sashimi','Enemies below 45% HP take 25% extra damage.',{executeThreshold:.45,executeDamagePct:.25}),
      C('Mythic','Snap-Back Supper','Each hit has a 22% chance to refund ammo.',{ammoRefundChance:.22}),
      C('Legendary','Drop the Feast','Super damage increases 48%, pulls enemies 80 pixels, and heals 1,100 on cast.',{superDamagePct:.48,pull:80,superHeal:1100}),
      C('Legendary','Infinite Encore','Knockouts restore 2 ammo and grant 30% speed for 4 seconds.',{killAmmo:2,killSpeedPct:.30,killSpeedMs:4000})
    ]),
    overlord: D('overlord', [
      C('Epic','Stage-One Starter','Wand Pulse deals 10% more damage.',{damagePct:.10}),
      C('Epic','Imperial Appetizer','Start with 1,200 shield and take 5% less damage.',{startShield:1200,damageReductionPct:.05}),
      C('Epic','Quick-Draw Quinoa','Fire 12% faster and move 8% faster.',{fireDelayPct:.12,speedPct:.08}),
      C('Mythic','Arc-Burst Bento','Hits splash 28% damage in a 120-pixel radius.',{splashDamagePct:.28,splashRadius:120}),
      C('Mythic','Ascension Allowance','Every hit adds 3% Super charge.',{hitSuperCharge:3}),
      C('Mythic','Imperial Guard Roll','Every third hit grants 650 shield.',{thirdHitShield:650,shieldCap:3600}),
      C('Legendary','Stage-Four Supper','Below 35% HP, deal 35% more damage, fire 20% faster, and move 18% faster.',{lowHpDamagePct:.35,fireDelayPct:.20,lowHpSpeedPct:.18}),
      C('Legendary','Wand Ascension Banquet','Super damage increases 45%; casting it grants 2,600 shield and 1 ammo.',{superDamagePct:.45,superShield:2600,superAmmo:1,shieldCap:4800})
    ]),
    copyphase: D('copyphase', [
      C('Epic','Sample Platter','Phase Orb deals 10% more damage.',{damagePct:.10}),
      C('Epic','Packet Dodge','Copyphase dodges 11% of projectile hits.',{dodgeChance:.11}),
      C('Epic','Download Boost','Hits grant 12% speed and 2% Super charge.',{hitSpeedPct:.12,hitSpeedMs:1500,hitSuperCharge:2}),
      C('Mythic','Mirrored Maki','Hits chain 26% damage to a nearby enemy within 280 pixels.',{chainDamagePct:.26,chainRadius:280}),
      C('Mythic','Data Recovery Dinner','Every third hit heals 600 HP.',{thirdHitHeal:600}),
      C('Mythic','Overclocked Order','Gain +1 maximum ammo and reload 15% faster.',{ammoBonus:1,reloadPct:.15}),
      C('Legendary','Copyin’ Two-for-One','Super damage increases 42%; casting it restores 2 ammo and grants 28% speed.',{superDamagePct:.42,superAmmo:2,superSpeedPct:.28,superSpeedMs:4000}),
      C('Legendary','Backup Save','The first knockout revives Copyphase with 2,700 HP.',{reviveHp:2700})
    ]),
    fightnfire: D('fightnfire', [
      C('Epic','Ember Ebi','Fireball Throw deals 11% more damage.',{damagePct:.11}),
      C('Epic','Spicy Footwork','Hits grant 13% speed for 1.8 seconds.',{hitSpeedPct:.13,hitSpeedMs:1800}),
      C('Epic','Charred Shield Roll','Every third hit grants 500 shield.',{thirdHitShield:500,shieldCap:2800}),
      C('Mythic','Eight-Ember Entrée','Hits splash 34% damage in a 140-pixel blast.',{splashDamagePct:.34,splashRadius:140}),
      C('Mythic','Thermite Topping','Hits burn for 3 seconds with 2 fire stacks.',{burnMs:3000,burnStacks:2}),
      C('Mythic','Firestep Feast','Move 12% faster and dodge 8% of projectile hits.',{speedPct:.12,dodgeChance:.08}),
      C('Legendary','Shard Bloom Banquet','Super damage increases 55% and restores 1 ammo on cast.',{superDamagePct:.55,superAmmo:1}),
      C('Legendary','Phoenix Pepper','The first knockout revives Fight’nFire with 2,600 HP and 25% speed for the next hit streak.',{reviveHp:2600,lowHpSpeedPct:.25})
    ]),
    beast: D('beast', [
      C('Epic','Claw Sashimi','Twin Claws deal 12% more damage.',{damagePct:.12}),
      C('Epic','Predator Protein','Heal for 15% of damage dealt.',{lifestealPct:.15}),
      C('Epic','Feral Footwork','Move 13% faster.',{speedPct:.13}),
      C('Mythic','Rending Recipe','Hits slow enemies for 0.7 seconds and burn for 1.8 seconds.',{slowMs:700,burnMs:1800}),
      C('Mythic','Hunt-and-Eat','Knockouts heal 1,500 and restore 1 ammo.',{killHeal:1500,killAmmo:1}),
      C('Mythic','Savage Seconds','Below 35% HP, deal 30% more damage and move 22% faster.',{lowHpDamagePct:.30,lowHpSpeedPct:.22}),
      C('Legendary','Unleash the Banquet','Super damage increases 45%; casting it heals 1,400 and grants 35% speed.',{superDamagePct:.45,superHeal:1400,superSpeedPct:.35,superSpeedMs:4500}),
      C('Legendary','Apex Appetite','Enemies below 50% HP take 32% extra damage; knockouts add 20 Super charge.',{executeThreshold:.50,executeDamagePct:.32,killSuperCharge:20})
    ]),
    amplifier: D('amplifier', [
      C('Epic','Toolbox Temaki','Ampifin deals 8% more damage and slows for 0.55 seconds.',{damagePct:.08,slowMs:550}),
      C('Epic','Quick-Wrench Quinoa','Reload 18% faster.',{reloadPct:.18}),
      C('Epic','Stabilizer Snack','Take 9% less damage and regenerate 90 HP/sec.',{damageReductionPct:.09,regenPerSec:90}),
      C('Mythic','Torque Tapas','Every third hit grants 700 shield.',{thirdHitShield:700,shieldCap:3600}),
      C('Mythic','Conductive Course','Hits chain 24% damage to an enemy within 250 pixels.',{chainDamagePct:.24,chainRadius:250}),
      C('Mythic','Buffet Toolbox','Damage dealt converts to shield at 20%, capped at 3,400.',{damageShieldPct:.20,shieldCap:3400}),
      C('Legendary','Screws and Noodles','Casting Super grants 2,700 shield, heals 1,300, and grants 24% speed.',{superShield:2700,superHeal:1300,superSpeedPct:.24,superSpeedMs:4000,shieldCap:5000}),
      C('Legendary','Full-Team Repair','The first knockout revives Amplifier with 2,800 HP.',{reviveHp:2800})
    ]),
    skeleflying: D('skeleflying', [
      C('Epic','Bone Broth Barrage','Para-Shoot Barrage deals 10% more damage.',{damagePct:.10}),
      C('Epic','Swift Chute Sushi','Fire 14% faster and move 8% faster.',{fireDelayPct:.14,speedPct:.08}),
      C('Epic','Landing Lunch','Hits splash 26% damage in a 115-pixel landing zone.',{splashDamagePct:.26,splashRadius:115}),
      C('Mythic','Heavy-Bones Bento','Maximum HP increases 15%; every third hit grants 450 shield.',{hpPct:.15,thirdHitShield:450,shieldCap:3000}),
      C('Mythic','Bone Beacon Bite','Hits add 3% Super charge.',{hitSuperCharge:3}),
      C('Mythic','Reinforcement Roll','Knockouts restore 1 ammo and grant 18% speed.',{killAmmo:1,killSpeedPct:.18,killSpeedMs:3000}),
      C('Legendary','Comin’ Down Course','Super damage increases 48%, heals 1,100 on cast, and restores 1 ammo.',{superDamagePct:.48,superHeal:1100,superAmmo:1}),
      C('Legendary','Army of Leftovers','Knockouts grant 25 Super charge and a 1,300 shield.',{killSuperCharge:25,killShield:1300,shieldCap:3800})
    ]),
    crystila: D('crystila', [
      C('Epic','Crystal-Cut Sashimi','Crystal Arms deal 12% more damage.',{damagePct:.12}),
      C('Epic','Polished Plate','Start with 1,200 shield.',{startShield:1200,shieldCap:3200}),
      C('Epic','Prismatic Step','Move 10% faster and dodge 8% of projectile hits.',{speedPct:.10,dodgeChance:.08}),
      C('Mythic','Follow-Shard Flight','Hits chain 27% damage to a nearby enemy within 260 pixels.',{chainDamagePct:.27,chainRadius:260}),
      C('Mythic','Shatter-Chill Sorbet','Hits slow enemies for 0.9 seconds.',{slowMs:900}),
      C('Mythic','Tempered Tasting','Damage dealt becomes shield at 24%, capped at 3,600.',{damageShieldPct:.24,shieldCap:3600}),
      C('Legendary','Overreflective Omakase','Casting Super grants 3,000 shield and 22% speed for 4 seconds.',{superShield:3000,superSpeedPct:.22,superSpeedMs:4000,shieldCap:5200}),
      C('Legendary','Perfect Refraction','Crystila dodges 18% of projectile hits and heals 900 after every third hit.',{dodgeChance:.18,thirdHitHeal:900})
    ]),
    hope: D('hope', [
      C('Epic','Hopeful Hosomaki','Hopeful Shot deals 10% more damage.',{damagePct:.10}),
      C('Epic','Rally Rice','Regenerate 130 HP/sec.',{regenPerSec:130}),
      C('Epic','Bright-Side Bite','Heal for 12% of damage dealt.',{lifestealPct:.12}),
      C('Mythic','Unbroken Bento','Below 35% HP, take 28% less damage and move 16% faster.',{lowHpReductionPct:.28,lowHpSpeedPct:.16}),
      C('Mythic','Crying Course','Hits slow enemies for 0.75 seconds and add 2.5% Super charge.',{slowMs:750,hitSuperCharge:2.5}),
      C('Mythic','Desperate Dessert','Every third hit heals 750 HP.',{thirdHitHeal:750}),
      C('Legendary','You Broke My Buffet','Super damage increases 40%; casting it heals 1,800 and grants 1,800 shield.',{superDamagePct:.40,superHeal:1800,superShield:1800,shieldCap:3800}),
      C('Legendary','Hope Never Dines Alone','The first knockout revives Hope with 3,200 HP.',{reviveHp:3200})
    ]),
    evil_doctor: D('evil_doctor', [
      C('Epic','Syringe Sushi','Infectious Shot deals 10% more damage.',{damagePct:.10}),
      C('Epic','Antidote Appetizer','Regenerate 120 HP/sec and take 6% less damage.',{regenPerSec:120,damageReductionPct:.06}),
      C('Epic','Adrenaline Ahi','Hits grant 13% speed for 1.8 seconds.',{hitSpeedPct:.13,hitSpeedMs:1800}),
      C('Mythic','Overdose Omakase','Hits burn for 2.8 seconds, imitating an extra infection.',{burnMs:2800}),
      C('Mythic','Clinical Cashback','Heal for 16% of damage dealt.',{lifestealPct:.16}),
      C('Mythic','Chain-Reaction Roll','Knockouts grant 25 Super charge and heal 900 HP.',{killSuperCharge:25,killHeal:900}),
      C('Legendary','Spread My Supper','Super damage increases 48% and chains 30% damage to nearby enemies.',{superDamagePct:.48,chainDamagePct:.30,chainRadius:300}),
      C('Legendary','Malpractice Meal','The first knockout revives Evil Doctor with 2,700 HP; below 35% HP, deal 28% more damage.',{reviveHp:2700,lowHpDamagePct:.28})
    ]),
    splitter: D('splitter', [
      C('Epic','Three-Way Temaki','Split Grenade deals 10% more damage.',{damagePct:.10}),
      C('Epic','Fragment Feast','Hits splash 30% damage in a 130-pixel radius.',{splashDamagePct:.30,splashRadius:130}),
      C('Epic','Chain-Lob Chow','Reload 15% faster and charge Super 12% faster.',{reloadPct:.15,superGainPct:.12}),
      C('Mythic','Twelve-Piece Tray','Hits chain 26% damage to the nearest enemy within 270 pixels.',{chainDamagePct:.26,chainRadius:270}),
      C('Mythic','Short-Fuse Sushi','Fire 18% faster; hits slow for 0.55 seconds.',{fireDelayPct:.18,slowMs:550}),
      C('Mythic','Ring-Burst Roll','Every third hit restores 1 ammo.',{thirdHitAmmo:1}),
      C('Legendary','Infinite-Subdivision Supper','Hits splash 45% damage and chain another 30% damage.',{splashDamagePct:.45,splashRadius:155,chainDamagePct:.30,chainRadius:320}),
      C('Legendary','Splitin’ Off Special','Super damage increases 55%, restores 2 ammo, and knockouts add 20 Super charge.',{superDamagePct:.55,superAmmo:2,killSuperCharge:20}),
      C('Exotic','Split Into Split Into Split!','Main attacks gain a third splitting generation. Each grenade splits, its pieces split, and those pieces split again.',{splitterExoticCascade:1})
    ]),
    scuba_diver: D('scuba_diver', [
      C('Epic','Bubble Nigiri','Bubble Barrage deals 11% more damage.',{damagePct:.11}),
      C('Epic','Emergency Oxygen Roll','Regenerate 120 HP/sec and move 9% faster.',{regenPerSec:120,speedPct:.09}),
      C('Epic','Rip-Current Rice','Hits push enemies 70 pixels and slow for 0.6 seconds.',{knockback:70,slowMs:600}),
      C('Mythic','Pressure-Hull Platter','Maximum HP increases 16%; start with 900 shield.',{hpPct:.16,startShield:900}),
      C('Mythic','Bubble-School Bento','Every third hit grants 550 shield and restores 350 HP.',{thirdHitShield:550,thirdHitHeal:350,shieldCap:3300}),
      C('Mythic','Deep-Sea Cashback','Each hit has a 22% chance to refund ammo.',{ammoRefundChance:.22}),
      C('Legendary','Under-the-Sea Omakase','Super damage increases 45%; casting it grants 30% speed and 2,400 shield.',{superDamagePct:.45,superSpeedPct:.30,superSpeedMs:4000,superShield:2400,shieldCap:4500}),
      C('Legendary','Submarine Second Serving','The first knockout revives Scuba Diver with 3,300 HP.',{reviveHp:3300})
    ]),
    hoop: D('hoop', [
      C('Epic','Swish Sushi','Bounce Breaker deals 11% more damage.',{damagePct:.11}),
      C('Epic','Crossover Crunch','Hits grant 15% speed for 1.5 seconds.',{hitSpeedPct:.15,hitSpeedMs:1500}),
      C('Epic','Backboard Bento','Hits splash 24% damage in a 115-pixel radius.',{splashDamagePct:.24,splashRadius:115}),
      C('Mythic','Heat-Check Handroll','Every third hit deals its reward as 1 ammo and 450 healing.',{thirdHitAmmo:1,thirdHitHeal:450}),
      C('Mythic','Ankle-Breaker Ahi','Hits slow enemies for 0.9 seconds.',{slowMs:900}),
      C('Mythic','Bank-Shot Chain','Hits chain 28% damage to an enemy within 300 pixels.',{chainDamagePct:.28,chainRadius:300}),
      C('Legendary','Full-Court Feast','Super damage increases 50%, knocks enemies 120 pixels, and restores 1 ammo.',{superDamagePct:.50,knockback:120,superAmmo:1}),
      C('Legendary','Buzzer-Beater Banquet','Below 35% HP, deal 30% more damage; knockouts heal 1,600 and grant 25 Super charge.',{lowHpDamagePct:.30,killHeal:1600,killSuperCharge:25})
    ]),
    screener: D('screener', [
      C('Epic','Pixel Platter','Projected Sweep deals 9% more damage.',{damagePct:.09}),
      C('Epic','Power-Cell Pickle','Reload 18% faster and regenerate 90 HP/sec.',{reloadPct:.18,regenPerSec:90}),
      C('Epic','Refresh-Rate Roll','Hits grant 12% speed and 2% Super charge.',{hitSpeedPct:.12,hitSpeedMs:1600,hitSuperCharge:2}),
      C('Mythic','Capacitor Course','Every third hit grants 650 shield.',{thirdHitShield:650,shieldCap:3400}),
      C('Mythic','Mirrored Media Meal','Hits chain 25% damage to a nearby enemy within 280 pixels.',{chainDamagePct:.25,chainRadius:280}),
      C('Mythic','Low-Battery Bento','Below 35% HP, take 24% less damage and reload 25% faster.',{lowHpReductionPct:.24,reloadPct:.25}),
      C('Legendary','Projected-Charge Prix Fixe','Super damage increases 45%; casting it grants 2,500 shield and restores 2 ammo.',{superDamagePct:.45,superShield:2500,superAmmo:2,shieldCap:4600}),
      C('Legendary','Infinite Screen Time','Dodge 16% of projectile hits and regenerate 150 HP/sec.',{dodgeChance:.16,regenPerSec:150})
    ]),
    malakor: D('malakor', [
      C('Epic','Hellfire Hosomaki','Putting You Down deals 11% more damage and burns for 2 seconds.',{damagePct:.11,burnMs:2000}),
      C('Epic','Crimson Course','Heal for 11% of damage dealt.',{lifestealPct:.11}),
      C('Epic','Demon-Hand Dash','Hits grant 13% speed for 1.8 seconds.',{hitSpeedPct:.13,hitSpeedMs:1800}),
      C('Mythic','Infernal Teppanyaki','Hits splash 32% damage in a 145-pixel Hell zone.',{splashDamagePct:.32,splashRadius:145}),
      C('Mythic','Abyssal Appetizer','Hits pull enemies 75 pixels closer and slow for 0.7 seconds.',{pull:75,slowMs:700}),
      C('Mythic','Damnation Dinner','Enemies below 45% HP take 28% extra damage.',{executeThreshold:.45,executeDamagePct:.28}),
      C('Legendary','Hell Is a Buffet','Super damage increases 58%; casting it heals 1,500 and grants 2,000 shield.',{superDamagePct:.58,superHeal:1500,superShield:2000,shieldCap:4200}),
      C('Legendary','Upside-Down Omakase','Below 35% HP, deal 35% more damage, take 20% less, and burn every enemy hit.',{lowHpDamagePct:.35,lowHpReductionPct:.20,burnMs:2800,burnStacks:2})
    ]),
    beam: D('beam', [
      C('Epic','Focused Filet','Focus Beam deals 9% more damage.',{damagePct:.09}),
      C('Epic','Emergency-Cooling Ebi','Heal for 12% of damage dealt.',{lifestealPct:.12}),
      C('Epic','Prism-Step Pickle','Hits grant 12% speed for 1.4 seconds.',{hitSpeedPct:.12,hitSpeedMs:1400}),
      C('Mythic','Thermal-Resonance Roll','Damage converts to shield at 22%, capped at 3,200.',{damageShieldPct:.22,shieldCap:3200}),
      C('Mythic','Overload Residue','Hits burn enemies for 2.6 seconds.',{burnMs:2600}),
      C('Mythic','Golden-Gauge Gunkan','Every third hit adds 6% Super charge and heals 350.',{thirdHitSuperCharge:6,thirdHitHeal:350}),
      C('Legendary','Golden-Beam Banquet','Super damage increases 52%; casting it restores 2 ammo and grants 2,200 shield.',{superDamagePct:.52,superAmmo:2,superShield:2200,shieldCap:4200}),
      C('Legendary','Final-Quarter Feast','Below 35% HP, deal 38% more damage, move 20% faster, and take 18% less.',{lowHpDamagePct:.38,lowHpSpeedPct:.20,lowHpReductionPct:.18})
    ]),
    paradox: D('paradox', [
      C('Epic','Time-Skip Temaki','Temporal Skip deals 10% more damage.',{damagePct:.10}),
      C('Epic','Chronoshift Chirashi','Dodge 12% of projectile hits.',{dodgeChance:.12}),
      C('Epic','Fast-Forward Food','Move 11% faster and fire 10% faster.',{speedPct:.11,fireDelayPct:.10}),
      C('Mythic','Quantum-Tangle Tartare','Hits pull enemies 70 pixels closer and slow for 0.8 seconds.',{pull:70,slowMs:800}),
      C('Mythic','Temporal-Fracture Tray','Hits chain 28% damage to an enemy within 300 pixels.',{chainDamagePct:.28,chainRadius:300}),
      C('Mythic','Rewind Refill','Every third hit heals 650 and restores 1 ammo.',{thirdHitHeal:650,thirdHitAmmo:1}),
      C('Legendary','Relativity-Roll Banquet','Super damage increases 45%; casting it grants 35% speed, 1,800 shield, and 1 ammo.',{superDamagePct:.45,superSpeedPct:.35,superSpeedMs:4000,superShield:1800,superAmmo:1,shieldCap:3800}),
      C('Legendary','Grandfather Platter','The first knockout rewinds Paradox back with 3,000 HP.',{reviveHp:3000})
    ]),
    sera_eclipse: D('sera_eclipse', [
      C('Epic','Solar Sashimi','Eclipse Flare deals 9% more damage.',{damagePct:.09}),
      C('Epic','Lunar Lifebite','Heal for 17% of damage dealt.',{lifestealPct:.17}),
      C('Epic','Corona Crunch','Every third hit heals 700 HP.',{thirdHitHeal:700}),
      C('Mythic','Umbral Uramaki','Hits slow enemies for 0.85 seconds and grant 10% speed.',{slowMs:850,hitSpeedPct:.10,hitSpeedMs:1800}),
      C('Mythic','Gravity-Garnish Pull','Hits pull enemies 60 pixels toward Sera.',{pull:60}),
      C('Mythic','Two-Sided Supper','Maximum HP increases 14%; regenerate 130 HP/sec.',{hpPct:.14,regenPerSec:130}),
      C('Legendary','Total-Eclipse Tasting','Super damage increases 48%; casting it heals 2,000 and grants 2,000 shield.',{superDamagePct:.48,superHeal:2000,superShield:2000,shieldCap:4200}),
      C('Legendary','Light After Dark','The first knockout revives Sera Eclipse with 3,000 HP; below 35% HP take 20% less damage.',{reviveHp:3000,lowHpReductionPct:.20})
    ]),
    boom_arang: D('boom_arang', [
      C('Epic','Return-Roll','Boomerang Toss deals 13% more damage.',{damagePct:.13}),
      C('Epic','Catch-and-Go Crab','Hits grant 16% speed for 2 seconds.',{hitSpeedPct:.16,hitSpeedMs:2000}),
      C('Epic','Tag-Team Tuna','Every third hit adds 5% Super charge.',{hitSuperCharge:5}),
      C('Mythic','Double-Return Dinner','Hits chain 30% damage to an enemy within 300 pixels.',{chainDamagePct:.30,chainRadius:300}),
      C('Mythic','Quick-Recall Quinoa','Each hit has a 28% chance to refund ammo.',{ammoRefundChance:.28}),
      C('Mythic','Stun-Tag Sashimi','Hits have a 15% chance to stun for 0.8 seconds.',{stunChance:.15,stunMs:800}),
      C('Legendary','Gravity-Recall Grand Course','Super damage increases 52% and pulls enemies 110 pixels toward Boom-Arang.',{superDamagePct:.52,pull:110}),
      C('Legendary','Infinite-Orbit Omakase','Gain +1 maximum ammo; knockouts restore 2 ammo and grant 25% speed.',{ammoBonus:1,killAmmo:2,killSpeedPct:.25,killSpeedMs:3500})
    ]),
    teether: D('teether', [
      C('Epic','Three-Tooth Temaki','Bite Pattern deals 12% more damage.',{damagePct:.12}),
      C('Epic','Fresh-Floss Flight','Hits grant 18% speed for 2 seconds.',{hitSpeedPct:.18,hitSpeedMs:2000}),
      C('Epic','Enamel Entrée','Damage dealt converts to shield at 18%, capped at 2,600.',{damageShieldPct:.18,shieldCap:2600}),
      C('Mythic','Floss-Line Fishing','Hits pull enemies 90 pixels toward Teether.',{pull:90}),
      C('Mythic','Cavity Cashback','Each hit has a 24% chance to refund ammo.',{ammoRefundChance:.24}),
      C('Mythic','Full-Set Stun Roll','Hits have a 13% chance to stun for 0.75 seconds.',{stunChance:.13,stunMs:750}),
      C('Legendary','Tooth-Fairy Tasting','Super damage increases 48%; casting it grants 35% speed, 1,800 shield, and 1 ammo.',{superDamagePct:.48,superSpeedPct:.35,superSpeedMs:4200,superShield:1800,superAmmo:1,shieldCap:3600}),
      C('Legendary','Baby-Tooth Backup','The first knockout revives Teether with 2,600 HP; takedowns grant 25 Super charge.',{reviveHp:2600,killSuperCharge:25})
    ]),
    fuel: D('fuel', [
      C('Epic','One-Two-Three-Flambé','Flame attacks deal 10% more damage.',{damagePct:.10}),
      C('Epic','Grease-Fire Gunkan','Hits burn for 2.6 seconds.',{burnMs:2600}),
      C('Epic','Hotfoot Hosomaki','Hits grant 14% speed for 1.8 seconds.',{hitSpeedPct:.14,hitSpeedMs:1800}),
      C('Mythic','Fourth-Flame Feast','Every third hit restores 1 ammo and adds 4% Super charge.',{thirdHitAmmo:1,thirdHitSuperCharge:4}),
      C('Mythic','Narrow-Cone Nigiri','Enemies below 45% HP take 24% extra damage.',{executeThreshold:.45,executeDamagePct:.24}),
      C('Mythic','Backdraft Bento','Hits pull enemies 65 pixels closer and burn with 2 stacks.',{pull:65,burnMs:2400,burnStacks:2}),
      C('Legendary','Five-Finger Flambé','Super damage increases 55%, restores 2 ammo, and grants 30% speed for 4 seconds.',{superDamagePct:.55,superAmmo:2,superSpeedPct:.30,superSpeedMs:4000}),
      C('Legendary','Feel-the-Fire Omakase','Below 35% HP, deal 35% more damage and take 20% less; knockouts heal 1,400.',{lowHpDamagePct:.35,lowHpReductionPct:.20,killHeal:1400})
    ]),
    xray: D('xray', [
      C('Epic','Infrared Ikura','IR Beam deals 11% more damage.',{damagePct:.11}),
      C('Epic','Ammo-Scan Appetizer','Every hit adds 3% Super charge.',{hitSuperCharge:3}),
      C('Epic','Radiology Rice','Regenerate 100 HP/sec and move 8% faster.',{regenPerSec:100,speedPct:.08}),
      C('Mythic','Contrast-Dye Course','Hits slow enemies for 0.9 seconds.',{slowMs:900}),
      C('Mythic','Penetrating Plate','Hits chain 27% damage to a nearby enemy within 300 pixels.',{chainDamagePct:.27,chainRadius:300}),
      C('Mythic','Machine-Shield Maki','Damage dealt converts to shield at 20%, capped at 3,200.',{damageShieldPct:.20,shieldCap:3200}),
      C('Legendary','Full-Body Scan Banquet','Super damage increases 45%; casting it grants 2,600 shield and heals 1,200.',{superDamagePct:.45,superShield:2600,superHeal:1200,shieldCap:4800}),
      C('Legendary','Critical Finding','Enemies below 50% HP take 30% extra damage; knockouts grant 25 Super charge.',{executeThreshold:.50,executeDamagePct:.30,killSuperCharge:25})
    ]),
    angel: D('angel', [
      C('Epic','Halo Hosomaki','Guiding Light deals 11% more damage.',{damagePct:.11}),
      C('Epic','Blessed Bento','Guiding Light heals Angel for 180 HP when it hits.',{attackHeal:180}),
      C('Epic','Cloud-Step Roll','Hits grant 14% speed for 1.8 seconds.',{hitSpeedPct:.14,hitSpeedMs:1800}),
      C('Mythic','Radiant Refill','Fire 16% faster and charge Super 15% faster.',{fireDelayPct:.16,superGainPct:.15}),
      C('Mythic','Guardian Gunkan','Damage dealt converts to shield at 20%, capped at 3000.',{damageShieldPct:.20,shieldCap:3000}),
      C('Mythic','Mercy Maki','Every third hit heals 700 HP and restores 1 ammo.',{thirdHitHeal:700,thirdHitAmmo:1}),
      C('Legendary','Second-Serving Soul','The first knockout revives Angel with 3000 HP.',{reviveHp:3000}),
      C('Legendary','Team-Takeback Tray','Casting Super grants 2600 shield, heals 1400, and adds 25% speed.',{superShield:2600,superHeal:1400,superSpeedPct:.25,superSpeedMs:4000,shieldCap:4600})
    ]),
    demon: D('demon', [
      C('Epic','Hellblade Hand Roll','Hellblade deals 12% more damage.',{damagePct:.12}),
      C('Epic','Glide Gunkan','Hits grant 18% speed for 1.8 seconds.',{hitSpeedPct:.18,hitSpeedMs:1800}),
      C('Epic','Barbed Bento','Hits slow enemies for 0.7 seconds.',{slowMs:700}),
      C('Mythic','Recall Rice','Fire 18% faster and each hit adds 3 Super charge.',{fireDelayPct:.18,hitSuperCharge:3}),
      C('Mythic','Doom Dumpling','Hits pull enemies 80 pixels toward Demon.',{pull:80}),
      C('Mythic','Blood-Red Roll','Heal for 18% of damage dealt.',{lifestealPct:.18}),
      C('Legendary','Three-Blade Banquet','Super damage increases 52%; casting it grants 2500 shield.',{superDamagePct:.52,superShield:2500,shieldCap:4500}),
      C('Legendary','Demonic Second Course','Below 35% HP, deal 32% more damage and take 22% less.',{lowHpDamagePct:.32,lowHpReductionPct:.22})
    ])
  };
})();
