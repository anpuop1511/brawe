(function registerOutlit(global) {
  'use strict';

  const modules = global.ArenaForgeModules;
  if (!modules) throw new Error('Arena Forge module registry must load before Outlit');

  modules.registerBrawler('outlit', {
    rarity: 'Common',
    name: 'Outlit',
    role: 'Damage Dealer',
    desc: 'Shotgun blast with strong point-blank damage.',
    color: '#ff9b42',
    attack: 'Scatter Pump',
    attackDesc: 'A compact shotgun blast with a tight spread and strong point-blank damage.',
    super: 'Boom Break',
    superDesc: 'Fires 2 heavy shells that destroy walls and crack open escape routes.',
    hyper: 'Super pierces, with tighter and faster main attacks.',
    g1: 'Next Shot Pierce',
    g2: 'Healing Pod',
    sp1: 'Shell Chill (Slows)',
    sp2: 'Long Boom (+35% Super Range)',
    migration: {
      phase: 1,
      metadata: true,
      combat: false,
      aiming: false,
      rendering: false,
      bots: false,
      sushi: false,
      attachies: false
    }
  });
})(window);
