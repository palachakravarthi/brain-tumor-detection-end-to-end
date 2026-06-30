"""
=========================================
Brain Tumor Detection - Preprocessing
=========================================

Author : Uppu Palachakravarthi
Project: Brain Tumor Detection [End-to-End]

This script:
1. Loads the MRI dataset
2. Resizes all images
3. Normalizes pixel values
4. Applies data augmentation to training images
5. Creates train, validation and test generators
"""

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ==========================================
# Configuration
# ==========================================

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

TRAIN_DIR = "dataset/Training"
VALIDATION_DIR = "dataset/Validation"
TEST_DIR = "dataset/Testing"

# ==========================================
# Training Data Augmentation
# ==========================================

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,

    rotation_range=20,

    width_shift_range=0.20,

    height_shift_range=0.20,

    zoom_range=0.20,

    shear_range=0.20,

    horizontal_flip=True,

    fill_mode="nearest"
)

# ==========================================
# Validation Data
# ==========================================

validation_datagen = ImageDataGenerator(
    rescale=1.0 / 255
)

# ==========================================
# Testing Data
# ==========================================

test_datagen = ImageDataGenerator(
    rescale=1.0 / 255
)

# ==========================================
# Load Training Dataset
# ==========================================

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=True
)

# ==========================================
# Load Validation Dataset
# ==========================================

validation_generator = validation_datagen.flow_from_directory(
    VALIDATION_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# ==========================================
# Load Testing Dataset
# ==========================================

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# ==========================================
# Dataset Summary
# ==========================================

print("\n===================================")
print(" DATASET PREPROCESSING COMPLETED ")
print("===================================")

print(f"Training Images   : {train_generator.samples}")
print(f"Validation Images : {validation_generator.samples}")
print(f"Testing Images    : {test_generator.samples}")

print("\nClass Labels")

for class_name, class_index in train_generator.class_indices.items():
    print(f"{class_index} --> {class_name}")

print("\nImage Size :", IMAGE_SIZE)
print("Batch Size :", BATCH_SIZE)

print("===================================\n")

# ==========================================
# Function
# ==========================================

def load_data():

    """
    Returns
    -------
    train_generator
    validation_generator
    test_generator
    """

    return (
        train_generator,
        validation_generator,
        test_generator
    )

# ==========================================
# Main
# ==========================================

if __name__ == "__main__":

    load_data()