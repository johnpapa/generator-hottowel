/* jshint -W117, -W030 */
describe('dashboard', function () {
    describe('state', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $state) {});            
            $httpBackend.expectGET('app/dashboard/dashboard.html').respond(200);
        });

        it('should map / route to dashboard View template', function () {
            expect($state.get('dashboard').templateUrl).
                to.equal('app/dashboard/dashboard.html');
        });

        it('should map state dashboard to url / ', function () {
            expect($state.href('dashboard', {})).to.equal('/');
        });

        it('of dashboard should work with $state.go', function () {
            $state.go('dashboard');
            $rootScope.$apply();
            expect($state.is('dashboard'));
        });

    });
});