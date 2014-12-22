(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[<%= appName %> Error] ',
        appTitle: '<%= appName %>'
    };

    core.value('config', config);

    core.config(configure);

    /* @ngInject */
    function configure ($logProvider, routerHelperProvider, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
    }

})();
