describe("Creating and managing issues", () => {
  beforeEach(() => {
    Cypress.Cookies.defaults({
      preserve: ["session", "session.sig"],
    });
  });

  it("new diary should not contain any issues", () => {
    cy.get(".issue-container").should("not.exist");
  });

  it("clicking the 'New' button opens the issue creation form", () => {
    cy.get("[data-testid=new-issue-button]").click();
  });

  it("error message appears if location is empty", () => {
    cy.get(".form-error").should("not.exist");
    cy.get("#location_name").click();
    // click on something else to trigger error message
    cy.get("#reference").click();
    cy.get(".form-error");
    cy.get("#location_name").type("loc1");
  });

  it("error message appears if type is empty", () => {
    cy.get(".form-error").should("not.exist");
    cy.get("#type_name").click();
    // click on something else to trigger error message
    cy.get("#reference").click();
    cy.get(".form-error");
    cy.get("#type_name").type("typ1");
  });

  it("error message appears if details field is empty", () => {
    cy.get(".form-error").should("not.exist");
    cy.get("#details").click();
    // click on something else to trigger error message
    cy.get("#reference").click();
    cy.get(".form-error");
    cy.get("#details").type("This is a test issue created by Cypress");
  });

  it("new issue should be created when the the new issue form is submitted", () => {
    // submit the form
    cy.get("[data-testid=new-issue-button]").click();
    cy.get(".issue-container");
    cy.contains("This is a test issue created by Cypress");
  });

  it("new issue should have the 'pending' status, persists after refresh", () => {
    cy.get(".issue-container").find(".tag").first().contains("PENDING");
    cy.reload();
    cy.get(".issue-container").find(".tag").first().contains("PENDING");
  });

  it("issue can be marked as prioritized, persists after refresh", () => {
    cy.get(".issue-container").find(".controls-toggle").click();
    cy.get(".controls-menu").find("[data-testid=pin-button]").click();
    cy.get(".issue-container").find(".tag").first().contains("PRIORITIZED");
    cy.reload();
    cy.get(".issue-container").find(".tag").first().contains("PRIORITIZED");
  });

  it("issue can be marked as pending again by toggling the same button again", () => {
    cy.get(".issue-container").find(".controls-toggle").click();
    cy.get(".controls-menu").find("[data-testid=pin-button]").click();
    cy.get(".issue-container").find(".tag").first().contains("PENDING");
    cy.reload();
    cy.get(".issue-container").find(".tag").first().contains("PENDING");
  });

  it("issue can be marked as resolved, issue disappears after refresh", () => {
    cy.get(".issue-container").find(".controls-toggle").click();
    cy.get(".controls-menu").find("[data-testid=resolve-button]").click();
    cy.get(".issue-container").find(".tag").first().contains("RESOLVED");
    cy.reload();
    cy.get(".issue-container").should("not.exist");
  });

  it("new issue can be marked as deleted, issue disappears after refresh", () => {
    // create a new issue
    cy.get("[data-testid=new-issue-button]").click();
    cy.get("#location_name").click();
    cy.get("#location_name").type("loc1");
    cy.get("#type_name").click();
    cy.get("#type_name").type("typ1");
    cy.get("#details").click();
    cy.get("#details").type("This is a test issue created by Cypress");
    cy.get("[data-testid=new-issue-button]").click();

    // mark new issue as deleted
    cy.get(".issue-container").find(".controls-toggle").click();
    cy.get(".controls-menu").find("[data-testid=delete-button]").click();
    cy.get(".issue-container").find(".tag").first().contains("DELETED");
    cy.reload();
    cy.get(".issue-container").should("not.exist");
  });

  it("private issues can be created, unauthorized users cannot see them", () => {
    // create a private issue
    cy.get("[data-testid=new-issue-button]").click();
    cy.get("#location_name").click();
    cy.get("#location_name").type("loc1");
    cy.get("#type_name").click();
    cy.get("#type_name").type("typ1");
    cy.get("#details").click();
    cy.get("#details").type("This is a test issue created by Cypress");
    cy.get("#private").click();
    cy.get("[data-testid=new-issue-button]").click();

    // check for private icon
    cy.get("[data-testid=private-icon]");

    // clear authentication cookies
    cy.url().as("diaryUrl");
    cy.get("#side-nav-toggle").click();
    cy.get("[data-testid=logout-button]").click();

    // visit the diary again
    cy.get("@diaryUrl").then((url) => {
      cy.visit(url);
    });

    // check if the private issue exists
    cy.get("[data-testid=new-issue-button]").should("not.exist");
  });

  it("entering the diary passcode allows user to see private issues", () => {
    // enter diary passcode and check that it exists
    cy.get("[data-testid=passcode-button]").click();

    // try wrong password
    cy.get("#passcode").click().type("wrongpassword{enter}");
    cy.get(".notification-container > div").should("not.be.empty");
    cy.get("#passcode").click().clear().type("cypress123{enter}");
    cy.get("[data-testid=passcode-button]").should("not.exist");
    cy.get("[data-testid=settings-button]");
    cy.get("[data-testid=diary-back-button]").click();
    cy.get(".issue-container");
    cy.get("[data-testid=private-icon]");
  });
});
