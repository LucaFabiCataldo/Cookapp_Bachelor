import React, { useEffect, useState } from 'react';
import { setCookingProgress } from '../Recepies/cookingRecepie';
import { setCookingGoBack } from '../Recepies/cookingRecepie';
import { setCookingRepeat } from '../Recepies/cookingRecepie';
import { wakeWordDetectedCheck } from '../Recepies/cookingRecepie';
import { enableSentiment } from '../SentimentAnalysis/UseSentiment';

import './UseWakeWord.css'

export const WakeWordListener = () => {
    const [isListening, setIsListening] = useState(false);
    const [detected, setDetected] = useState(false);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        console.log("Wake word listener initialized by myself!");

        // Überprüfen, ob die Web Speech API verfügbar ist
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Web Speech API is not supported in this browser.");
            return;
        }

        const keywordsNextStep = ["weiter", "nächste", "fertig", "erledigt", "fortsetzen"];
        const keywordsPrevStep = ["zurück", "vorher", "letzte", "vergangen", "vergangen", "vorange", "nochmal zurückgehen", "vorherigen"];
        const keywordsRepeStep = ["wiederholen", "nochmal sagen", "noch mal sagen", "wiederhole"];
        let wakeWordDetected = false;

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'de-DE';

        recognition.onresult = (event) => {
            let detectedTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('')
                .toLowerCase();

            setTranscript(detectedTranscript); // Speichern im State
            console.log("Erkannt:", detectedTranscript);

            if (!wakeWordDetected){

            }

            if (detectedTranscript.includes("tim")) {
                recognition.stop();
                setDetected(true);
                console.log("Wake Word detected!");
                wakeWordDetected = true;
                wakeWordDetectedCheck(true)
            }

            if (wakeWordDetected && keywordsNextStep.some(keyword => detectedTranscript.includes(keyword))){
                recognition.stop();
                console.warn("Nächster Schritt wird eingeleitet");
                wakeWordDetected = false;
                setCookingProgress(true);
                wakeWordDetectedCheck(false);
            }

            else if (wakeWordDetected && keywordsPrevStep.some(keyword => detectedTranscript.includes(keyword))){
                recognition.stop();
                console.warn("Der vorherige Schritt wird eingeleitet");
                wakeWordDetected = false;
                setCookingGoBack(true);
                wakeWordDetectedCheck(false);
            }

            else if (wakeWordDetected && keywordsRepeStep.some(keyword => detectedTranscript.includes(keyword))){
                recognition.stop();
                console.warn("Der momentane Schritt wird wiederholt.");
                wakeWordDetected = false;
                setCookingRepeat(true);
                wakeWordDetectedCheck(false);
            }
        };

        recognition.onerror = (event) => {
            console.error("Spracherkennungsfehler:", event.error);
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            console.log("Speech Detection Ended - nothing happened");
            recognition.start();
        };
        
        if (isListening) {
            recognition.start();
            console.log("Restarting Detection");
        }

        return () => {
            recognition.stop();
        };

    }, [isListening]);

    const removeStartBlock = () => {
        let startingBlock = document.getElementById("mikeCheck")
        startingBlock.style.bottom = "100vh"
        startingBlock.style.opacity = "0%"
    }

    const toggleListening = () => {
        setIsListening(prevState => !prevState);
        removeStartBlock()
    };

    const toggleMode = () => {
        var modeButton = document.getElementById('setPhaseMode')
        if(modeButton.textContent == "A"){
            modeButton.textContent = "B"
            modeButton.style.backgroundColor = "#ffffff"
            modeButton.style.color = "#145f47"
        }
        else{
            modeButton.textContent = "A"
            modeButton.style.backgroundColor = "#145f47"
            modeButton.style.color = "#ffffff"
        }
        enableSentiment()
    };

    return (
        <>
        <div id='mikeCheck'>
            <div id='setPhaseMode'  onClick={toggleMode}>
                A
            </div>
            <div>
                <p>Bereit für das User Testing?</p>
                <p>Klicke auf den Button um zu starten.</p>
            </div>
            <button onClick={toggleListening}>
                {isListening ? "Lass uns loslegen!" : "Lass uns loslegen!"}
            </button>
        </div>
        <div style={{
            zIndex: 23, // Hier fügst du den zIndex hinzu
        }}>
            <h2>Wake Word Listener</h2>
            <button onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p>{isListening ? "Listening..." : "Not Listening"}</p>
            {detected && <p>Wake Word detected!</p>}
            <p>Transcript: {transcript}</p>
        </div>
        </>
    );
};

export default WakeWordListener;
