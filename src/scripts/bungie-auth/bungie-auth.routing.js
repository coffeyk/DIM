const routing = ($stateProvider) => {
  'ngInject';

  const states = [{
    name: 'bungie-auth',
    parent: 'content',
    component: 'bungieAuth',
    url: '/verifying-bungie-auth'
  }];

  states.forEach((state) => {
    $stateProvider.state(state);
  });
};

export default routing;