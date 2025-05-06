import NotesAPI from '../data/notes-api.js';

class NotesApp {
  constructor() {
    // Wait for DOM to be loaded before accessing elements
    document.addEventListener('DOMContentLoaded', () => {
      this.notesContainer = document.querySelector('#notes-container');
      this.loadingIndicator = document.createElement('loading-indicator');
      this.showingArchived = false;

      // Fix: Insert loading indicator properly
      if (this.notesContainer && this.notesContainer.parentNode) {
        this.notesContainer.parentNode.insertBefore(
          this.loadingIndicator,
          this.notesContainer,
        );
      } else {
        console.error('Notes container not found or has no parent node');
        document.body.appendChild(this.loadingIndicator);
      }

      // Setup event listeners
      this.setupEventListeners();

      // Initialize the app
      this.initialize();
    });
  }

  setupEventListeners() {
    // Define these methods before binding them
    this.handleAddNote = this.handleAddNote || this._handleAddNote.bind(this);
    this.handleArchiveNote =
      this.handleArchiveNote || this._handleArchiveNote.bind(this);
    this.handleUnarchiveNote =
      this.handleUnarchiveNote || this._handleUnarchiveNote.bind(this);
    this.handleDeleteNote =
      this.handleDeleteNote || this._handleDeleteNote.bind(this);

    document.addEventListener('add-note', this.handleAddNote);
    document.addEventListener('archive-note', this.handleArchiveNote);
    document.addEventListener('unarchive-note', this.handleUnarchiveNote);
    document.addEventListener('delete-note', this.handleDeleteNote);

    // Navigation event listeners
    const showNotesBtn = document.querySelector('#show-notes');
    const showArchivedBtn = document.querySelector('#show-archived');

    if (showNotesBtn) {
      showNotesBtn.addEventListener('click', () => {
        this.showingArchived = false;
        this.loadNotes();
      });
    }

    if (showArchivedBtn) {
      showArchivedBtn.addEventListener('click', () => {
        this.showingArchived = true;
        this.loadNotes();
      });
    }
  }

  async initialize() {
    await this.loadNotes();
  }

  async loadNotes() {
    try {
      this.loadingIndicator.show();
      if (this.notesContainer) {
        this.notesContainer.innerHTML = '';
      }

      let notes;
      if (this.showingArchived) {
        notes = await NotesAPI.getArchivedNotes();
      } else {
        notes = await NotesAPI.getAllNotes();
      }

      this.renderNotes(notes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      this.showError('Failed to load notes. Please try again later.');
    } finally {
      this.loadingIndicator.hide();
    }
  }

  renderNotes(notes) {
    if (!this.notesContainer) return;

    this.notesContainer.innerHTML = '';

    if (notes.length === 0) {
      this.notesContainer.innerHTML = `
        <div class="empty-state">
          <p>No ${this.showingArchived ? 'archived' : ''} notes found</p>
        </div>
      `;
      return;
    }

    notes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.note = note;
      this.notesContainer.appendChild(noteElement);
    });
  }

  // Define the actual handler methods
  _handleAddNote(event) {
    this._addNote(event.detail).catch((error) => {
      console.error('Failed to add note:', error);
      this.showError('Failed to add note. Please try again.');
    });
  }

  async _addNote({ title, body }) {
    try {
      this.loadingIndicator.show();
      await NotesAPI.addNote({ title, body });
      await this.loadNotes();
    } finally {
      this.loadingIndicator.hide();
    }
  }

  _handleArchiveNote(event) {
    this._archiveNote(event.detail.id).catch((error) => {
      console.error('Failed to archive note:', error);
      this.showError('Failed to archive note. Please try again.');
    });
  }

  async _archiveNote(id) {
    try {
      this.loadingIndicator.show();
      await NotesAPI.archiveNote(id);
      await this.loadNotes();
    } finally {
      this.loadingIndicator.hide();
    }
  }

  _handleUnarchiveNote(event) {
    this._unarchiveNote(event.detail.id).catch((error) => {
      console.error('Failed to unarchive note:', error);
      this.showError('Failed to unarchive note. Please try again.');
    });
  }

  async _unarchiveNote(id) {
    try {
      this.loadingIndicator.show();
      await NotesAPI.unarchiveNote(id);
      await this.loadNotes();
    } finally {
      this.loadingIndicator.hide();
    }
  }

  _handleDeleteNote(event) {
    this._deleteNote(event.detail.id).catch((error) => {
      console.error('Failed to delete note:', error);
      this.showError('Failed to delete note. Please try again.');
    });
  }

  async _deleteNote(id) {
    try {
      this.loadingIndicator.show();
      if (confirm('Are you sure you want to delete this note?')) {
        await NotesAPI.deleteNote(id);
        await this.loadNotes();
      }
    } finally {
      this.loadingIndicator.hide();
    }
  }

  showError(message) {
    alert(message);
  }
}

// Initialize the app
const app = new NotesApp();

export default NotesApp;
