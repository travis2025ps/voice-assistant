from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Load tokenizer and model globally to avoid repeated loading
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")

def translate_text(text, source_lang="eng_Latn", target_lang="hin_Deva"):
    """
    Translates input text from source_lang to target_lang using NLLB-200.
    
    Args:
        text (str): Text to translate.
        source_lang (str): Source language code (e.g., "eng_Latn").
        target_lang (str): Target language code (e.g., "hin_Deva").

    Returns:
        str: Translated text.
    """
    try:
        # Add language tokens
        tokenizer.src_lang = source_lang
        encoded = tokenizer(text, return_tensors="pt")

        # Set forced beginning of sentence token for target language
        generated_tokens = model.generate(
            **encoded,
            forced_bos_token_id=tokenizer.lang_code_to_id[target_lang],
            max_length=512
        )

        # Decode translated text
        translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        return translated_text

    except Exception as e:
        return f"Translation error: {e}"


