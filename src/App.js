import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
//allows you to have split pane that can both be adjusted
import Split from "react-split"
import {nanoid} from "nanoid"
import {onSnapshot, addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote = 
      notes.find(note => note.id === currentNoteId) 
      || notes[0]

    //sort method to take two items and compare them
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    //create side effect to run every time notes changes
    React.useEffect(() => {
      //takes 2 parameters: collection we want to listen for changes to and cb function that gets called when there is a change
      const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
        //sync up our local notes array with the snapshot data
        const notesArr = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }))
        setNotes(notesArr)
      })
      return unsubscribe
    }, [])

    React.useEffect(() => {
      if(!currentNoteId) {
        setCurrentNoteId(notes[0]?.id)
      }
    },[notes])
    
    //use effect to run anytime current note changes
    React.useEffect(() => {
      if(currentNote){
        setTempNoteText(currentNote.body)
      }
    }, [currentNote])

    //useEffect to delay the sending of the request to firebase
    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        if(tempNoteText != currentNote.body){
          updateNote(tempNoteText)
        }
      }, 500)
      return () => clearTimeout(timeoutId)
    }, [tempNoteText])
    

    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
      const docRef = doc(db, "notes", currentNoteId)
      await setDoc(
        docRef, 
        {body: text, updatedAt: Date.now()}, 
        { merge: true })
    }

    async function deleteNote(noteId){
      const docRef = doc(db, "notes", noteId)
      await deleteDoc(docRef)
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                    <Editor 
                        tempNoteText={tempNoteText} 
                        setTempNoteText={setTempNoteText} 
                    />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
