import os
import torch
import torchaudio
import pandas as pd
from transformers import (
    Wav2Vec2ForCTC,
    Wav2Vec2Processor,
    AutoTokenizer,
    AutoModelForSequenceClassification
)
from sklearn.preprocessing import LabelEncoder

# === 1. Load Wav2Vec2 for speech-to-text ===
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
stt_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

# === 2. Load tokenizer and trained classification model ===
model_name = "bert-base-uncased"  # Must match preprocessing
classifier_tokenizer = AutoTokenizer.from_pretrained(model_name)

# **IMPORTANT**: Change to the **absolute path** for the model directory
classifier_model = AutoModelForSequenceClassification.from_pretrained("C:\\Users\\91863\\travis\\backend\\intent_model")  # absolute path

# === 3. Load label encoder to decode intent class ===
label_encoder = LabelEncoder()
label_encoder.classes_ = pd.read_csv("C:\\Users\\91863\\travis\\data\\csv_exported\\train_data.csv")['label'].astype(str).unique()

# === 4. Transcribe audio ===
def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    waveform, sample_rate = torchaudio.load(file_path)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)

    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)

    input_values = processor(waveform.squeeze().numpy(), return_tensors="pt", sampling_rate=16000).input_values

    with torch.no_grad():
        logits = stt_model(input_values).logits

    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]
    return transcription.lower()

# === 5. Predict Intent ===
def classify_intent(text):
    inputs = classifier_tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = classifier_model(**inputs)
        predicted_class_id = torch.argmax(outputs.logits, dim=-1).item()
        predicted_intent = label_encoder.inverse_transform([predicted_class_id])[0]
    return predicted_intent

# === Main Execution ===
if __name__ == "__main__":
    audio_path = "C:\\Users\\91863\\travis\\backend\\travis.mp3"

    try:
        # Step 1: Transcribe
        transcribed_text = transcribe_audio(audio_path)
        print("🔊 Transcribed Text:", transcribed_text)

        # Step 2: Classify Intent
        intent = classify_intent(transcribed_text)
        print("🧠 Predicted Intent:", intent)

    except Exception as e:
        print("❌ Error:", e)
