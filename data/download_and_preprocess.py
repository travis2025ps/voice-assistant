from datasets import load_dataset, Dataset  # Import Dataset from datasets module
import re
import os
import string
from sklearn.model_selection import train_test_split
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Step 1: Load the Banking77 dataset
dataset = load_dataset("banking77")

# Check the structure of the dataset
print(dataset)

# Step 2: Preprocess the dataset
def clean_text(text):
    """
    This function performs basic text preprocessing:
    - Convert text to lowercase
    - Remove extra spaces
    - Remove punctuation
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation
    text = re.sub(f"[{string.punctuation}]", "", text)
    
    # Remove extra spaces
    text = ' '.join(text.split())
    
    return text

# Apply the cleaning function to the dataset
train_data = dataset['train']
train_data = train_data.map(lambda x: {'text': clean_text(x['text'])})

# Optionally, we can map the labels to corresponding intent names if necessary
# For now, we will just use the existing "label" field

# Step 3: Split the dataset into training and validation sets
# Here we are splitting the 'train' portion into 80% training and 20% validation
train_df = pd.DataFrame(train_data)
train_df, val_df = train_test_split(train_df, test_size=0.2, random_state=42)

# ✅ Step 4: Export the train and validation datasets to CSV format

# Define output directory
csv_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "csv_exported")
os.makedirs(csv_dir, exist_ok=True)  # Create folder if it doesn't exist

# Save the datasets as CSV files
train_csv_path = os.path.join(csv_dir, "train_data.csv")
val_csv_path = os.path.join(csv_dir, "val_data.csv")

train_df.to_csv(train_csv_path, index=False)
val_df.to_csv(val_csv_path, index=False)

print(f"CSV Export Complete:")
print(f"   ➤ Train CSV: {train_csv_path}")
print(f"   ➤ Val CSV:   {val_csv_path}")

# Step 5: Check the structure of the exported data
print(f"Training set saved as CSV: {train_csv_path}")
print(f"Validation set saved as CSV: {val_csv_path}")

# Optionally load the tokenizer and model for sequence classification
model_name = "bert-base-uncased"  # Or "roberta-base" or "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=77)  # Assuming 77 intents
