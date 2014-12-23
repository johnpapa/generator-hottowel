(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('htImgPerson', htImgPerson);

    htImgPerson.$inject = ['config'];
    /* @ngInject */
    function htImgPerson (config) {
        //Usage:
        //<img ht-img-person="{{person.imageSource}}"/>
        var basePath = config.imageBasePath;
        var unknownImage = config.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('htImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }
})();
