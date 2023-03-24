import NavBar from './NavBar'
import { useState, useEffect } from 'react';

  
  
const Speech = (props) =>{
    const [text, setText] = useState(props.data.Questions);
    const utterance = new SpeechSynthesisUtterance()
    useEffect( () => {
        utterance.voice = window.speechSynthesis.getVoices().find((v) => v.name === "Microsoft Sonia Online (Natural) - English (United Kingdom)")
    }, [])


      async function handleSpeech() {
        utterance.text = props.data.Questions;
        utterance.voice = window.speechSynthesis.getVoices().find((v) => v.name === "Microsoft Sonia Online (Natural) - English (United Kingdom)")
        console.log(utterance)
      
        window.speechSynthesis.speak(utterance);
      }
      async function stopSpeech(){
        window.speechSynthesis.cancel()
        //window.speechSynthesis.pause()
      }
      async function resumeSpeech(){
        window.speechSynthesis.resume()
      }
    return (
        <div >
             <input value={text} onChange={e => setText(e.target.value)} />
             <button onClick={handleSpeech}>Click</button>
             <button onClick={stopSpeech}>stop</button>
             <button onClick={resumeSpeech}>resume</button>



        </div>
    )
}
export default Speech
