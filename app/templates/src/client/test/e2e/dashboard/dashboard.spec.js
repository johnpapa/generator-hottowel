/* jshint -W117 */
describe('E2E: Dashboard', function () {
  beforeEach(function() {
    browser.get('/');
  });

  it('should have dashboard in its <title> tag.', function() {
    expect(browser.getTitle()).toContain('dashboard');
  });

  it('should have home button active', function() {
    var curNav = element(by.css('.current')).$('a');
    expect(curNav.getText()).toBe('Dashboard');
  });
});
