import React, { useEffect } from "react";
import Header from "./components/HeaderAndFooter/Header";
import FastAPITest from "./components/fast_api_server_ad_react";
import Recepies_Page from "./components/Recepies/recepies";
import Scene from "./components/Character/character";
import SpeechTest from "./components/Speech_to_Face/Use_Text_to_Face";
import WakeWordListener from "./components/Wake_Word/UseWakeWord";
import UseSentimentDebug from "./components/SentimentAnalysis/UseSentiment";
import Footer from "./components/HeaderAndFooter/Footer";
import UseTextMessengerDisplay from "./components/Text_Messenger_Display/Use_Text_Messenger";
import { setCookingProgress } from "./components/Recepies/cookingRecepie";
import { setCookingGoBack } from "./components/Recepies/cookingRecepie";
import { setCookingRepeat } from "./components/Recepies/cookingRecepie";
import { endCookingRepeat } from "./components/Recepies/cookingRecepie";

//CSS
import './complete_App.css'

function Completeapp() {

  // Funktion, die ausgeführt werden soll, wenn eine Taste gedrückt wird
  const handleKeyPress = (event) => {
    // Überprüfe, welche Taste gedrückt wurde
    if (event.key === "ArrowRight") {
      setCookingProgress(true);
      // Deine Funktion hier aufrufen
    }     
    else if (event.key === "ArrowLeft") {
      setCookingGoBack(true);
      // Deine Funktion hier aufrufen
    } 
    else if (event.key === "ArrowUp") {
      setCookingRepeat(true);
      // Deine Funktion hier aufrufen
    } 
    else if (event.key === "ArrowDown") {
      endCookingRepeat(true);
      // Deine Funktion hier aufrufen
    } 
  };

  // useEffect für den Tastendruck
  useEffect(() => {
    // Event Listener hinzufügen
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup: Event Listener entfernen, wenn die Komponente unmontiert wird
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // leeres Array sorgt dafür, dass der Effekt nur einmal beim ersten Rendern ausgeführt wird


  return (
    <>
    <Header></Header>
    <SpeechTest></SpeechTest>
    <UseSentimentDebug></UseSentimentDebug>
    <Recepies_Page></Recepies_Page>
    <FastAPITest></FastAPITest>
    <UseTextMessengerDisplay></UseTextMessengerDisplay>
    <Scene></Scene>
    <Footer></Footer>
    <WakeWordListener></WakeWordListener>
  </>
  )
}

export default Completeapp;
