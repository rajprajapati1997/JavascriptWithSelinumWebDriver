import { expect } from 'chai';
import { getDriver } from '../utils/driver.js';
import { By, until } from 'selenium-webdriver';

describe('Amazon Product Search and Login Fields Check', function () {
  let driver;

  // Increase the test timeout to 15 seconds for longer operations
  this.timeout(15000);

  // Initialize WebDriver before the test
  before(async function () {
    driver = await getDriver();
  });

  // Quit WebDriver after the test
  after(async function () {
    if (driver) {
      driver.timeout(5000);
      await driver.quit();
    }
  });

  it('should search for a product and verify results', async function () {
    // Open Amazon
    await driver.get('https://www.amazon.com');
    await driver.manage().window().maximize();

    // Find search bar and enter product name
    const searchBar = await driver.findElement(By.id('twotabsearchtextbox'));
    await searchBar.sendKeys('laptop');

    // Click search button
    const searchButton = await driver.findElement(By.id('nav-search-submit-button'));
    await searchButton.click();

    // Wait for results
    await driver.wait(until.elementLocated(By.css('.s-main-slot')), 10000);

    // Verify results
    const results = await driver.findElements(By.css('.s-main-slot .s-result-item'));
    expect(results.length).to.be.greaterThan(0, 'No search results found');

    // Verify first result title contains search term
    const firstResultTitle = await results[0].findElement(By.css('h2')).getText();
    expect(firstResultTitle.toLowerCase()).to.include('laptop', 'First result does not match search term');
  });

  it('should check if login fields are available', async function () {
    // Open Amazon homepage
    await driver.get('https://www.amazon.com');

    // Click on the "Sign-In" button (it may be in the navbar or elsewhere)
    const signInButton = await driver.findElement(By.id('nav-link-accountList'));
    await signInButton.click();

    // Wait for the email/phone number field to appear
    const emailField = await driver.wait(until.elementLocated(By.id('ap_email')), 10000);
    expect(await emailField.isDisplayed()).to.be.true;

    // Check if the "Continue" button is present before password field
    const continueButton = await driver.findElement(By.id('continue'));
    expect(await continueButton.isDisplayed()).to.be.true;

    // You could potentially check for the password field on the next page
    // For now, we just check if the first login step (email/phone) is available
  });
});
