import os
import sys

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import tensorflow as tf
import matplotlib.pyplot as plt

from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint
)
from tensorflow.keras.optimizers import Adam

from models.vgg16_model import build_vgg16_model
from scripts.preprocessing import load_data

# ===========================
# Load Dataset
# ===========================

train_generator, validation_generator, test_generator = load_data()

# ===========================
# Build Model
# ===========================

model = build_vgg16_model()

print(model.summary())

# ===========================
# Callbacks
# ===========================

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.2,
    patience=3,
    verbose=1
)

checkpoint = ModelCheckpoint(
    "models/vgg16.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

# ===========================
# Initial Training
# ===========================

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=5,
    callbacks=[early_stop, reduce_lr, checkpoint]
)

# Save model
model.save("models/vgg16_final.keras")

# ===========================
# Fine Tuning
# ===========================

base_model = model.layers[0]
base_model.trainable = True

# Freeze all except last 4 layers
for layer in base_model.layers[:-4]:
    layer.trainable = False

model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

history_finetune = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=3,
    callbacks=[early_stop, reduce_lr, checkpoint]
)

model.save("models/vgg16_finetuned.keras")

# ===========================
# Accuracy Plot
# ===========================

plt.figure(figsize=(8,5))
plt.plot(history.history["accuracy"], label="Training Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
plt.title("VGG16 Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()
plt.savefig("outputs/vgg16_accuracy.png")
plt.close()

# ===========================
# Loss Plot
# ===========================

plt.figure(figsize=(8,5))
plt.plot(history.history["loss"], label="Training Loss")
plt.plot(history.history["val_loss"], label="Validation Loss")
plt.title("VGG16 Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()
plt.savefig("outputs/vgg16_loss.png")
plt.close()

# ===========================
# Training Summary
# ===========================

print("=" * 60)
print("VGG16 TRAINING COMPLETED SUCCESSFULLY")
print("=" * 60)

print(f"Training Accuracy      : {history.history['accuracy'][-1]:.4f}")
print(f"Validation Accuracy    : {history.history['val_accuracy'][-1]:.4f}")
print(f"Training Loss          : {history.history['loss'][-1]:.4f}")
print(f"Validation Loss        : {history.history['val_loss'][-1]:.4f}")

print()
print("Best Model Saved : models/vgg16.keras")
print("Final Model Saved: models/vgg16_finetuned.keras")
print("Accuracy Graph   : outputs/vgg16_accuracy.png")
print("Loss Graph       : outputs/vgg16_loss.png")
print("=" * 60)