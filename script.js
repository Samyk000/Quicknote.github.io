// Select the toggle button and its icon
const toggleDarkMode = document.getElementById("toggle-dark-mode");
const iconSpan = toggleDarkMode.querySelector(".icon");

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    toggleDarkMode.innerHTML = '<span class="icon">🔆</span>';
}

// Add an event listener for toggling dark mode
toggleDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        iconSpan.textContent = "";
        toggleDarkMode.innerHTML = `<span class="icon">🔆</span>`;
        localStorage.setItem('darkMode', 'true');
    } else {
        iconSpan.textContent = "";
        toggleDarkMode.innerHTML = `<span class="icon">🌘</span>`;
        localStorage.setItem('darkMode', 'false');
    }
});

// Sample flash notes data with categories
let flashNotes = JSON.parse(localStorage.getItem('flashNotes')) || [
    { id: 'note-1', title: 'Note 1', content: 'Content for flash note 1', category: 'work', isEditing: false, updatedAt: new Date().toISOString() },
    { id: 'note-2', title: 'Note 2', content: 'Content for flash note 2', category: 'personal', isEditing: false, updatedAt: new Date().toISOString() },
    { id: 'note-3', title: 'Note 3', content: 'Content for flash note 3', category: 'ideas', isEditing: false, updatedAt: new Date().toISOString() }
];

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to display all flash notes
function displayFlashNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; // Clear previous content

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('flash-note');
        noteElement.id = note.id;
        noteElement.setAttribute('data-category', note.category);

        if (note.isEditing) {
            // Display in edit mode
            noteElement.innerHTML = `
                <div class="flash-note-header">
                  <input type="text" value="${note.title}" class="note-title-input" oninput="updateNoteTitle('${note.id}', this.value)" placeholder="Title" />
                  <select class="note-category-select" onchange="updateNoteCategory('${note.id}', this.value)">
                      <option value="" disabled ${!note.category ? 'selected' : ''}>Category</option>
                      <option value="work" ${note.category === 'work' ? 'selected' : ''}>Work</option>
                      <option value="personal" ${note.category === 'personal' ? 'selected' : ''}>Personal</option>
                      <option value="ideas" ${note.category === 'ideas' ? 'selected' : ''}>Ideas</option>
                      <option value="others" ${note.category === 'others' ? 'selected' : ''}>Others</option>
                  </select>
                  <div class="icon-container">
                    <button onclick="saveEdit('${note.id}')" class="edit-btn"><i class="fas fa-save"></i></button>
                    <button onclick="cancelEdit('${note.id}')" class="edit-btn"><i class="fas fa-times"></i></button>
                  </div>
                </div>
                <textarea class="note-content-input" oninput="updateNoteContent('${note.id}', this.value)" placeholder="Content">${note.content}</textarea>
                <span class="last-updated">Last updated: ${formatDate(note.updatedAt)}</span>
            `;
        } else {
            // Display in normal mode
            noteElement.innerHTML = `
                <div class="flash-note-header">
                  <h2>${note.title}</h2>
                  <span class="note-category">${note.category.charAt(0).toUpperCase() + note.category.slice(1)}</span>
                  <div class="icon-container">
                    <button onclick="editNote('${note.id}')" class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteNoteWithEffect('${note.id}')" class="delete-btn"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <p>${note.content}</p>
                <span class="last-updated">Last updated: ${formatDate(note.updatedAt)}</span>
            `;
        }

        notesContainer.appendChild(noteElement);
    });
}

// Display flash notes on page load
displayFlashNotes(flashNotes);

// Create new flash note with default category as empty
document.getElementById('create-note').addEventListener('click', () => {
    const newNote = {
        id: `note-${Date.now()}`,
        title: 'Title',
        content: '',
        category: '', // Default category as empty
        isEditing: true,
        updatedAt: new Date().toISOString()
    };

    flashNotes.unshift(newNote); // Add to the beginning of the array
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
        note.updatedAt = new Date().toISOString();  // Update the timestamp
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
        note.updatedAt = new Date().toISOString();  // Update the timestamp
        localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    }
}

// Update note category in edit mode
function updateNoteCategory(noteId, newCategory) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.category = newCategory; // Update category
        localStorage.setItem('flashNotes', JSON.stringify(flashNotes)); // Save changes
    }
}

// Delete a flash note
function deleteNote(noteId) {
    flashNotes = flashNotes.filter(note => note.id !== noteId);
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    displayFlashNotes(flashNotes);
}

// Delete with shake effect
function deleteNoteWithEffect(noteId) {
    const noteElement = document.getElementById(noteId);
    noteElement.classList.add('shake');
    setTimeout(() => {
        deleteNote(noteId);
    }, 300);
}

// Search notes
function searchNotes() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const notes = document.querySelectorAll('.flash-note');
    
    notes.forEach(note => {
        const title = note.querySelector('h2').textContent.toLowerCase();
        const content = note.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || content.includes(query)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}

// Function to filter notes by category
function filterByCategory(category) {
    const notes = document.querySelectorAll('.flash-note');
    notes.forEach(note => {
        const noteCategory = note.getAttribute('data-category');
        if (category === 'all' || noteCategory === category) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
}
