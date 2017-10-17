/* eslint-env node, es6 */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = {
  name: 'ember-cli-pact',

  config(env) {
    return {
      'ember-cli-pact': {
        providerName: null,
        consumerName: this.project.name(),
        mockProvider: 'mirage',
        serviceInjections: ['store'],
        pactsDirectory: 'pacts',
        mode: process.env.PACT_MODE || (process.env.CI ? 'verify' : 'write'),
        pactVersion: 3,
        enabled: env !== 'production'
      }
    };
  },

  shouldIncludeChildAddon(addon) {
    // Always include Babel so ember-cli doesn't complain
    return this._isEnabled() || addon.name === 'ember-cli-babel';
  },

  treeFor() {
    if (this._isEnabled()) {
      return this._super.treeFor.apply(this, arguments);
    }
  },

  testemMiddleware(app) {
    if (this._isEnabled()) {
      const PactMiddleware = require('./lib/pact-middleware');
      new PactMiddleware(this._readConfig()).attach(app);
    }
  },

  _isEnabled() {
    return this._readConfig().enabled !== false;
  },

  _readConfig() {
    return this.project.config(EmberApp.env())['ember-cli-pact'] || {};
  }
};
