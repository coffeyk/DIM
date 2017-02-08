import { getAll, getSelected } from '../shell/platform/platform.reducers';
import _ from 'underscore';

class InventoryHeaderRightController {
  constructor($ngRedux, PlatformsActions, loadingTracker, dimStoreService, hotkeys) {
    'ngInject';

    this.store = $ngRedux;
    this.actions = PlatformsActions;
    this.tracker = loadingTracker;
    this.storeService = dimStoreService;
    this.hotkeys = hotkeys;
  }

  $onInit() {
    const self = this;

    this.unsubscribe = this.store.connect(this.mapStateToThis, this.actions)(this);

    this.refresh = _.debounce(() => {
      this.tracker.addPromise(this.storeService.reloadStores());
    }, 5000, true);

    this.hotkeys.add({
      combo: ['r'],
      description: "Refresh inventory",
      callback: () => {
        self.refresh();
      }
    });

    this.loadPlatforms();
  }

  $onDestroy() {
    this.unsubscribe();

    this.hotkeys.del('r');
  }

  mapStateToThis(state) {
    return {
      platforms: getAll(state.platform),
      selected: getSelected(state.platform)
    };
  }

  platformChange(platform) {
    this.setSelectedPlatform(platform);
  }
}

export default InventoryHeaderRightController;