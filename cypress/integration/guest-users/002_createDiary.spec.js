describe("New diary setup - validation", () => {
  beforeEach(() => {
    Cypress.Cookies.defaults({
      preserve: ["session", "session.sig"],
    });
  });
  it("diary name cannot be blank", () => {
    cy.visit("/");
    cy.get("[data-testid=setup-button").click();

    // try to submit without filling in any information
    cy.get("[data-testid=create-diary-button").click();
    cy.get(".form-error").first();

    // fill out information correctly
    cy.get("#name").click().type("Cypress Test Diary");
    cy.get("#description")
      .click()
      .type("A test diary created using Cypress end-to-end automatic testing.");
    cy.get("#passcode").click().type("cypress123");

    // submit the form and check that the diary setup page is opened
    cy.get("[data-testid=create-diary-button").click();
    cy.contains("Diary Setup");
    cy.url().should("include", "/setup");
  });

  it("diary versions can be added without page refresh", () => {
    cy.get(".tag").should("not.exist");
    cy.get("#name").click().type("ver x.x.x{enter}");
    cy.get(".tag");
    cy.get("[data-testid=next-step").click();
  });

  it("diary locations can be added without page refresh", () => {
    cy.get(".tag").should("not.exist");
    cy.get("#name").click().type("loc1{enter}");
    cy.get(".tag");
    cy.get("[data-testid=next-step").click();
  });

  it("diary types can be added without page refresh", () => {
    cy.get(".tag").should("not.exist");
    cy.get("#name").click().type("typ1{enter}");
    cy.get(".tag");
    cy.get("[data-testid=next-step").click();
  });

  it ("should be at the diary page when the last step is complete.", () => {
    cy.url().should("include", "/diary");
  })
});
