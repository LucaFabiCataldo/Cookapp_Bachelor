import numpy as np
from tensorflow.keras.models import load_model
import pickle
from collections import Counter

model = load_model('ai_models/2DCNN_Versuch4_vergoesserte_Modellgroesse.keras')

with open("ai_models/2DCNN_Versuch4_vergoesserte_Modellgroesse_Labelencoder.pkl", "rb") as file:
    encoder = pickle.load(file)

sequ_data = []

def action_detection(passed_frames, sequ_length):

    predictions = model.predict(passed_frames)
    predicted_class = np.argmax(predictions, axis=1)
    class_label = encoder.inverse_transform(predicted_class)[0]
    
    if len(sequ_data) >= sequ_length:
            # Ältesten Wert entfernen
            sequ_data.pop(0)
            
    # Neuen Wert hinzufügen
    sequ_data.append(class_label)
    sequ_label = Counter(sequ_data).most_common(1)[0]

    return class_label, sequ_label[0]