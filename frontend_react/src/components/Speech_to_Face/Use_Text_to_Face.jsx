import React, {useEffect} from "react";

//Enable Speech of Browser
import { SpeechOnClick } from "../Text_to_Speech/UseTexToSpeech";

//import Morph Target Map
import { morphTargetMap } from "../Character/character";

import { triggerAnimation } from "../Character/character";
import { setUnsetSpeechTweenAnimation } from "../Character/character";

//Mapping welche Phonemes alle animiert werden sollen
const phonemeMap = {
    'a': 'viseme_aa',
    'b': 'viseme_PP',  
    'c': 'viseme_CH',
    'd': 'viseme_DD',
    'e': 'viseme_E',
    'f': 'viseme_FF',
    'g': 'viseme_E',
    'h': 'viseme_TH',
    'i': 'viseme_I',
    'j': 'viseme_O',
    'k': 'viseme_kk',
    'l': 'viseme_E',
    'm': 'viseme_nn',
    'n': 'viseme_nn',
    'o': 'viseme_O',
    'p': 'viseme_PP',
    'q': 'viseme_U',
    'r': 'viseme_RR',
    's': 'viseme_SS',
    't': 'viseme_TH',
    'u': 'viseme_U',
    'v': 'viseme_FF',
    'w': 'viseme_E',
    'x': 'viseme_X',
    'y': 'viseme_O',
    'z': 'viseme_TH',

    //Sonderlaute
    'ä': 'viseme_aa',
    'ü': 'viseme_U',
    'ö': 'viseme_O',
    
    //Sonderzeichen
    ',': 'viseme_sil',
    '.': 'viseme_sil',
    ' ': 'viseme_sil',
  };

export const getPhonemesWithTiming = (passedText) => {
    const phonemes = []; // Ein Array für die Phoneme

    //die Groß und Kleinschreibung ignorieren
    passedText = passedText.toLowerCase()

    // Beispiel-Zuordnung 
    for (const char of passedText) {
        if (phonemeMap[char]) {
        phonemes.push(phonemeMap[char]); // Hier wird das entsprechende Phonem zugeordnet
        }
    }
    return phonemes;
};

//Delay angepasst auf die Stimme (je nach Sprechgeschwindigkeit)
const delayOfStart = 0.5;

// Funktion zur Gesichtsanimation
export const handleSpeechToFace = (passedWordEvent, passedPhonemes) => {
    let phonemetimer = 0
    let phoneTimerLastHalf = 0
    let indexOfChar = 0

    //Gleichzeitiges Starten der Animationen mit Delay, je nach Stelle im Wort (zeitlicher Delay nach Morphtargetmap)
    passedPhonemes.forEach((phoneme, index) => {

      //Ermitteln der Zeitparameter
      let animationStrength = morphTargetMap[phoneme].value
      let animationDuration = morphTargetMap[phoneme].duration
      let holdLength = (animationDuration/2) + 10


      //Keine Länge für das Halten für das letzte Phoneme
      if(index == passedPhonemes.length-1){
        holdLength = 0
      }

      //Logik um animation zu starten
      setTimeout(() => setUnsetSpeechTweenAnimation(phoneme, animationStrength, animationDuration, holdLength), (phonemetimer-phoneTimerLastHalf));
      phonemetimer += morphTargetMap[phoneme].duration * delayOfStart;
      phoneTimerLastHalf = delayOfStart * (morphTargetMap[phoneme].duration/2);
    });
  };

function SpeechTest() {
    return (
        <SpeechOnClick></SpeechOnClick>
    )
  }
  
export default SpeechTest;