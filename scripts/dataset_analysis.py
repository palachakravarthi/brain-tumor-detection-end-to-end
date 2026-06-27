import os, random, warnings, zipfile, shutil
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from pathlib import Path
from collections import Counter

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import (
    VGG16, ResNet50V2, EfficientNetB0, MobileNetV2
)
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
)
from sklearn.metrics import (
    classification_report, confusion_matrix, ConfusionMatrixDisplay
)
warnings.filterwarnings('ignore')
tf.random.set_seed(42)
np.random.seed(42)
random.seed(42)

print(f'TensorFlow version: {tf.__version__}')
print(f'GPU available: {len(tf.config.list_physical_devices("GPU")) > 0}')

# ================================
# Dataset Paths
# ================================

BASE_DIR = Path(__file__).resolve().parent.parent

TRAIN_DIR = BASE_DIR / "dataset" / "Training"
VAL_DIR = BASE_DIR / "dataset" / "Validation"
TEST_DIR = BASE_DIR / "dataset" / "Testing"

print("Training Path :", TRAIN_DIR)
print("Validation Path :", VAL_DIR)
print("Testing Path :", TEST_DIR)

# ==========================================
# Read Dataset Classes
# ==========================================

classes = sorted([folder.name for folder in TRAIN_DIR.iterdir() if folder.is_dir()])

print("=" * 50)
print("Brain Tumor Classes")
print("=" * 50)

for i, class_name in enumerate(classes, start=1):
    print(f"{i}. {class_name}")

print("\nTotal Classes :", len(classes))

# ==========================================
# Count Images in Each Class
# ==========================================

def count_images(folder_path):
    counts = {}

    for class_folder in sorted(folder_path.iterdir()):
        if class_folder.is_dir():
            image_count = len(list(class_folder.glob("*")))
            counts[class_folder.name] = image_count

    return counts


train_counts = count_images(TRAIN_DIR)
val_counts = count_images(VAL_DIR)
test_counts = count_images(TEST_DIR)

print("=" * 60)
print("TRAINING DATASET")
print("=" * 60)

for cls, count in train_counts.items():
    print(f"{cls:<15} : {count}")

print("\n" + "=" * 60)
print("VALIDATION DATASET")
print("=" * 60)

for cls, count in val_counts.items():
    print(f"{cls:<15} : {count}")

print("\n" + "=" * 60)
print("TESTING DATASET")
print("=" * 60)

for cls, count in test_counts.items():
    print(f"{cls:<15} : {count}")
# ==========================================
# Dataset Summary
# ==========================================

train_total = sum(train_counts.values())
val_total = sum(val_counts.values())
test_total = sum(test_counts.values())

grand_total = train_total + val_total + test_total

print("\n" + "=" * 60)
print("DATASET SUMMARY")
print("=" * 60)

print(f"Training Images   : {train_total}")
print(f"Validation Images : {val_total}")
print(f"Testing Images    : {test_total}")
print("-" * 60)
print(f"Grand Total Images: {grand_total}")

import pandas as pd
# ==========================================
# Dataset Summary Table
# ==========================================

summary_df = pd.DataFrame({
    "Dataset": ["Training", "Validation", "Testing"],
    "Images": [train_total, val_total, test_total]
})

print("\n")
print(summary_df)

print("\nTotal Images :", grand_total)

# ==========================================
# Class Distribution
# ==========================================

plt.figure(figsize=(8, 5))

plt.bar(train_counts.keys(), train_counts.values())

plt.title("Training Dataset Class Distribution")
plt.xlabel("Brain Tumor Classes")
plt.ylabel("Number of Images")

plt.grid(axis="y", linestyle="--", alpha=0.5)

plt.show()

# ==========================================
# Display Sample Images from Each Class
# ==========================================

fig, axes = plt.subplots(1, len(classes), figsize=(16, 4))

for i, class_name in enumerate(classes):

    class_path = TRAIN_DIR / class_name

    image_path = next(class_path.glob("*"))

    img = plt.imread(image_path)

    axes[i].imshow(img)
    axes[i].set_title(class_name)
    axes[i].axis("off")

plt.suptitle("Sample MRI Images from Each Class", fontsize=14)

plt.tight_layout()

plt.show()

# ==========================================
# Image Size Analysis
# ==========================================

sample_image = next((TRAIN_DIR / classes[0]).glob("*"))

img = plt.imread(sample_image)

print("=" * 50)
print("Image Information")
print("=" * 50)

print("Image Shape :", img.shape)
print("Height :", img.shape[0])
print("Width :", img.shape[1])

if len(img.shape) == 3:
    print("Channels :", img.shape[2])
else:
    print("Channels : Grayscale")

print("\nImage Data Type :", img.dtype)

print("Minimum Pixel Value :", img.min())

print("Maximum Pixel Value :", img.max())

# ==========================================
# Training Data Generator
# ==========================================

train_datagen = ImageDataGenerator(
    rescale=1./255,

    rotation_range=20,

    width_shift_range=0.2,

    height_shift_range=0.2,

    shear_range=0.15,

    zoom_range=0.15,

    horizontal_flip=True,

    fill_mode='nearest'
)

# ==========================================
# Validation Generator
# ==========================================

val_datagen = ImageDataGenerator(
    rescale=1./255
)
# ==========================================
# Testing Generator
# ==========================================

test_datagen = ImageDataGenerator(
    rescale=1./255
)
train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=True
)
val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)
test_gen = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)
# ==========================================
# Get One Batch of Images
# ==========================================

images, labels = next(train_gen)

print("Image Batch Shape :", images.shape)
print("Label Batch Shape :", labels.shape)
# ==========================================
# Display Augmented Images
# ==========================================

class_names = list(train_gen.class_indices.keys())

plt.figure(figsize=(15, 10))

for i in range(18):

    plt.subplot(3, 6, i + 1)

    plt.imshow(images[i])

    label = np.argmax(labels[i])

    plt.title(class_names[label])

    plt.axis("off")

plt.tight_layout()

plt.show()