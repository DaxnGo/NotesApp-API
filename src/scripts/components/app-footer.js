class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>Notes App &copy; ${new Date().getFullYear()} - Submission: Integrasi Notes App dengan RESTful API</p>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
