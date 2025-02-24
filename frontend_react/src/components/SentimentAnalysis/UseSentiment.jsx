import React from "react";
import { setTweenAnimation } from "../Character/character";
import { unsetTweenAnimation } from "../Character/character";
import { setUnsetEmotionTweenAnimation } from "../Character/character";

const emotionMap = {
    Freude: [
        //Mundpartie
        ["mouthSmileLeft", 0.5],
        ["mouthSmileRight", 0.5],
        ["jawOpen", 0.025],
        //Augenpartie
        ["browOuterUpLeft", 0.3],
        ["browOuterUpRight", 0.3],
        ["browInnerUp", 0.1],
        ["cheekSquintLeft", 1.0],
        ["cheekSquintRight", 1.0],
    ],
    Motivation: [
        //Mundpartie
        ["mouthDimpleLeft", 0.33],
        ["mouthDimpleRight", 0.33],
        ["mouthRollLower", 0.25],
        ["mouthRollUpper", 0.25],
        ["mouthPressLeft", 0.85],
        ["mouthPressRight", 0.3],
        //Augenpartie
        ["eyeSquintLeft", 0.1],
        ["eyeSquintRight", 0.1],
        //Wangenbereich
        ["cheekSquintLeft", 0.75],
        ["cheekSquintRight", 0.75],
    ],
    Warnung: [
        //Mundpartie
        ["mouthFrownLeft", 0.33],
        ["mouthFrownRight", 0.33],
        ["mouthShrugUpper", 0.1],
        ["mouthLowerDownLeft", 0.2],
        ["mouthLowerDownRight", 0.2],
        ["mouthStretchLeft", 0.3],
        ["mouthStretchRight", 0.3],
        ["mouthClose", 0.1],
        //Augenpartie
        ["browDownLeft", 0.9],
        ["browDownRight", 0.9],
        ["browInnerUp", 0.6],
        ["browOuterUpLeft", 0.1],
        ["browOuterUpRight", 0.1],
        ["eyeWideLeft", 0.5],
        ["eyeWideRight", 0.5],
        ["eyeLookInLeft", 0.5],
        ["eyeLookInRight", 0.5],
        //Nasenpartie
        ["noseSneerLeft", 0.2],
        ["noseSneerRight", 0.2],
    ],
    Beruhigung: [
        ["eyeSquintLeft", 0.3],
        ["eyeSquintRight", 0.3],
        //Mundpartie
        ["mouthShrugLower", .2],
        ["mouthShrugUpper", .2],
        ["mouthDimpleLeft", .5],
        ["mouthDimpleRight", .5],
        ["mouthRollLower", .2],
        ["mouthPressLeft", .2],
        ["mouthPressRight", .2],
        ["mouthSmileLeft", .15],
        ["mouthSmileRight", .15],
        ["mouthStretchLeft", .5],
        ["mouthStretchRight", .5],
        //Augenpartie
        ["browOuterUpLeft", 0.2],
        ["browOuterUpRight", 0.2],
        ["browInnerUp", 0.2],
        //Nasenpartie
        ["noseSneerLeft", 0.5],
        ["noseSneerRight", 0.5],
        //Wangenpartie
        ["cheekSquintLeft", 0.6],
        ["cheekSquintRight", 0.6],
    ],
    Erleichterung: [
        //Mundpartie
        ["mouthPucker", 0.45],
        ["mouthSmileLeft", .3],
        ["mouthSmileRight", .3],
        //Augenpartie
        ["browInnerUp", .67],
        //Wangenpartie
        ["cheekSquintLeft", .4],
        ["cheekSquintRight", .4],
    ],
    Neutral: [
        //Mundpartie
        ["mouthUpperUpLeft", 0.2],
        ["mouthUpperUpRight", 0.2],
        ["mouthSmileLeft", 0.4],
        ["mouthSmileRight", 0.4]
    ],
    Info: [
        //Mundpartie
        ["mouthFrownLeft", 0.25],
        ["mouthFrownRight", 0.25],
        ["mouthLowerDownLeft", .1],
        ["mouthLowerDownRight", .1],
        ["mouthDimpleLeft", .6],
        ["mouthDimpleRight", .0],
        ["mouthSmileLeft", 0.1],
        ["mouthSmileRight", 0.2],
        //Wangenpartie
        ["cheekSquintLeft", .6],
        ["cheekSquintRight", .6],


        ["browOuterUpLeft", 0.4],
        ["browOuterUpRight", 0.4],
        ["browInnerUp", 0.4],
    ],
}

var sentimentEnabled = true;

export const enableSentiment = () => {
    if(sentimentEnabled == true){
        sentimentEnabled = false
    }
    else{
        sentimentEnabled = true
    }
}

const CreateUniqueFacialExpression = (passed_data) => {

    let all_shape_keys = []

    passed_data.forEach(sentiment => {
        //Emotionsanimation für die Predictete Emotion
        emotionMap[sentiment[0]].forEach(emotionPhoneme => {        
            let found = false; 

            all_shape_keys.forEach(row => {
                if (row[0] == emotionPhoneme[0]) {
                    row[1] += (emotionPhoneme[1] * sentiment[1]);
                    found = true;
                }
            });
        
            if (!found) {
                all_shape_keys.push([emotionPhoneme[0], (emotionPhoneme[1] * sentiment[1])]);
            }
        });
      });

    console.log(all_shape_keys)

    return all_shape_keys
}


export const UseSentimentAnalysis = async (passedText) => {
    try {
        // Daten an das Backend senden
        const response = await fetch('http://127.0.0.1:8000/get_sentiment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_text: passedText })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        let facial_expression = CreateUniqueFacialExpression(data)

        if(sentimentEnabled){
            facial_expression.forEach(expresion_point => {
                setUnsetEmotionTweenAnimation(expresion_point[0], expresion_point[1], 10000)
            });
        }
        else{
            console.log("Sentiment Darstellung disabled.")
        }

        //Return data für die Konsolenausgabe zum Debugging
        return facial_expression
    } catch (error) {
        console.log("Shit mein error wird geworfen.")
        console.error(error);
    }
}

export const setFaceOnNeutral = (passedEmotionArray) => {
    passedEmotionArray.forEach(expresion_point => {
        unsetTweenAnimation(expresion_point[0], expresion_point[1], 5000)
    });
}

function UseSentimentDebug() {

    function triggerDebugTween(emotion){
        emotionMap[emotion].forEach(emotionPhoneme => {
            setUnsetEmotionTweenAnimation(emotionPhoneme[0], emotionPhoneme[1], 2000)
          });
    }
    return (
        <>
            <div
                style={{
                    zIndex: 10,
                }}
                >
                <button onClick={() => triggerDebugTween("Neutral")}>Debug Neutral</button>
                <button onClick={() => triggerDebugTween("Freude")}>Debug Freude</button>
                <button onClick={() => triggerDebugTween("Info")}>Debug Info</button>
                <button onClick={() => triggerDebugTween("Warnung")}>Debug Warnung</button>
                <button onClick={() => triggerDebugTween("Erleichterung")}>Debug Erleichterung</button>
                <button onClick={() => triggerDebugTween("Motivation")}>Debug Motivation</button>
                <button onClick={() => triggerDebugTween("Beruhigung")}>Debug Beruhigung</button>
            </div>
        </>
    )
  }
  
  export default UseSentimentDebug;