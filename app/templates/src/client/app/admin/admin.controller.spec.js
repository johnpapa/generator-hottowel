/* jshint -W117, -W030 */
describe('AdminController', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        stubs.dataservice.getPeople($q, dataservice);
        stubs.dataservice.getMessageCount($q, dataservice);

        controller = $controller('AdminController');
        $rootScope.$apply();
    });

    describe('Admin controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Admin', function() {
                expect(controller.title).to.equal('Admin');
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});