import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
//allows you to have split pane that can both be adjusted
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(
      //initializing state by accessing localStorage, parsing the string value pulled in by localStorage
      //parenthesis and arrow creates lazy state initialization so it only reaches into localStorage the first time the app loads
      () => JSON.parse(localStorage.getItem("notes")) || []
    )

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    //create side effect to run every time notes changes
    React.useEffect(() => {
      //connect to localStorage api
      localStorage.setItem("notes", JSON.stringify(notes))
      //make the note label be the first text in the note
      console.log(notes[0].body.split("\n"))
    }, [notes])

    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
      //arranging most recently modified note to be at top
        setNotes(oldNotes => {
          //create a new empty array
          const newArray = []
          //loop over original array
          for(let i=0; i< oldNotes.length; i++){
            const oldNote = oldNotes[i]
            //if the id matches put the updated note at beg of array
            if(oldNote.id === currentNoteId){
              newArray.unshift({...oldNote, body: text})
            } else {
              newArray.push(oldNote)
            }
          }
          return newArray
        })
        //this does not rearrange the notes properly
      //   setNotes(oldNotes => oldNotes.map(oldNote => {
      //     return oldNote.id === currentNoteId
      //         ? { ...oldNote, body: text }
      //         : oldNote
      // }))
    }

    function deleteNote(event, noteId){
      //when the trash icon handles click event, stop propagating that event to the parent div (sidebar)
      event.stopPropagation()
      //need access to old array so using cb function as parameter
      //filter to check if the noteId is equal to the deleted one and not include it in the array
      setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
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
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
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
