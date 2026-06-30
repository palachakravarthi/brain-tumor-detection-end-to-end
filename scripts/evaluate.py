import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.preprocessing.image import ImageDataGenerator

MODEL_PATH = "models/custom_cnn.keras"
TEST_DIR = "dataset/Testing"

IMG_SIZE = (224,224)
BATCH_SIZE = 32

model = tf.keras.models.load_model(MODEL_PATH)

test_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
    class_mode="categorical"
)

loss, accuracy = model.evaluate(test_gen)

print("="*60)
print("CUSTOM CNN RESULTS")
print("="*60)
print(f"Accuracy : {accuracy:.4f}")
print(f"Loss     : {loss:.4f}")

pred = model.predict(test_gen)

y_pred = np.argmax(pred, axis=1)
y_true = test_gen.classes

print(classification_report(
    y_true,
    y_pred,
    target_names=test_gen.class_indices.keys()
))

cm = confusion_matrix(y_true,y_pred)

plt.figure(figsize=(7,6))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=test_gen.class_indices.keys(),
    yticklabels=test_gen.class_indices.keys()
)

plt.title("Custom CNN Confusion Matrix")
plt.tight_layout()

os.makedirs("outputs", exist_ok=True)
plt.savefig("outputs/custom_cnn_confusion_matrix.png", dpi=300)

plt.show()

print("\nSaved : outputs/custom_cnn_confusion_matrix.png")