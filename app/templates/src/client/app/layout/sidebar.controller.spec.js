/* jshint -W117, -W030 */
describe('layout', function () {
    describe('SidebarController', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($controller, $httpBackend, $location, $rootScope, $state) {});
        });

        beforeEach(function () {
            controller = $controller('SidebarController');
        });

        it('should have isCurrent() for / to return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for /customers to return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $httpBackend.when('GET', 'app/customers/customers.html').respond(200);
            $location.path('/customers');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for non route not return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/invalid');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent({title: 'invalid'})).not.to.equal('current');
        });

        specHelper.verifyNoOutstandingHttpRequests();
    });
});