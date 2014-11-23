/* jshint -W117, -W030 */
describe('ShellController', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, $timeout, dataservice) {});            
    });

    beforeEach(function () {
        controller = $controller('ShellController');
        $rootScope.$apply();
    });

    describe('Shell controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        it('should show splash screen', function () {
            expect(controller.showSplash).to.be.true;
        });

        it('should hide splash screen after timeout', function (done) {
            $timeout(function() {
                expect(controller.showSplash).to.be.false;
                done();
            }, 1000);
            $timeout.flush();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});