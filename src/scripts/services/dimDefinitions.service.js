import _ from 'underscore';

export default class Definitions {
  constructor($q, dimManifestService) {
    'ngInject';

    this.$q = $q;
    this.manifest = dimManifestService;
    this.cache = null;
    this.eagerTables = [
      'InventoryBucket',
      'Class',
      'Race',
      'Faction',
      'Vendor'
    ];
    this.lazyTables = [
      'InventoryItem',
      'Objective',
      'SandboxPerk',
      'Stat',
      'TalentGrid',
      'Progression',
      'Record',
      'ItemCategory'
    ];
  }

  getDefinitions() {
    var self = this;

    if (_.isNull(self.cache)) {
      self.cache = self.manifest.getManifest()
        .then(function(db) {
          const defs = {};

          // Load objects that lazily load their properties from the sqlite DB.
          self.lazyTables.forEach(function(tableShort) {
            const table = `Destiny${tableShort}Definition`;
            defs[tableShort] = new Proxy({}, {
              get: function(target, name) {
                if (name === 'then') {
                  return undefined;
                }

                if (this.hasOwnProperty(name)) {
                  return this[name];
                }
                const val = self.manifest.getRecord(db, table, name);
                this[name] = val;
                return val;
              }
            });
          });

          // Resources that need to be fully loaded (because they're iterated over)
          self.eagerTables.forEach(function(tableShort) {
            const table = `Destiny${tableShort}Definition`;
            defs[tableShort] = self.manifest.getAllRecords(db, table);
          });

          return defs;
        })
        .catch(function(e) {
          console.error(e);
          return self.$q.reject(e);
        });
    }

    return self.cache;
  }
}