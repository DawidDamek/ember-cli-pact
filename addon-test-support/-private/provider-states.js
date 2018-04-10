/* global require */
import { assert } from '@ember/debug';

export function lookupProviderState(name) {
  assert(`Unknown provider state: ${name}`, STATES[name]);
  return STATES[name];
}

export function registerProviderState(name, config) {
  assert(`Duplicate provider state: ${name}`, !(name in STATES));
  assert(`Don't import provider state modules directly`, currentModule);
  STATES[name] = new ProviderState(name, config);
}

export function loadProviderStates(config) {
  if (loaded) {
    assert('Can\'t load provider states with different configuration', loaded === config.modulePrefix);
  } else {
    loaded = config.modulePrefix;

    // TODO make this configurable?
    let prefix = `${config.modulePrefix}/tests/helpers/pact-provider-states`;
    for (let module of Object.keys(require.entries)) {
      if (module.indexOf(prefix) === 0) {
        currentModule = module;
        try {
          require(module);
        } finally {
          currentModule = null;
        }
      }
    }
  }

  return STATES;
}

class ProviderState {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.source = currentModule;
  }
}

let currentModule;
let loaded = null;

let STATES = Object.create(null);
