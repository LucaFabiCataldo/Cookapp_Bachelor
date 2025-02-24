import React, { useEffect, useState } from "react";

import { handleSpeechSythese } from "./Text_to_Speech/UseTexToSpeech.jsx";
import { EnableSpeechButton } from "./Text_to_Speech/UseTexToSpeech.jsx";

import { setDetectedAction } from "./Recepies/cookingRecepie.jsx";

const FastAPITest = () => {
  const [status, setStatus] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      //handleSpeechSythese("Connected to WebSocket");
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      //handleSpeechSythese(event.data);
      //console.log("Label from Action Detection:", event.data);
      setDetectedAction(event.data)
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const startDetection = async () => {
    const response = await fetch("http://localhost:8000/start", {
      method: "POST",
    });
    const data = await response.json();
    console.log("_"*50)
    setStatus(data.status);
    setDetectedAction(data)
  };

  const stopDetection = async () => {
    const response = await fetch("http://localhost:8000/stop", {
      method: "POST",
    });
    const data = await response.json();
    setStatus(data.status);

    if (ws) {
      ws.close(); // WebSocket beenden, wenn die Detection gestoppt wird
    }
  };

  return (
    console.log("Action Detection return")
  );
};

export default FastAPITest;
