import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import tokenizer_from_json

model = load_model('ai_models/Sentiment_AI_GloVe.h5')

labels = np.load("ai_models/sentiment_labels_to_numbers.npy", allow_pickle=True)
print(labels)

#Initialisieren des Tokenizer
with open("ai_models/tokenizer.json", "r") as f:
    loaded_tokenizer_json = f.read()
tokenizer = tokenizer_from_json(loaded_tokenizer_json)

#Trainieren des LabelEncoder auf den Emotionen
label_encoder = LabelEncoder()
emotion_labels = label_encoder.fit_transform(labels)
print("Label-Encoding der Emotionen:", dict(zip(labels, emotion_labels)))

def sentiment_analysis(new_text):
    print(f"Prediction für: {new_text}")
    #Tokenisieren und Padding
    sequence = tokenizer.texts_to_sequences([new_text])  # Text in Sequenz umwandeln
    padded_sequence = pad_sequences(sequence, maxlen=50)  # Sequenz auf Länge 50 auffüllen

    #Vorhersage machen
    prediction = model.predict(padded_sequence)

    #Labels und ihre Wahrscheinlichkeiten anzeigen
    emotion_probabilities = [[label_encoder.inverse_transform([i])[0], float(prediction[0][i])] for i in range(len(emotion_labels))]

    return emotion_probabilities