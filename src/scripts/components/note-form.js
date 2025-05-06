class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this._initializeForm();
  }

  render() {
    this.innerHTML = `
      <form id="note-form">
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input type="text" id="title" name="title" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="body" class="form-label">Content</label>
          <textarea id="body" name="body" class="form-control" required></textarea>
        </div>
        <button type="submit" id="submit-btn" disabled>Add Note</button>
        <p id="form-error" class="error-message"></p>
      </form>
    `;
  }

  _initializeForm() {
    this.form = this.querySelector('#note-form');
    this.titleInput = this.querySelector('#title');
    this.bodyInput = this.querySelector('#body');
    this.submitBtn = this.querySelector('#submit-btn');
    this.errorMessage = this.querySelector('#form-error');

    this.titleInput.addEventListener('input', this._validateForm.bind(this));
    this.bodyInput.addEventListener('input', this._validateForm.bind(this));
    this.form.addEventListener('submit', this._onSubmit.bind(this));
  }

  _validateForm() {
    const isTitleValid = this.titleInput.value.trim() !== '';
    const isBodyValid = this.bodyInput.value.trim() !== '';

    this.submitBtn.disabled = !(isTitleValid && isBodyValid);

    this.errorMessage.textContent = '';
    if (!isTitleValid && !isBodyValid) {
      this.errorMessage.textContent = 'Title and Content are required';
    } else if (!isTitleValid) {
      this.errorMessage.textContent = 'Title is required';
    } else if (!isBodyValid) {
      this.errorMessage.textContent = 'Content is required';
    }
  }

  _onSubmit(event) {
    event.preventDefault();

    const noteData = {
      title: this.titleInput.value.trim(),
      body: this.bodyInput.value.trim(),
    };

    this.dispatchEvent(
      new CustomEvent('add-note', {
        detail: noteData,
        bubbles: true,
      }),
    );

    this.form.reset();
    this.submitBtn.disabled = true;
  }
}

customElements.define('note-form', NoteForm);
