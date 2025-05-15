import pandas as pd
import numpy as np
from datasets import Dataset
import torch
import torch.nn as nn
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
from sklearn.preprocessing import LabelEncoder

# === 1. Load data ===
train_df = pd.read_csv("C:/Users/91863/travis/data/csv_exported/train_data.csv")
val_df = pd.read_csv("C:/Users/91863/travis/data/csv_exported/val_data.csv")

# Encode labels
label_encoder = LabelEncoder()
train_df["label_id"] = label_encoder.fit_transform(train_df["label"])
val_df["label_id"] = label_encoder.transform(val_df["label"])

# Save label classes for inference use later
label_df = pd.DataFrame({"label": label_encoder.classes_})
label_df.to_csv("C:/Users/91863/travis/data/csv_exported/label_classes.csv", index=False)

# === 2. Rename for Hugging Face Trainer compatibility ===
train_df = train_df.rename(columns={"label_id": "labels"})
val_df = val_df.rename(columns={"label_id": "labels"})

# === 3. Tokenize ===
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize(batch):
    return tokenizer(batch["text"], padding="max_length", truncation=True)

train_dataset = Dataset.from_pandas(train_df[["text", "labels"]])
val_dataset = Dataset.from_pandas(val_df[["text", "labels"]])
train_dataset = train_dataset.map(tokenize, batched=True)
val_dataset = val_dataset.map(tokenize, batched=True)

# Set format for PyTorch
train_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
val_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# === 4. Load model ===
num_labels = len(label_encoder.classes_)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)

# === 5. Define custom trainer ===
class CustomTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs["labels"]
        outputs = model(**inputs)
        logits = outputs.logits
        loss = nn.CrossEntropyLoss()(logits.view(-1, model.config.num_labels), labels.view(-1))
        return (loss, outputs) if return_outputs else loss

# === 6. Training arguments (No unsupported params) ===
training_args = TrainingArguments(
    output_dir="./backend/intent_model",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    logging_dir="./logs",
    logging_steps=10,
    save_total_limit=2,
    do_eval=True,
)

# === 7. Initialize and train ===
trainer = CustomTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
)

trainer.train()

# === 8. Save model and tokenizer ===
trainer.save_model("./backend/intent_model")
tokenizer.save_pretrained("./backend/intent_model")
