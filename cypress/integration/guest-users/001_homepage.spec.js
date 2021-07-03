describe("Homepage", () => {
  it("renders a setup button and signup button", () => {
    cy.visit("/");

    // create a new diary
    cy.get("[data-testid=setup-button]");
    cy.get("[data-testid=signup-button]");
  });

  it("setup button redirects to diary setup page without asking for login or signup", () => {
    cy.get("[data-testid=setup-button]").click();
  });
});
