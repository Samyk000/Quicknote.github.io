/**
 * Copyright [2024] [Sameer Khan]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Initialize GoTrue client
const auth = new GoTrue({
    APIUrl: 'https://your-real-site-name.netlify.app/.netlify/identity', // Replace with your actual site URL
    audience: '',
    setCookie: false,
  });
  
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
      iconSpan.textContent = document.body.classList.contains("dark-mode") ? "🔆" : "🌙";
      localStorage.setItem('darkMode', document.body.classList.contains("dark-mode"));
  });
  
  // Modal Logic
  const loginModal = document.getElementById("login-modal");
  const closeModal = document.getElementById("close-modal");
  
  // Open the modal
  document.getElementById("open-login-modal").addEventListener("click", () => {
      loginModal.style.display = "block";
  });
  
  // Close the modal
  closeModal.addEventListener("click", () => {
      loginModal.style.display = "none";
  });
  
  // Close the modal when clicking outside of it
  window.addEventListener("click", (event) => {
      if (event.target === loginModal) {
          loginModal.style.display = "none";
      }
  });
  
  // Event listeners for login, signup, and reset password
  document.getElementById("login-button").addEventListener("click", (e) => {
      e.preventDefault();
      login();
  });
  
  document.getElementById("sign-up-button").addEventListener("click", (e) => {
      e.preventDefault();
      signUp();
  });
  
  document.getElementById("reset-password-link").addEventListener("click", (e) => {
      e.preventDefault();
      resetPassword();
  });
  
  // Function to handle login
  function login() {
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      if (email && password) {
          auth.login(email, password)
              .then(response => {
                  console.log('User logged in', response);
                  showToast("Successfully logged in!");
                  loginModal.style.display = "none"; // Close the modal
                  // Update UI or redirect
              })
              .catch(error => {
                  console.error('Failed to login', error);
                  showToast("Login failed. Please check your credentials.");
              });
      } else {
          showToast("Please enter both email and password.");
      }
  }
  
  // Function to handle signup
  function signUp() {
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      if (email && password) {
          auth.signup(email, password)
              .then(response => {
                  console.log('User signed up', response);
                  showToast("Successfully signed up! Please check your email to confirm.");
                  // Optionally close the modal or redirect
              })
              .catch(error => {
                  console.error('Failed to sign up', error);
                  showToast("Sign up failed. Please try again.");
              });
      } else {
          showToast("Please enter both email and password.");
      }
  }
  
  // Function to handle password recovery
  function resetPassword() {
      const email = document.getElementById("username").value;
  
      if (email) {
          auth.requestPasswordRecovery(email)
              .then(() => {
                  showToast("Password reset email sent!");
                  // Optionally close the modal
              })
              .catch(error => {
                  console.error('Failed to reset password', error);
                  showToast("Password reset failed. Please try again.");
              });
      } else {
          showToast("Please enter your email address.");
      }
  }
  
  // Function to show toast notification
  function showToast(message) {
      const toastContainer = document.querySelector('.toast-container') || createToastContainer();
      const toast = document.createElement('div');
      toast.className = `toast ${document.body.classList.contains('dark-mode') ? '' : 'light-mode'}`;
      toast.innerHTML = `<span>${message}</span>`;
      
      toastContainer.appendChild(toast);
  
      setTimeout(() => {
          toast.remove();
      }, 5000);
  }
  
  // Create toast container if it doesn't exist
  function createToastContainer() {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
      return container;
  }
  
  // Sample flash notes data with categories
  let flashNotes = JSON.parse(localStorage.getItem('flashNotes')) || [
      { id: 'note-1', title: 'Note 1', content: 'Content for flash note 1', category: 'work', isEditing: false, updatedAt: new Date().toISOString(), isPinned: false },
      { id: 'note-2', title: 'Note 2', content: 'Content for flash note 2', category: 'personal', isEditing: false, updatedAt: new Date().toISOString(), isPinned: false },
      { id: 'note-3', title: 'Note 3', content: 'Content for flash note 3', category: 'ideas', isEditing: false, updatedAt: new Date().toISOString(), isPinned: false }
  ];
  
  // Function to format date
  function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  // Function to apply formatting to note content
  function formatText(text) {
      return text
          .replace(/\*(.*?)\*/g, '<span class="bold">$1</span>')      // Bold
          .replace(/_(.*?)_/g, '<span class="italic">$1</span>')      // Italic
          .replace(/~(.*?)~/g, '<span class="strike">$1</span>');     // Strikethrough
  }
  
  // Array of tips
  const tips = [
      "💡 *Use asterisks* for bold.",
      "💡 _Use underscores_ for italics.",
      "💡 ~Use tildes~ for strikethrough.",
      "💡 Toggle the moon icon for dark mode.",
      "💡 Use category buttons to filter your notes.",
      "💡 Use the search bar to quickly find notes."
  ];
  
  // Function to get a random tip
  function getRandomTip() {
      const randomIndex = Math.floor(Math.random() * tips.length);
      return tips[randomIndex];
  }
  
  // Display all flash notes with formatting
  function displayFlashNotes(notes) {
      const notesContainer = document.getElementById('notes-container');
      notesContainer.innerHTML = ''; // Clear previous content
  
      // Ensure new notes are displayed at the top
      notes.sort((a, b) => {
          if (a.isEditing && a.isNew) return -1;
          if (b.isEditing && b.isNew) return 1;
          return b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  
      notes.forEach(note => {
          const noteElement = document.createElement('div');
          noteElement.classList.add('flash-note');
          noteElement.id = note.id;
          noteElement.setAttribute('data-category', note.category);
  
          if (note.isEditing) {
              // Display in edit mode
              noteElement.innerHTML = `
                  <input type="text" value="${note.title}" class="note-title-input" oninput="updateNoteTitle('${note.id}', this.value)" placeholder="Title" required />
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
                  <textarea class="note-content-input" onfocus="removePlaceholder(this)" onblur="addPlaceholder(this)" placeholder="${getRandomTip()}">${note.content}</textarea>
                  <span class="last-updated">Last updated: ${formatDate(note.updatedAt)}</span>
              `;
          } else {
              // Display in normal mode with formatted content
              const formattedContent = formatText(note.content);
              noteElement.innerHTML = `
                  <div class="flash-note-header">
                      <h2>${note.title}</h2>
                      <span class="note-category">${note.category.charAt(0).toUpperCase() + note.category.slice(1)}</span>
                      <div class="icon-container">
                          <button onclick="pinNote('${note.id}')" class="pin-btn ${note.isPinned ? 'pinned' : ''}"><i class="fas fa-thumbtack"></i></button>
                          <button onclick="editNote('${note.id}')" class="edit-btn"><i class="fas fa-edit"></i></button>
                          <button onclick="deleteNoteWithEffect('${note.id}')" class="delete-btn"><i class="fas fa-trash"></i></button>
                      </div>
                  </div>
                  <p style="white-space: pre-wrap;">${formattedContent}</p>
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
          category: '',
          isEditing: true,
          isNew: true,
          isPinned: false,
          updatedAt: new Date().toISOString()
      };
  
      flashNotes.unshift(newNote);
      displayFlashNotes(flashNotes);
  });
  
  // Edit an existing flash note
  function editNote(noteId) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          note.isEditing = true;
          displayFlashNotes(flashNotes);
      }
  }
  
  // Pin or unpin a note
  function pinNote(noteId) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          note.isPinned = !note.isPinned;
          const noteElement = document.getElementById(noteId);
          const pinButton = noteElement.querySelector('.pin-btn');
  
          if (note.isPinned) {
              pinButton.classList.add('pinned');
          } else {
              pinButton.classList.remove('pinned');
          }
  
          localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
          displayFlashNotes(flashNotes);
          showToast(note.isPinned ? '📌 Note Pinned' : '📌 Note Unpinned');
      }
  }
  
  // Save an edited or newly created flash note
  function saveEdit(noteId) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          const noteElement = document.getElementById(noteId);
          const titleInput = noteElement.querySelector('.note-title-input');
          const contentInput = noteElement.querySelector('.note-content-input');
          const categorySelect = noteElement.querySelector('.note-category-select');
  
          note.title = titleInput.value.trim();
          note.content = contentInput.value.trim();
          note.category = categorySelect.value;
          note.isEditing = false;
          note.isNew = false;
          note.updatedAt = new Date().toISOString();
  
          localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
          displayFlashNotes(flashNotes);
          showToast('✏️ Note Updated');
      }
  }
  
  // Cancel editing a flash note
  function cancelEdit(noteId) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          note.isEditing = false;
          displayFlashNotes(flashNotes);
      }
  }
  
  // Update note title in edit mode
  function updateNoteTitle(noteId, newTitle) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          note.title = newTitle.trim();
      }
  }
  
  // Update note category in edit mode
  function updateNoteCategory(noteId, newCategory) {
      const note = flashNotes.find(n => n.id === noteId);
      if (note) {
          note.category = newCategory;
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
          showToast('❌ Note Deleted');
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
  
  // Placeholder management functions
  function removePlaceholder(element) {
      element.placeholder = '';
  }
  
  function addPlaceholder(element) {
      if (!element.value) {
          element.placeholder = getRandomTip();
      }
  }
