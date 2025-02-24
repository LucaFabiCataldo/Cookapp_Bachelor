import { endCookingRepeat } from '../Recepies/cookingRecepie';
import { disableSpeechButton } from '../Text_to_Speech/UseTexToSpeech';
import { enableSentiment } from '../SentimentAnalysis/UseSentiment';


import crossClose from './Cross.svg';  // Bild importieren
import cookImage from './Chef.svg';  // Bild importieren
import messagerImage from './Messenger.svg';  // Bild importieren

//CSS
import './messenger.css'

export const createTextInMessenger = (passedText, source) => {
    //Neues div-Element erstellen
    const newDiv = document.createElement('div');

    //Dem neuen div Inhalt hinzufügen
    newDiv.textContent = passedText;

    //Eine Klasse hinzufügen, um das div zu stylen
    if(source == "application"){
        newDiv.classList.add('appMessage');
    }
    else{
        newDiv.classList.add('userMessage');
    }
    
    //Das neue div an das bestehende Element anhängen
    const parentDiv = document.getElementById('textBlock');
    parentDiv.appendChild(newDiv);  // Anhängen an das übergeordnete div
  };


function UseTextMessengerDisplay() {
    var textEnabled = false
    var characterEnabled = true

    const setLayout = (source) => {
        var textArea = document.getElementById("textBlock");
        var characterArea = document.getElementById("canvas_character");

        if(textEnabled == true && characterEnabled == true){
            textArea.style.width = "45%";
            textArea.style.transform = "translate(0vw)";
            characterArea.style.width = "100vw";
            characterArea.style.left = "-25%";
            enableSentiment(true)
        }

        else if(textEnabled == true && characterEnabled != true){
            textArea.style.width = "45%";
            textArea.style.transform = "translate(0vw)";
            characterArea.style.width = "100vw";
            characterArea.style.left = "-25%";
            enableSentiment(false)
        }

        else if(textEnabled != true && characterEnabled == true){
            textArea.style.width = "calc(50vw-50px)";
            textArea.style.transform = "translate(100vw)";
            characterArea.style.width = "100vw";
            characterArea.style.left = "0%";
            enableSentiment(true)
        }
    };

    const setText = () => {
        // Überprüfen und dann umkehren
        if (textEnabled === true) {
            textEnabled = false;
        } else {
            textEnabled = true;
        }
        setLayout("text")
    };

    const setCharacter = () => {
        // Überprüfen und dann umkehren
        if (characterEnabled === true) {
            characterEnabled = false;
        } else {
            characterEnabled = true;
        }
        setLayout("character")
      };

    const stopCookingProcess = () => {
        endCookingRepeat(true)
        disableSpeechButton()
    }

return (
    //<UseSentimentDebug></UseSentimentDebug>
    //<SpeechTest></SpeechTest>
    <>
        <div id='wholeMessenger'>
            <div id='stopCookingArea'>
                <div id='stopCookingButton' onClick={stopCookingProcess}>
                    <img src={crossClose} alt="Cancel Icon" />
                </div>
            </div>
            <div id='textBlock'>
                <div className='appMessage'>
                    <p>Hier stehen die Anweisungen der App.</p>
                </div>
                <div className='userMessage'>
                    <p>Hier stehen deine Eingaben, die mit der Spracheingabe erfasst wurden. Diese Nachricht ist als Beispiel gedacht.</p>
                </div>
            </div>
            <div id='setCommunikationStyle'>
                <div id='enableCharacter' onClick={setCharacter}>
                    <img src={cookImage} alt="Chef Icon" />
                </div>
                <div id='enableText' onClick={setText}>                
                    <img src={messagerImage} alt="Message Icon" />
                </div>
            </div>
        </div>
  </>
  )
}

export default UseTextMessengerDisplay;
