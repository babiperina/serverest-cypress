import BasePage from "./BasePage";

/**
 * The edit product page doesn't exist yet: the "Editar" button on the product list
 * does nothing (see "Known bugs" in the README).
 *
 * The selectors below assume the page will reuse the create product form and its
 * data-testid attributes. Good practice would be for the new page to expose
 * data-testid attributes for its fields and the save button, so these selectors
 * can be confirmed once the page exists.
 */
class EditProductPage extends BasePage {
  get descriptionInput() {
    return this.getByTestId("descricao");
  }

  get saveButton() {
    return this.descriptionInput.closest("form").find('button[type="submit"]');
  }

  appendToDescription(text) {
    this.descriptionInput.type(text);
    this.saveButton.click();
    return this;
  }
}

export default new EditProductPage();
