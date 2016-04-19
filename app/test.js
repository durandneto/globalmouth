var newuser = Math.random(0,1);
describe('Globalmouth Test', function() {
  it('should be able to create a new user!', function(done) {
    browser.get('http://0.0.0.0:8000/#/');
    expect(element(by.id('gbm_login_title')).getText()).toEqual("Global Mouth");
    // getting input user name
    var input_username = element(by.id('username'));
    // getting button login
    var btn_login = element(by.id('btn_login'));
    // set input with the new user's name
    input_username.sendKeys(newuser);
    // click button login
    btn_login.click();  
    expect(element(by.id('nav-userinfo')).getText()).toEqual(newuser + " ( POINTS : 0 )");
    done();
  }); 
  
  it('should be able to logout!', function(done) {
    // getting button logout
    var btn_logout = element(by.id('nav-btn_logout')); 
    // click button logout
    btn_logout.click(); 
    expect(element(by.id('gbm_login_title')).getText()).toEqual("Global Mouth");
    done();
  });
  
  it('should be able to login with the same user!', function(done) {
    // getting input user name
    var input_username = element(by.id('username'));
    // getting button login
    var btn_login = element(by.id('btn_login'));
    // set input with the new user's name
    input_username.clear().sendKeys(newuser);
    // click button login
    btn_login.click(); 
    expect(element(by.id('nav-userinfo')).getText()).toEqual(newuser + " ( POINTS : 0 )");
    done();
  });
});