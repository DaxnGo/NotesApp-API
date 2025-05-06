class NoteItem extends HTMLElement {
  set note(note) {
    this._note = note;
    this.render();
  }

  render() {
    this.innerHTML = `
      <article>
        <h2>${this._note.title}</h2>
        <p>${this._note.body}</p>
        <small>Created: ${new Date(this._note.createdAt).toLocaleDateString()}</small>
        <div class="note-actions">
          ${
            this._note.archived
              ? '<button class="unarchive-btn" data-id="' +
                this._note.id +
                '">Unarchive</button>'
              : '<button class="archive-btn" data-id="' +
                this._note.id +
                '">Archive</button>'
          }
          <button class="delete-btn" data-id="${this._note.id}">Delete</button>
        </div>
      </article>
    `;

    const archiveBtn = this.querySelector('.archive-btn');
    if (archiveBtn) {
      archiveBtn.addEventListener('click', this._onArchive.bind(this));
    }

    const unarchiveBtn = this.querySelector('.unarchive-btn');
    if (unarchiveBtn) {
      unarchiveBtn.addEventListener('click', this._onUnarchive.bind(this));
    }

    const deleteBtn = this.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this._onDelete.bind(this));
    }
  }

  _onArchive(event) {
    this.dispatchEvent(
      new CustomEvent('archive-note', {
        detail: {
          id: event.target.dataset.id,
        },
        bubbles: true,
      }),
    );
  }

  _onUnarchive(event) {
    this.dispatchEvent(
      new CustomEvent('unarchive-note', {
        detail: {
          id: event.target.dataset.id,
        },
        bubbles: true,
      }),
    );
  }

  _onDelete(event) {
    this.dispatchEvent(
      new CustomEvent('delete-note', {
        detail: {
          id: event.target.dataset.id,
        },
        bubbles: true,
      }),
    );
  }
}

customElements.define('note-item', NoteItem);
