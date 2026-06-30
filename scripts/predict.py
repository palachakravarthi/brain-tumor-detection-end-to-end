import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

MODEL_PATH = "models/best_vgg.keras"

CLASS_INFO = {
    "glioma": {
        "title": "Glioma Tumor",
        "description": "The AI model predicts that the MRI image most closely matches the Glioma category. Gliomas are tumors that arise from glial cells in the brain."
    },
    "meningioma": {
        "title": "Meningioma Tumor",
        "description": "The MRI image is predicted as Meningioma. These tumors develop in the membranes surrounding the brain and spinal cord."
    },
    "notumor": {
        "title": "No Tumor Detected",
        "description": "The uploaded MRI image does not show features matching the tumor categories used in this project."
    },
    "pituitary": {
        "title": "Pituitary Tumor",
        "description": "The AI model predicts that the MRI image belongs to the Pituitary Tumor category."
    }
}

CLASS_NAMES = list(CLASS_INFO.keys())

model = tf.keras.models.load_model(MODEL_PATH)


def predict_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img, verbose=0)

    index = np.argmax(prediction)

    confidence = float(np.max(prediction) * 100)

    label = CLASS_NAMES[index]

    return {
        "label": label,
        "title": CLASS_INFO[label]["title"],
        "confidence": confidence,
        "description": CLASS_INFO[label]["description"]
    }
if __name__ == "__main__":
    image_path = input("Enter image path: ")

    result = predict_image(image_path)

    print("\nPrediction Result")
    print("-------------------------")
    print("Condition :", result["title"])
    print(f"Confidence: {result['confidence']:.2f}%")
    print("Description:")
    print(result["description"])