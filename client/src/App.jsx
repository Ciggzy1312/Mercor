import 'regenerator-runtime/runtime'
import './App.css'

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRef, useState } from 'react';
import axios from 'axios';

function App() {

  const synth = window.speechSynthesis;

  const ref = useRef(null)

  const [isListening, setIsListening] = useState(false)
  const [answer, setAnswer] = useState("")

  let refreshSpeech = setInterval(() => {
    if (!synth.speaking) {
      clearInterval(refreshSpeech);
    } else {
      synth.pause();
      synth.resume();
    }
  }, 14000);

  const handleListening = () => {

    if (isListening) {
      setIsListening(false)
      SpeechRecognition.stopListening();
      return;
    }

    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  }

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleSubmit = async () => {
    const res = await axios.post(import.meta.env.VITE_DEPLOYMENT_ENV == 'dev' ? 'http://localhost:5000/' : '', { question: ref.current.innerText });

    setAnswer(res.data.answer);
    const u = new SpeechSynthesisUtterance(res.data.answer);

    synth.cancel();
    synth.speak(u);
  }

  return (
    <div className=''>
      <h2 className=''>Enter you question</h2>

      <div className='transcript-box' ref={ref}>
        {transcript}
      </div>

      <div className=''>
        <button className='btn' onClick={handleListening}>{isListening ? "Stop" : "Start"}</button>
        <button className='btn' onClick={handleSubmit}>Submit</button>
        <button className='btn' onClick={() => resetTranscript()}>Clear</button>
      </div>

      <h2 className=''>Your Answer</h2>

      <div className='transcript-box answer-box'>
        {answer}
      </div>

      <div className=''>
        <button className='' onClick={() => { setAnswer(""); synth.cancel() }}>Clear Answer</button>
      </div>
    </div>
  )
}

export default App
