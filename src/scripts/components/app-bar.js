class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header>
        <h1>Notes App</h1>
        <nav>
          <button id="show-notes">All Notes</button>
          <button id="show-archived">Archived</button>
        </nav>
      </header>
    `;
  }
}

customElements.define('app-bar', AppBar);
