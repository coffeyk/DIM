import angular from 'angular';
import 'angular-hotkeys';
import inventoryHeaderRight from './inventory-header-right.component';

const inventoryModule = angular
  .module('inventory', [
    'cfp.hotkeys'
  ])
  .component('inventoryHeaderRight', inventoryHeaderRight);

export default inventoryModule.name;