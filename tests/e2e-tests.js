describe('Cisco AWS App', function () {
    it('should have a title', function () {
        browser.get('http://localhost:8080/#/login');
        expect(browser.getTitle()).toEqual('Cisco AWS App');
    });
});

describe('Login with Invalid credentials', function () {
    it('Should Log the user in with Invalid Credentials', function () {
        browser.get('http://localhost:8080/#/login');

        var username = element(by.model('username'));
        username.sendKeys('admin');

        var password = element(by.model('password'));
        password.sendKeys('test');

        element(by.id('signIn')).click();

        browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                return (/login/).test(url);
            });
        });
        //Jasmine expect statement : compare actual and expected value
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/login');

    });
});

describe('Login with valid creds', function () {
    it('Should Log the user in with valid Credentials', function () {
        browser.get('http://localhost:8080/#/login');

        var username = element(by.model('username'));
        username.sendKeys('test');

        var password = element(by.model('password'));
        password.sendKeys('test');

        element(by.id('signIn')).click();

        browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                return (/grid/).test(url);
            });
        });
        //Jasmine expect statement : compare actual and expected value
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/grid');

    });
});


describe('Log Out', function () {
    it('Should Log out the user and bring him back to the Login Page', function () {
        browser.get('http://localhost:8080/#/login');

        var username = element(by.model('username'));
        username.sendKeys('test');

        var password = element(by.model('password'));
        password.sendKeys('test');

        element(by.id('signIn')).click();

        browser.waitForAngular();

        element(by.id('signOut')).click();

        browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                return (/login/).test(url);
            });
        });
        //Jasmine expect statement : compare actual and expected value
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/login');
    });
});

describe('Login Interceptor Testing', function () {
    it('401 response should redirect to login page', function () {
        browser.get('http://localhost:8080/#/grid');

    browser.driver.wait(function () {
        return browser.driver.getCurrentUrl().then(function (url) {
            return (/login/).test(url);
        });
    });

    expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/login');

    });
});

