(function initArenaForgeModuleRegistry(global) {
  'use strict';

  if (global.ArenaForgeModules) return;

  const registry = {
    version: 2,
    brawlers: Object.create(null),
    modes: Object.create(null),
    systems: Object.create(null),
    loadedFiles: [],

    registerBrawler(id, definition) {
      if (!id || !definition || typeof definition !== 'object') {
        throw new Error('registerBrawler requires an id and definition');
      }
      this.brawlers[id] = Object.freeze({ ...definition, id });
      return this.brawlers[id];
    },

    getBrawler(id) {
      return this.brawlers[id] || null;
    },

    hydrateBrawlerDefinitions(definitions, ids) {
      if (!definitions || typeof definitions !== 'object' || !Array.isArray(ids)) {
        throw new Error('hydrateBrawlerDefinitions requires definitions and an id array');
      }
      for (const id of ids) {
        const legacyDefinition = definitions[id];
        if (!legacyDefinition) continue;
        const currentDefinition = this.brawlers[id] || {};
        this.registerBrawler(id, {
          ...legacyDefinition,
          ...currentDefinition,
          migration: {
            ...(currentDefinition.migration || {}),
            phase: Math.max(2, Number(currentDefinition.migration?.phase) || 0),
            metadata: true
          }
        });
      }
      return this.brawlers;
    },

    registerBrawlerHooks(id, hooks) {
      if (!this.brawlers[id]) throw new Error(`Cannot add hooks for unknown brawler: ${id}`);
      if (!hooks || typeof hooks !== 'object') {
        throw new Error('registerBrawlerHooks requires a hooks object');
      }
      const currentDefinition = this.brawlers[id];
      return this.registerBrawler(id, {
        ...currentDefinition,
        hooks: Object.freeze({
          ...(currentDefinition.hooks || {}),
          ...hooks
        })
      });
    },

    runBrawlerHook(id, hookName, context) {
      const hook = this.brawlers[id]?.hooks?.[hookName];
      if (typeof hook !== 'function') return false;
      return hook(context) === true;
    },

    getMigrationReport(ids = Object.keys(this.brawlers)) {
      const hookNames = ['attack', 'super', 'aim', 'render', 'botAI', 'gadget', 'starPower', 'hypercharge', 'attachie', 'sushi'];
      return ids.map((id) => {
        const definition = this.brawlers[id] || {};
        const hooks = definition.hooks || {};
        return Object.freeze({
          id,
          rarity: definition.rarity || 'Unknown',
          metadata: Boolean(definition.name && definition.attack && definition.super),
          hooks: Object.freeze(
            Object.fromEntries(hookNames.map((hookName) => [hookName, typeof hooks[hookName] === 'function']))
          )
        });
      });
    },

    registerBrawlerGroup(rarity, ids) {
      if (!rarity || !Array.isArray(ids)) {
        throw new Error('registerBrawlerGroup requires a rarity and id array');
      }
      const specialNames = {
        boom_arang: 'Boom-Arang',
        bouncin_balls: "Bouncin' Balls",
        cheseypuff: 'CheeseyPuff',
        fightnfire: "Fight'nFire",
        goonbob: 'Blobert',
        money_and_tax: 'Money and Tax',
        peter_pickle: 'Peter Pickle',
        scuba_diver: 'Scuba Diver',
        sera_eclipse: 'Sera Eclipse',
        tempo_maker: 'Tempo Maker',
        upiedown: 'UpieDown'
      };
      for (const id of ids) {
        if (this.brawlers[id]) continue;
        const fallbackName = String(id)
          .split('_')
          .map((part) => part ? part[0].toUpperCase() + part.slice(1) : '')
          .join(' ');
        this.registerBrawler(id, {
          rarity,
          name: specialNames[id] || fallbackName,
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
      }
    },

    registerMode(id, definition) {
      if (!id || !definition || typeof definition !== 'object') {
        throw new Error('registerMode requires an id and definition');
      }
      this.modes[id] = Object.freeze({ ...definition, id });
      return this.modes[id];
    },

    registerSystem(id, definition) {
      if (!id || !definition || typeof definition !== 'object') {
        throw new Error('registerSystem requires an id and definition');
      }
      this.systems[id] = definition;
      return definition;
    }
  };

  global.ArenaForgeModules = registry;
})(window);
