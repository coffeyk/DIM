import angular from 'angular'
import bungieAuthComponent from './bungie-auth.component';
import routing from './bungie-auth.routing';

const bungieAuthModule = angular
    .module('bungieAuth', [])
    .component('bungieAuth', bungieAuthComponent)
    .config(routing);

export default bungieAuthModule.name;