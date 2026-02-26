console.log("Notes app script loaded");

/**
 * Notes App - JavaScript
 * 
 * This file contains the script for the "Notes App" project.
 * It handles the functionality for creating, displaying and saving notes.
 */

// TODO: Make a note object to simplify interacting with it.
class Note {
    constructor(id, content, date) {
        this.id = id;
        this.content = content;
        this.date = date;
    }
}

function renderNote(note) {
    // Note base
    const list = document.getElementById("notes-list");
    const listItem = document.createElement("li");
    listItem.classList.add("note-item");
    listItem.dataset.id = note.id;

    // Control panel
    const controlPanel = document.createElement("div");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.addEventListener("click", function() {
        deleteNote(note.id);
    });
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-primary");
    editButton.addEventListener("click", function() {
        editNote(note.id);
    });
    listItem.appendChild(controlPanel);
    controlPanel.appendChild(deleteButton);
    controlPanel.appendChild(editButton);

    // Text content
    const text = document.createElement("p");
    text.textContent = note.content;
    listItem.appendChild(text);

    // Append to the document
    list.appendChild(listItem);
    console.log("[Render]: Note rendered with ID: " + note.id);
}

function loadNotes() {
    if (!localStorage.getItem("notes")) {
        // There is no notes to load
        console.log("[Loading]: No notes found in local storage.");
    } else {
        // There is notes to load
        console.log("[Loading]: Notes to load found in local storage.");

        // Load the notes
        const notes = JSON.parse(localStorage.getItem("notes"));
        notes.forEach(note => renderNote(note));
    }
}

function saveNote(text) {
    if (!localStorage.getItem("notes")) {
        // There is no notes
        console.log("[Saving]: Saving first note to local storage.");
        const note = new Note(1, text, new Date().toISOString());
        localStorage.setItem("notes", JSON.stringify([note]));

        // Start counting notes
        localStorage.setItem("noteCount", 1);

        // Render the new note
        renderNote(note);
    } else {
        // There is notes
        console.log("[Saving]: Saving additional note to local storage.");

        // Get note count
        let noteCount = localStorage.getItem("noteCount");
        noteCount = parseInt(noteCount) + 1;

        // Create a new Note
        const note = new Note(noteCount, text, new Date().toISOString());
        const notes = JSON.parse(localStorage.getItem("notes"));
        notes.push(note);

        // Save to local storage
        localStorage.setItem("notes", JSON.stringify(notes));
        localStorage.setItem("noteCount", noteCount);

        // Render the new note
        renderNote(note);
    }
}

function deleteNote(id) {
    if (localStorage.getItem("notes")) {
        // Local storage found
        const notes = JSON.parse(localStorage.getItem("notes"));

        // Find the note with the correct id
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
            // Remove the note from the array
            notes.splice(noteIndex, 1);

            // Update to local storage
            localStorage.setItem("notes", JSON.stringify(notes));

            // Remove the note from the DOM
            const noteElement = document.querySelector(`.note-item[data-id="${id}"]`);
            if (noteElement) {
                noteElement.remove();
            }
            console.log("[Delete]: Note with ID " + id + " deleted.");
        }
    }
}

function editNote(id) {
    const note = document.querySelector(`.note-item[data-id="${id}"]`);
    if (note) {
        // Get the note data
        const notes = JSON.parse(localStorage.getItem("notes"));
        const noteData = notes.find(note => note.id === id);

        // Base form
        const form = document.createElement("form");
        form.classList.add("notes-form");
        note.replaceWith(form);

        // Text area
        const textarea = document.createElement("textarea");
        textarea.textContent = noteData.content;
        textarea.classList.add("notes-input");
        form.appendChild(textarea);

        // Control panel
        const controlPanel = document.createElement("div");
        const submitButton = document.createElement("button");
        const cancelButton = document.createElement("button");
        submitButton.textContent = "Update";
        submitButton.classList.add("btn", "btn-primary");
        submitButton.addEventListener("click", function(event) {
            // Submit and update
            event.preventDefault();
            const updatedText = textarea.value.trim();
            if (updatedText !== "" && updatedText !== noteData.content) {
                // Changes made, save the content
                noteData.content = updatedText;
                localStorage.setItem("notes", JSON.stringify(notes));
                form.replaceWith(note);
                
                // Update text in note to reflect changes
                note.querySelector("p").textContent = updatedText;
            } else if (updatedText !== "" && updatedText === noteData.content) {
                // No changes made
                console.log("[Edit]: No changes made for note with ID " + id + ", reverting to original note.");
                form.replaceWith(note);
            }
        })
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("btn", "btn-secondary");
        cancelButton.addEventListener("click", function(event) {
            // Revert changes
            event.preventDefault();
            form.replaceWith(note);
        })

        controlPanel.appendChild(submitButton);
        controlPanel.appendChild(cancelButton);

        form.appendChild(controlPanel);
        console.log("[Edit]: Note with ID " + id + " opened for editing.");
    } else {
        console.error("[Edit]: Note with ID " + id + " not found.");
    }
}

// Initialize the app
window.onload = function() {
    // Load notes from local storage
    loadNotes();

    // Add the submit event listener
    document.getElementById("notes-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const notesInput = document.getElementById("notes-input");
        const noteText = notesInput.value.trim();
        if (noteText !== "") {
            saveNote(noteText);
            notesInput.value = "";
        };
    });
}