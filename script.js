// Select the toggle button and its icon
const toggleDarkMode = document.getElementById("toggle-dark-mode");
const iconSpan = toggleDarkMode.querySelector(".icon");

// Add an event listener for toggling dark mode
toggleDarkMode.addEventListener("click", () => {
  // Toggle the dark mode class on the body
  document.body.classList.toggle("dark-mode");

  // Change the icon and button text based on the current mode
  if (document.body.classList.contains("dark-mode")) {
    iconSpan.textContent = "🌙"; // Set to moon icon
    toggleDarkMode.innerHTML = `<span class="icon">🌙</span> Light Mode`;
  } else {
    iconSpan.textContent = "☀️"; // Set to sun icon
    toggleDarkMode.innerHTML = `<span class="icon">☀️</span> Dark Mode`;
  }
});

// Sample flash notes data
let flashNotes = JSON.parse(localStorage.getItem('flashNotes')) || [
  { id: 'note-1', title: 'Note 1', content: 'Content for flash note 1', isEditing: false },
  { id: 'note-2', title: 'Note 2', content: 'Content for flash note 2', isEditing: false },
  { id: 'note-3', title: 'Note 3', content: 'Content for flash note 3', isEditing: false }
];

// Function to display all flash notes
function displayFlashNotes(notes) {
  const notesContainer = document.getElementById('notes-container');
  notesContainer.innerHTML = ''; // Clear previous content

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('flash-note');
    noteElement.id = note.id;

    if (note.isEditing) {
      // Display in edit mode
      noteElement.innerHTML = `
        <div class="flash-note-header">
          <input type="text" value="${note.title}" class="note-title-input" oninput="updateNoteTitle('${note.id}', this.value)" />
          <div class="icon-container">
            <button onclick="saveEdit('${note.id}')" class="edit-btn">👌</button>
            <button onclick="cancelEdit('${note.id}')" class="edit-btn">❌</button>
          </div>
        </div>
        <textarea class="note-content-input" oninput="updateNoteContent('${note.id}', this.value)">${note.content}</textarea>
      `;
    } else {
      // Display in normal mode
      noteElement.innerHTML = `
        <div class="flash-note-header">
          <h2>${note.title}</h2>
          <div class="icon-container">
            <button onclick="editNote('${note.id}')" class="edit-btn">✏️</button>
            <button onclick="deleteNote('${note.id}')" class="delete-btn">🗑️</button>
          </div>
        </div>
        <p>${note.content}</p>
      `;
    }

    notesContainer.appendChild(noteElement);
  });
}

// Display flash notes on page load
displayFlashNotes(flashNotes);

// Create new flash note
document.getElementById('create-note').addEventListener('click', () => {
  const newNote = {
    id: `note-${Date.now()}`,
    title: 'New Note',
    content: '',
    isEditing: true
  };

  flashNotes.push(newNote);
  localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
  displayFlashNotes(flashNotes);
});

// Edit an existing flash note
function editNote(noteId) {
  const note = flashNotes.find(n => n.id === noteId);
  if (note) {
    note.isEditing = true;
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    displayFlashNotes(flashNotes);
  }
}

// Save an edited flash note
function saveEdit(noteId) {
  const note = flashNotes.find(n => n.id === noteId);
  if (note) {
    note.isEditing = false;
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    displayFlashNotes(flashNotes);
  }
}

// Cancel editing a flash note
function cancelEdit(noteId) {
  const note = flashNotes.find(n => n.id === noteId);
  if (note) {
    note.isEditing = false;
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    displayFlashNotes(flashNotes);
  }
}

// Update note title in edit mode
function updateNoteTitle(noteId, newTitle) {
  const note = flashNotes.find(n => n.id === noteId);
  if (note) {
    note.title = newTitle;
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
  }
}

// Update note content in edit mode
function updateNoteContent(noteId, newContent) {
  const note = flashNotes.find(n => n.id === noteId);
  if (note) {
    note.content = newContent;
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
  }
}

// Delete a flash note
function deleteNote(noteId) {
  flashNotes = flashNotes.filter(note => note.id !== noteId);
  localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
  displayFlashNotes(flashNotes);
}

function saveNote() {
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;

  if (title && content) {
      alert('Note saved successfully!');
      // You can extend this to save the note to local storage or a database
  } else {
      alert('Please enter both a title and content.');
  }
}
