/* jshint -W117, -W030 */
describe('layout', function () {
    describe('SidebarController', function () {
        var controller;
        var views = {
            dashboard: 'app/dashboard/dashboard.html',
            admin: 'app/admin/admin.html'
        };

        beforeEach(function() {
            bard.appModule('app.layout');
            bard.inject('$controller', '$httpBackend', '$location',
                        '$rootScope', '$state', 'routerHelper');
        });

        beforeEach(function () {
            routerHelper.configureStates(mockData.getMockStates(), '/');
            $httpBackend.when('GET', views.dashboard).respond(200);
            controller = $controller('SidebarController');
            $rootScope.$apply();
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should have isCurrent() for / to return `current`', function() {
            $location.path('/');
            $httpBackend.flush();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for /admin to return `current`', function() {
            $httpBackend.when('GET', views.admin).respond(200);
            $location.path('/admin');
            $httpBackend.flush();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for non route not return `current`', function() {
            $location.path('/invalid');
            $httpBackend.flush();
            expect(controller.isCurrent({title: 'invalid'})).not.to.equal('current');
        });
    });
});
