import { handleSpeechSythese } from "../Text_to_Speech/UseTexToSpeech";

let detected_action = "tbd"

export const setDetectedAction = (newAction) => {
    detected_action = newAction;
  };

const wrongDetectedPrompts =[
    "Kommst du gerade nicht weiter? Kein Problem, ich wiederhole nochmal den letzten Schritt.",
    "Du scheinst nicht weiterzukommen oder? Lass mich dir nochmal den letzten Schritt vorlesen.",
    "Dieser Schritt ist schwierig oder? Lass ihn uns nochmal zusammen durchgehen.",
    "Du scheinst etwas Probleme zu haben, kann das sein? Ich wiederhole nochmal den momentanen Schritt",
    "Falls du gerade nicht weiterkommst, sag einfach kurz Bescheid. Ich helfe dir gerne weiter."
]

const randomInteraktionPrompts = [
    "Wenn es zu gut riecht, könnten wir die Feuerwehr rufen – aber nur, um zu checken, wie gut wir sind!",
    "Wenn das hier ein Test wäre, dann hätten wir schon längst den Notruf gerufen… aber zum Glück ist es nur ein Rezept!",
    "Kochen ist wie Chemie – nur mit besserem Geschmack und weniger Explosionen, hoffe ich zumindest!",
    "Die beste Chemie findet nicht im Labor statt, sondern in der Küche – solange nichts explodiert!",
]

const randomWakeWordPrompts = [
    "Ja? Wie kann ich dir helfen?",
    "Was gibt es?",
    "Schieß los, was gibt es?",
    "Brauchst du Hilfe?",
]

//Debugginghilfe
let enableActionRecognition = true

//Überprüfungsintervall
const intervallInMilliSek = 500

//Variabeln zur Funktion
let recepieState = 0;
let detectedCounter = 0;
let wrongDetectedCounter = 0;
let wakeWordDetectedCounter = 0;

//Hyperparameter
const detectedCounterThreshold = 5;
const wakeWordDetectedCounterThreshold = 10;
const wrongDetectedCounterThreshold = 100;
let frequency = 0.0025;

//Boolean to check if thos step is detected for the first time
let firstTimeCheck = true;
let continueCookStep = false;
let goBackCookStep = false;
let repeatCookStep = false;
let stopCooking = false;
let wakeWordDetected = false;

const resetDetectionCounter = () =>{
    detectedCounter = 0;
    wrongDetectedCounter =0;
    wakeWordDetectedCounter = 0
}

//Funktionen um das Kochen zu steuern
export const setCookingProgress = (value) => {
    continueCookStep = value;
    resetDetectionCounter()
};

export const setCookingGoBack = (value) => {
    goBackCookStep = value;
    resetDetectionCounter()
};

export const setCookingRepeat = (value) => {
    repeatCookStep = value;
    resetDetectionCounter()
};

export const endCookingRepeat = (value) => {
    stopCooking = value;
    resetDetectionCounter()
};

export const wakeWordDetectedCheck = (value) => {
    wakeWordDetected = value;
    resetDetectionCounter()
};

const check_cooking_step_by_pred_action = (passedDetAct, passedActionToBeDone) => {
    if (passedDetAct == passedActionToBeDone && enableActionRecognition){
        detectedCounter += 1
        //return 1
    }
    else{
        wrongDetectedCounter += 1
    }
};

const randomWakeWordQuestion = () => {
    const randomIIndex = Math.floor(Math.random() * randomWakeWordPrompts.length);
    let randomIPrompt = randomWakeWordPrompts[randomIIndex]
    handleSpeechSythese(randomIPrompt)
    wrongDetectedCounter -= 10
}

const random_interaktion = (frequency) => {
    var randomVal = Math.random()
    if (randomVal < frequency) {
        const randomIIndex = Math.floor(Math.random() * randomInteraktionPrompts.length);
        let randomIPrompt = randomInteraktionPrompts[randomIIndex]
        handleSpeechSythese(randomIPrompt)
        wrongDetectedCounter -= 10
    }
}

//Periodisches Überprüfen des Wertes
export function checkRecepieStatus(passedInstructions) {
    console.log("Rezept wird gestartet");
    const lastState = passedInstructions.length;

    const finishSentence = ["finish", "Wir sind fertig. Ich hoffe es schmeckt dir."];
    passedInstructions.push(finishSentence)
    
    const intervalId = setInterval(() => {
        
        const currentStep = passedInstructions[recepieState][1];

        console.log("Aktueller Schritt:", recepieState, "von möglichen", lastState);
        console.log(passedInstructions[recepieState][1]);
        console.log("Momentan ", detected_action, " bei ", wrongDetectedCounter, " Falsch erkannten und ", detectedCounter
            , " right detected Actions."
        )

        check_cooking_step_by_pred_action(detected_action, passedInstructions[recepieState][0])
        random_interaktion(frequency)

        if(wakeWordDetected){
            wakeWordDetectedCounter += 1;
        }

        if(wakeWordDetectedCounter >= wakeWordDetectedCounterThreshold){
            randomWakeWordQuestion()
            resetDetectionCounter()
            wakeWordDetected = false;
        }
        
        if(detectedCounter >= detectedCounterThreshold && detected_action == "nothing_happening" || "goToNext" == passedInstructions[recepieState][0]){
            setCookingProgress(true)
            detectedCounter = 0
            wrongDetectedCounter = 0
        }

        if(wrongDetectedCounter >= wrongDetectedCounterThreshold){
            const randomIndex = Math.floor(Math.random() * wrongDetectedPrompts.length);
            let randomPrompt = wrongDetectedPrompts[randomIndex]
            handleSpeechSythese(randomPrompt)
            setCookingRepeat(true)
            detectedCounter = 0
            wrongDetectedCounter = 0
        }

        //Nächster Schritt wird eingeleitet
        if(firstTimeCheck){
            handleSpeechSythese(currentStep);
            firstTimeCheck = false
        }

        //Bedingung für das Einleiten des nächsten Schritts
        else if(continueCookStep){
            if (recepieState === lastState) {
                stopCooking = true;
                console.log("Zielwert erreicht");
            }
            else{
                recepieState += 1;
                firstTimeCheck = true;
                setCookingProgress(false);
            }
        }

        //Bedingung für das Einleiten des vorherigen Schritts
        else if(goBackCookStep){
            console.log("Go back Detected")
            if (recepieState >= 2){
                recepieState -= 2;
                firstTimeCheck = true;
            }
            else {
                handleSpeechSythese("Wir sind im ersten Schritt, es gibt keinen vorherigen Schritt")
            }
            setCookingGoBack(false);
        }

        //Bedingung für das Wiederholen des aktuellen Schritts
        else if(repeatCookStep){
            console.log("Repeat Detected")
            firstTimeCheck = true;
            setCookingRepeat(false);
            console.log("Test")
        }

        // Bedingung für die Beendigung des Rezeptdurchlaufens      
        if (stopCooking) {
            console.log("Rezept wird beendet.");
            continueCookStep = false;
            goBackCookStep = false;
            repeatCookStep = false;
            stopCooking = false;
            wakeWordDetected = false
            firstTimeCheck = true;
            recepieState = 0;
            detectedCounter = 0;
            wrongDetectedCounter =0;
            // Beendet das Intervall
            clearInterval(intervalId);  
        }
    }, intervallInMilliSek);
}

