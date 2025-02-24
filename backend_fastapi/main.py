from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import asyncio  # Achte darauf, dass asyncio importiert ist, wenn du es verwendest


#Dependencies for Action-Detection
from live_action_detection import action_detection
import cv2
import numpy as np

#Dependencies for Sentiment-Analysis
from live_sentiment_analyse import sentiment_analysis


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

process = None

#implement Action detection per Function
async def detection_updates(websocket: WebSocket):
    
    #VideoCapture-Objekt erstellen
    cap = cv2.VideoCapture(0)  # 0 ist die Standard-Webcam
    cap.set(cv2.CAP_PROP_FPS, 24)  # 24 fps festlegen

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)  # Setzt die Bildbreite
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)  # Setzt die Bildhöhe

        # Frame vorverarbeiten
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        input_size = (256, 256)  # Die Größe, die das KI-Modell erwartet
        frame_resized = cv2.resize(gray_frame, input_size)
        frame_normalized = frame_resized / 255.0  # Normalisieren
        frame_input = np.array(frame_normalized)
        frame_input = np.expand_dims(frame_input, axis=0)  #(1, 16, 224, 224, 3)
        sequence_length = 15
        class_data, sequ_pred = action_detection(frame_input, sequence_length)

        #print(f'Detected Class: {class_data}')

        await websocket.send_text(sequ_pred )
        await asyncio.sleep(0.6)  # Simulierte Verzögerung
        
        # Text auf das Frame zeichnen
        text_x_offset = 10
        text_y_offset_l1 = 90
        text_y_offset_l2 = 180
        text_y_offset_l3 = 270
        font_size = 2
        font_weight = 6

        if sequ_pred == class_data:
            display_color = (0, 255, 0)
        else:
            display_color = (0, 0, 255)

        cv2.putText(frame, "Sequ. predition: " + sequ_pred, (text_x_offset, text_y_offset_l1), cv2.FONT_HERSHEY_SIMPLEX, font_size, (0, 255, 0), font_weight) 
        cv2.putText(frame, "Frame predition: " + class_data, (text_x_offset, text_y_offset_l2), cv2.FONT_HERSHEY_SIMPLEX, font_size, display_color, font_weight) 
        cv2.putText(frame, "Sequence-Length: " + str(sequence_length), (text_x_offset, text_y_offset_l3), cv2.FONT_HERSHEY_SIMPLEX, font_size, (255, 255, 0), font_weight)    
   
        # Frame anzeigen
        cv2.imshow('Webcam', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await detection_updates(websocket)  # Rufe die Funktion hier auf
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("WebSocket disconnected")


@app.post("/start")
async def start_detection(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_detection)
    return {"status": "Detection started"}

@app.post("/stop")
async def stop_detection():
    global process
    if process:
        process.terminate()
        process = None
        return {"status": "Detection stopped"}
    return {"status": "No detection running"}

class SentimentPredictionRequest(BaseModel):
    input_text: str

@app.post("/get_sentiment")
async def predict(request: SentimentPredictionRequest):
    try:
        input_text = request.input_text
        # Vorhersage durchführen
        prediction = sentiment_analysis(input_text)
        #print(predict)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
def run_detection():
    global process
    process = subprocess.Popen(["python", "python_test.py"])

