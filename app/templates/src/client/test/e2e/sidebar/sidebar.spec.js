/* jshint -W117 */
describe('E2E: Navigation > Sidebar', function() {
  var sidebarLinks;

  beforeEach(function() {
    // in most cases, want to start at the root page
    browser.get('/');
  });

  beforeEach(function() {
    sidebarLinks = element.all(by.repeater('r in vm.navRoutes'));
  });

  it('should have sidebar configured properly', function() {
    expect(sidebarLinks.count()).toBe(2);
    expect(sidebarLinks.get(0).getText()).toBe('Dashboard');
    expect(sidebarLinks.get(1).getText()).toBe('Admin');
  });

  it('should have sidebar navigate to admin', function(done) {
    sidebarLinks.get(1).click().then(function() {
      expect(browser.getTitle()).toContain('Admin');
      expect(browser.getCurrentUrl()).toContain('admin');
      expect(element(by.css('.current')).$('a').getText()).toBe('Admin');
    }).thenFinally(function() {
      done();
    });
  });

  it('should navigate to dashboard', function(done) {
    browser.get('/admin');

    sidebarLinks.get(0).click().then(function() {
      expect(browser.getTitle()).toContain('dashboard');
      expect(element(by.css('.current')).$('a').getText()).toBe('Dashboard');
    }).thenFinally(function() {
      done();
    });
  });
});
