import React from "react";
import { handleSpeechToFace } from "../Speech_to_Face/Use_Text_to_Face.jsx";
import { getPhonemesWithTiming } from "../Speech_to_Face/Use_Text_to_Face.jsx";
import { UseSentimentAnalysis } from "../SentimentAnalysis/UseSentiment.jsx";
import { createTextInMessenger } from "../Text_Messenger_Display/Use_Text_Messenger.jsx";


let voices = [];
let german_voices = [];
let speechAllowed = false; // Zustand zur Verfolgung, ob die Sprachausgabe bereits aktiviert wurde

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  console.log("Verfügbare Stimmen:", voices,);
  german_voices = voices.filter(voice => voice.lang.startsWith('de'));
  console.log("Deutsche Stimmen:", german_voices)
};

// Funktion zur Sprachausgabe
export const handleSpeechSythese = (passedText) => {
  if (!speechAllowed) {
    console.warn("Sprachausgabe nicht erlaubt. Bitte zuerst aktivieren.");
    return;
  }
  else {
    console.warn("Sprachausgabe ist erlaubt, sie kann genutzt werden.");
  }
  
  const value = new SpeechSynthesisUtterance(passedText);
  let allPhonemes = getPhonemesWithTiming(passedText);
  let lastSentimentArray = "Noch keine Übergabe";
  
  // Event-Listener für Statusinformationen
  value.onstart = () => {
    console.warn("Sprachausgabe gestartet.");
    createTextInMessenger(passedText, "application")
    //Konsolenausgabe nur für das Debugging
    UseSentimentAnalysis(passedText).then(predictedSentiment => {
      //console.log("Predicted Sentiment für: ", passedText, "lautet: ", predictedSentiment);
      lastSentimentArray = predictedSentiment;
    });
  };
  
  value.onboundary = (event) => {
    if (event.name === 'word') {
      //Extract Phonemes used for the word
      const wordPhonemes = allPhonemes.slice(0, event.charLength)
      //Remove used Word phonemes
      allPhonemes = allPhonemes.slice(event.charLength)
      handleSpeechToFace(event, wordPhonemes)
    }
    else if (event.name === 'phoneme') {
        //console.log("Phonem-Wechsel erkannt");
    }
};
  
  value.onend = () => {
    console.log("Sprachausgabe beendet.");
  };

  value.onerror = (event) => {
    console.error("Fehler bei der Sprachausgabe:", event.error);
  };

  value.onpause = () => {
    console.log("Sprachausgabe pausiert.");
  };

  value.onresume = () => {
    console.log("Sprachausgabe fortgesetzt.");
  };

  value.voice = german_voices[6];
  value.lang = "de-DE";
  window.speechSynthesis.speak(value);
  console.log("Verwendete Stimme: ", value.voice)
};

export const disableSpeechButton = () => {
  let recipePage = document.getElementById("recipe_page");
  recipePage.style.marginLeft = "0vw";
  speechAllowed = false;
}

export const EnableSpeechButton = () => {

  function enableSpeech(){
    let recipePage = document.getElementById("recipe_page");
    recipePage.style.marginLeft = "100vw";
    speechAllowed = true; // Sprachausgabe aktivieren
    handleSpeechSythese("Alles klar.");
  }
  return (
    <button onClick={enableSpeech} className="recipe_start">Rezept starten</button>
  ) 
};

export const EnableSpeechButtonRecepieOfTheDay = () => {

  function enableSpeech(){
    let recipePage = document.getElementById("recipe_page");
    recipePage.style.marginLeft = "100vw";
    speechAllowed = true; // Sprachausgabe aktivieren
    handleSpeechSythese("Alles klar.");
  }
  return (
    <button onClick={enableSpeech} className="recipeOfTheDay_start">Rezept starten</button>
  ) 
};

//Sprachausgabe auf Buttonclick zum Debugging
export const SpeechOnClick = () => {
  function enableSpeech(){
    speechAllowed = true; // Sprachausgabe aktivieren    
    handleSpeechSythese(`Hallo liebe Familie Cataldo! Viele Grüße aus dem schönen Wien.`);
  }
  return (
    <button onClick={enableSpeech} className="recipe_start">Click for audio</button>
  ) 
};
