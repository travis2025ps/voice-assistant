from transformers import pipeline

# Load the translation pipeline
translator = pipeline("translation", model="facebook/nllb-200-distilled-600M")

# Example text to translate
text = "Hello, how are you?"
translated_text = translator(text, target_lang="es")  # Translate to Spanish
print(translated_text)
