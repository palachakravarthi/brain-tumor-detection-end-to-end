import os
import sys
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint
)

# Add project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scripts.preprocessing import load_data
from models.custom_cnn import build_custom_cnn

# Load datasets
train_generator, validation_generator, test_generator = load_data()

# Build model
model = build_custom_cnn()

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.2,
    patience=3,
    verbose=1
)

checkpoint = ModelCheckpoint(
    "models/custom_cnn.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

# Train
history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=20,
    callbacks=[early_stop, reduce_lr, checkpoint]
)

# Save final model
model.save("models/custom_cnn_final.keras")

# Accuracy Plot
plt.figure(figsize=(8,5))
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title("Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()
plt.savefig("outputs/accuracy.png")
plt.close()

# Loss Plot
plt.figure(figsize=(8,5))
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title("Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()
plt.savefig("outputs/loss.png")
plt.close()

print("="*50)
print("Training Completed Successfully")
print("Best Model Saved: models/custom_cnn.keras")
print("Accuracy Graph: outputs/accuracy.png")
print("Loss Graph: outputs/loss.png")
print("="*50)