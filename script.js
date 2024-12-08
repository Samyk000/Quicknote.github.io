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

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEveTkDs4XE9xmUUFNp5ipdjr-UxMLCa0",
    authDomain: "quiknotes-cd28b.firebaseapp.com",
    projectId: "quiknotes-cd28b",
    storageBucket: "quiknotes-cd28b.appspot.com",
    messagingSenderId: "80075452780",
    appId: "1:80075452780:web:5cb27e1f5fffda0e66c349",
    measurementId: "G-N8DN28CELL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication

// Initialize flashNotes
let flashNotes = JSON.parse(localStorage.getItem('flashNotes')) || [];

// DOM elements
const toggleDarkMode = document.getElementById("toggle-dark-mode");
const loginModal = document.getElementById("login-modal");
const closeModal = document.getElementById("close-modal");
const profileContainer = document.getElementById("profile-container");
const loginButton = document.getElementById("open-login-modal");
const resetPasswordButton = document.getElementById("reset-password-button");

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    toggleDarkMode.innerHTML = '<span class="icon">🔆</span>';
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
            updateUIOnLogin();
            loadNotesFromFirestore(); // Load notes from Firestore if logged in
            if (!user.emailVerified) {
                verifyEmail(user); // Send email verification if not verified
            }
        } else {
            console.log("No user is logged in.");
            updateUIOnLogout();
            loadNotesFromLocalStorage(); // Load notes from local storage if not logged in
        }
    });
});

// Event listeners
toggleDarkMode?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleDarkMode.innerHTML = document.body.classList.contains("dark-mode") ? '<span class="icon">🔆</span>' : '<span class="icon">🌙</span>';
    localStorage.setItem('darkMode', document.body.classList.contains("dark-mode"));
});

loginButton?.addEventListener("click", handleLoginLogout);
closeModal?.addEventListener("click", () => loginModal.style.display = "none");
window.addEventListener("click", (event) => {
    if (event.target === loginModal) loginModal.style.display = "none";
});

resetPasswordButton?.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("username")?.value;
    if (email) {
        sendResetEmail(email);
    } else {
        showToast("Please enter your email address.");
    }
});

// Handle login/logout button click
function handleLoginLogout() {
    if (auth.currentUser) {
        logout();
    } else {
        loginModal.style.display = "block";
    }
}

document.getElementById("login-button")?.addEventListener("click", (e) => {
    e.preventDefault();
    login();
});

document.getElementById("sign-up-button")?.addEventListener("click", (e) => {
    e.preventDefault();
    signUp();
});

// Login function
function login() {
    const email = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in', user.uid);
                showToast("Successfully logged in!");
                loginModal.style.display = "none";
                updateUIOnLogin();
                loadNotesFromFirestore(); // Load notes from Firestore on login
            })
            .catch((error) => {
                console.error('Failed to login', error);
                showToast("Login failed. Please check your credentials.");
            });
    } else {
        showToast("Please enter both email and password.");
    }
}

// Signup function
function signUp() {
    const email = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    if (email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed up', user.uid);
                showToast("Successfully signed up!");
                verifyEmail(user); // Send verification email after signup
            })
            .catch((error) => {
                console.error('Failed to sign up', error);
                showToast("Sign up failed. Please try again.");
            });
    } else {
        showToast("Please enter both email and password.");
    }
}

// Logout function
function logout() {
    signOut(auth)
        .then(() => {
            showToast("Logged out successfully!");
            updateUIOnLogout();
            loadNotesFromLocalStorage(); // Load notes from local storage on logout
        })
        .catch((error) => console.error('Failed to logout', error));
}

// Function to send a password reset email
function sendResetEmail(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent!");
            showToast("Password reset email sent!");
        })
        .catch((error) => {
            console.error("Error sending password reset email:", error);
            showToast("Error sending password reset. Please try again.");
        });
}

// Function to send an email verification
function verifyEmail(user) {
    sendEmailVerification(user)
        .then(() => {
            console.log("Verification email sent.");
            showToast("Verification email sent.");
        })
        .catch((error) => {
            console.error("Error sending verification email:", error);
            if (error.code === 'auth/too-many-requests') {
                showToast("Too many requests. Please try again later.");
            } else {
                showToast("Error sending verification email. Please try again.");
            }
        });
}

// Update UI on login
function updateUIOnLogin() {
    profileContainer.style.display = "inline-block";
    loginButton.textContent = "Logout";
}

// Update UI on logout
function updateUIOnLogout() {
    profileContainer.style.display = "none";
    loginButton.textContent = "Login";
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

// Load notes from local storage
function loadNotesFromLocalStorage() {
    flashNotes = JSON.parse(localStorage.getItem('flashNotes')) || [];
    displayFlashNotes(flashNotes);
}

// Load notes from Firestore
async function loadNotesFromFirestore() {
    const user = auth.currentUser;
    if (user) {
        const notesRef = collection(db, `users/${user.uid}/notes`);
        const notesSnapshot = await getDocs(notesRef);
        flashNotes = [];
        notesSnapshot.forEach(doc => {
            let note = doc.data();
            note.id = doc.id; // Use Firestore document ID
            flashNotes.push(note);
        });
        displayFlashNotes(flashNotes);
    }
}

// Save a flash note
async function saveNoteToFirestore(note) {
    const user = auth.currentUser;
    if (user) {
        const notesRef = collection(db, `users/${user.uid}/notes`);
        const noteDoc = doc(notesRef, note.id);

        try {
            await (note.id ? updateDoc(noteDoc, note) : addDoc(notesRef, note));
            console.log('Note saved successfully!');
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }
}

// Delete a flash note
async function deleteNoteFromFirestore(noteId) {
    const user = auth.currentUser;
    if (user) {
        const noteDoc = doc(db, `users/${user.uid}/notes/${noteId}`);
        try {
            await deleteDoc(noteDoc);
            console.log('Note deleted successfully!');
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
}

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

    // Sort notes to ensure new notes are displayed at the top and saved notes after pinned ones
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
                <div class="icon-container" style="display: flex; justify-content: flex-end; margin-top: 1em;">
                    <button onclick="saveEdit('${note.id}')" class="btn"><i class="fas fa-save"></i> </button>
                    <button onclick="cancelEdit('${note.id}')" class="btn"><i class="fas fa-times"></i> </button>
                </div>
                <textarea class="note-content-input" onfocus="removePlaceholder(this)" onblur="addPlaceholder(this)" placeholder="${getRandomTip()}">${note.content}</textarea>
                <span class="last-updated">Last updated:<br>${formatDate(note.updatedAt)}</span>
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
                <span class="last-updated">Last updated:<br>${formatDate(note.updatedAt)}</span>
            `;
        }
        notesContainer.appendChild(noteElement);
    });
}

// Create new flash note with default category as empty
document.getElementById('create-note')?.addEventListener('click', () => {
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

    flashNotes.unshift(newNote); // Add new note to the top of the array
    displayFlashNotes(flashNotes); // Refresh the display
    saveNoteToFirestore(newNote); // Save the new note to Firestore
});

// Edit an existing flash note
window.editNote = function(noteId) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.isEditing = true;
        displayFlashNotes(flashNotes);
    }
};

// Pin or unpin a note
window.pinNote = function(noteId) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.isPinned = !note.isPinned; // Toggle the pinned state
        const noteElement = document.getElementById(noteId);
        const pinButton = noteElement.querySelector('.pin-btn');

        if (note.isPinned) {
            pinButton.classList.add('pinned');
        } else {
            pinButton.classList.remove('pinned');
        }

        saveNoteToFirestore(note); // Save the updated note to Firestore
        localStorage.setItem('flashNotes', JSON.stringify(flashNotes)); // Save the updated notes locally
        displayFlashNotes(flashNotes); // Refresh the notes display
        showToast(note.isPinned ? '📌 Note Pinned' : '📌 Note Unpinned');
    }
};

// Save an edited or newly created flash note
window.saveEdit = function(noteId) {
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
        note.isNew = false; // Set isNew to false after saving
        note.updatedAt = new Date().toISOString();

        // Move the note after pinned notes if it is not pinned
        if (!note.isPinned) {
            flashNotes = flashNotes.filter(n => n.id !== noteId); // Remove from current position
            const pinnedNotes = flashNotes.filter(n => n.isPinned); // Get all pinned notes
            const unpinnedNotes = flashNotes.filter(n => !n.isPinned); // Get unpinned notes

            // Combine pinned notes with the newly saved note and the rest
            flashNotes = [...pinnedNotes, note, ...unpinnedNotes];
        }

        saveNoteToFirestore(note); // Save the updated note to Firestore
        localStorage.setItem('flashNotes', JSON.stringify(flashNotes)); // Save the updated notes locally
        displayFlashNotes(flashNotes); // Refresh the notes display
        showToast('✏️ Note Updated');
    }
};

// Cancel editing a flash note
window.cancelEdit = function(noteId) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.isEditing = false;
        displayFlashNotes(flashNotes);
    }
};

// Update note title in edit mode
window.updateNoteTitle = function(noteId, newTitle) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.title = newTitle.trim();
    }
};

// Update note category in edit mode
window.updateNoteCategory = function(noteId, newCategory) {
    const note = flashNotes.find(n => n.id === noteId);
    if (note) {
        note.category = newCategory;
    }
};

// Delete a flash note
window.deleteNote = function(noteId) {
    flashNotes = flashNotes.filter(note => note.id !== noteId);
    deleteNoteFromFirestore(noteId); // Delete from Firestore
    localStorage.setItem('flashNotes', JSON.stringify(flashNotes));
    displayFlashNotes(flashNotes);
};

// Delete with shake effect
window.deleteNoteWithEffect = function(noteId) {
    const noteElement = document.getElementById(noteId);
    noteElement.classList.add('shake');
    setTimeout(() => {
        deleteNote(noteId);
        showToast('❌ Note Deleted');
    }, 300);
};

// Search notes
window.searchNotes = function() {
    const query = document.getElementById('search-input')?.value.toLowerCase();
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
};

// Function to filter notes by category
window.filterByCategory = function(category) {
    const notes = document.querySelectorAll('.flash-note');
    notes.forEach(note => {
        const noteCategory = note.getAttribute('data-category');
        if (category === 'all' || noteCategory === category) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
};

// Placeholder management functions
window.removePlaceholder = function(element) {
    element.placeholder = '';
};

window.addPlaceholder = function(element) {
    if (!element.value) {
        element.placeholder = getRandomTip();
    }
};

// Display flash notes on page load
displayFlashNotes(flashNotes);
