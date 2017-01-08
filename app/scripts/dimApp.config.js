(function() {
  'use strict';

  console.time('First item directive built');

  angular.module('dimApp')
    .config((localStorageServiceProvider) => {
      localStorageServiceProvider.setPrefix('');
    });

  angular.module('dimApp')
    .value('dimPlatformIds', {
      xbl: null,
      psn: null
    })
    .value('dimState', {
      membershipType: -1,
      active: null,
      debug: false
    })
    .value('dimFeatureFlags', {
      isExtension: window.chrome && window.chrome.extension,
      // Tags are off in release right now
      tagsEnabled: '$DIM_FLAVOR' !== 'release',
      compareEnabled: true,
      vendorsEnabled: true,
      qualityEnabled: true,
      // Additional debugging / item info tools
      debugMode: false,
      // Print debug info to console about item moves
      debugMoves: false,
      // show changelog toaster
      changelogToaster: '$DIM_FLAVOR' === 'release' || '$DIM_FLAVOR' === 'beta',

      materialsExchangeEnabled: '$DIM_FLAVOR' !== 'release'
    })
    .factory('loadingTracker', ['promiseTracker', function(promiseTracker) {
      return promiseTracker();
    }]);


  angular.module('dimApp')
    .run(['$window', '$rootScope', '$translate', 'loadingTracker', '$timeout', 'toaster', '$http', 'SyncService', 'dimInfoService', 'dimFeatureFlags', 'dimSettingsService',
      function($window, $rootScope, $translate, loadingTracker, $timeout, toaster, $http, SyncService, dimInfoService, dimFeatureFlags, dimSettingsService) {
        $rootScope.loadingTracker = loadingTracker;

        // 1 Hour
        $rootScope.inactivityLength = 60 * 60 * 1000;

        $rootScope.isUserInactive = function() {
          var currentTime = Date.now();

          // Has This User Been Inactive For More Than An Hour
          return ((currentTime) - $rootScope.lastActivity) > $rootScope.inactivityLength;
        };

        $rootScope.trackActivity = function() {
          $rootScope.lastActivity = Date.now();
        };

        // Track Our Initial Activity of Starting the App
        $rootScope.trackActivity();

        $window.initgapi = function() {
          SyncService.init();
        };

        var chromeVersion = /Chrome\/(\d+)/.exec($window.navigator.userAgent);

        $rootScope.$on('dim-settings-loaded', function() {
          var language = dimSettingsService.language;

          if (chromeVersion && chromeVersion.length === 2 && parseInt(chromeVersion[1], 10) < 51) {
            dimInfoService.show('old-chrome', {
              title: $translate.instant('Help.UpgradeChrome'),
              view: 'views/' + language + '/upgrade-chrome.html?v=$DIM_VERSION',
              type: 'error'
            }, 0);
          }

          console.log('DIM v$DIM_VERSION - Please report any errors to https://www.reddit.com/r/destinyitemmanager');

          if (dimFeatureFlags.changelogToaster) {
            /* eslint no-constant-condition: 0*/
            dimInfoService.show('changelogv$DIM_VERSION'.replace(/\./gi, ''), {
              title: '$DIM_FLAVOR' === 'release' ? $translate.instant('Help.Version.Stable') : $translate.instant('Help.Version.Beta'),
              view: 'views/' + language + '/changelog-toaster' + ('$DIM_FLAVOR' === 'release' ? '' : '-beta') + '.html?v=v$DIM_VERSION'
            });
          }
        });
      }
    ]);

  angular.module('dimApp')
    .config([
      'hotkeysProvider',
      function(hotkeysProvider) {
        hotkeysProvider.includeCheatSheet = true;
      }
    ])
    .config([
      '$compileProvider',
      function($compileProvider) {
        // TODO: remove this depenency by fixing component bindings https://github.com/angular/angular.js/blob/master/CHANGELOG.md#breaking-changes-1
        $compileProvider.preAssignBindingsEnabled(true);
        // Allow chrome-extension: URLs in ng-src
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|chrome-extension):|data:image\/)/);
      }
    ])
    .config(["ngHttpRateLimiterConfigProvider", function(rateLimiterConfigProvider) {
      // Bungie's API will start throttling an API if it's called more than once per second. It does this
      // by making responses take 2s to return, not by sending an error code or throttling response. Choosing
      // our throttling limit to be 1 request every 1100ms lets us achieve best throughput while accounting for
      // what I assume is clock skew between Bungie's hosts when they calculate a global rate limit.
      rateLimiterConfigProvider.addLimiter(/www\.bungie\.net\/Platform\/Destiny\/TransferItem/, 1, 1100);
      rateLimiterConfigProvider.addLimiter(/www\.bungie\.net\/Platform\/Destiny\/EquipItem/, 1, 1100);
    }])
    .config(["$httpProvider", function($httpProvider) {
      $httpProvider.interceptors.push("ngHttpRateLimiterInterceptor");
      if (!window.chrome || !window.chrome.extension) {
        $httpProvider.interceptors.push('http-refresh-token');
      }
    }])
    .run(function($rootScope, $state, localStorageService) {
      $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (!(window.chrome && window.chrome.extension)) {
          if (!localStorageService.get('authorization')) {
            if (toState.name !== 'login') {
              $state.go('login');
              event.preventDefault();
            }
          }
        }
      });
    })
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/inventory");

      $stateProvider
        .state('inventory', {
          url: "/inventory",
          templateUrl: "views/inventory.html"
        })
        .state('best', {
          url: "/best",
          templateUrl: "views/best.html"
        })
        .state('vendors', {
          url: "/vendors",
          templateUrl: "views/vendors.html"
        })
        .state('materials-exchange', {
          url: "/materials-exchange",
          templateUrl: "views/mats-exchange.html"
        })
        .state('debugItem', {
          url: "/debugItem/:itemId",
          templateUrl: "views/debugItem.html"
        })
        .state('developer', {
          url: "/developer",
          templateUrl: "scripts/developer/developer.html"
        })
        .state('login', {
          url: "/login",
          templateUrl: "scripts/login/login.html"
        });
    });
})();
