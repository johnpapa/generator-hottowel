/* jshint -W117, -W030 */
describe('admin routes', function () {
    describe('state', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $state) {});
            $httpBackend.expectGET('app/admin/admin.html').respond(200);
        });

        it('should map state admin to url /admin ', function () {
            expect($state.href('admin', {})).to.equal('/admin');
        });

        it('should map /admin route to admin View template', function () {
            expect($state.get('admin').templateUrl).
                to.equal('app/admin/admin.html');
        });

        it('of admin should work with $state.go', function () {
            $httpBackend.expectGET('app/dashboard/dashboard.html').respond(200);
            $state.go('admin');
            $rootScope.$apply();
            expect($state.is('admin'));
        });
    });
});