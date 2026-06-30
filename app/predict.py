from fastapi import UploadFile
from app.supabase_client import supabase

import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO

# Load model only once when FastAPI starts
model = tf.keras.models.load_model("models/best_vgg.keras")

CLASS_NAMES = [
    "Glioma Tumor",
    "Meningioma Tumor",
    "No Tumor",
    "Pituitary Tumor"
]


def get_details(label):

    details = {

        "Glioma Tumor": {
            "description": "The AI model predicts that this MRI image most closely matches the Glioma Tumor category. Gliomas arise from glial cells in the brain.",
            "recommendation": "Please consult a neurologist immediately. Additional MRI review and biopsy may be required."
        },

        "Meningioma Tumor": {
            "description": "The MRI image appears similar to a Meningioma Tumor. These tumors develop from the meninges surrounding the brain.",
            "recommendation": "Consult a neurologist or neurosurgeon for further evaluation and treatment planning."
        },

        "No Tumor": {
            "description": "The AI model did not detect any visible signs of a brain tumor in this MRI image.",
            "recommendation": "Continue regular health checkups. If symptoms persist, consult your physician."
        },

        "Pituitary Tumor": {
            "description": "The MRI image appears similar to a Pituitary Tumor affecting the pituitary gland.",
            "recommendation": "Consult an endocrinologist or neurologist for hormonal evaluation and further diagnosis."
        }

    }

    return details[label]


def predict_image(file: UploadFile):

    image = Image.open(BytesIO(file.file.read())).convert("RGB")

    image = image.resize((224,224))

    image = np.array(image,dtype=np.float32)/255.0

    image = np.expand_dims(image,axis=0)

    prediction = model.predict(image,verbose=0)

    class_index = np.argmax(prediction)

    confidence = float(np.max(prediction))*100

    label = CLASS_NAMES[class_index]

    info = get_details(label)

    supabase.table("predictions").insert({

        "image_name": file.filename,
        "prediction": label,
        "confidence": confidence

    }).execute()

    return {

        "title": label,
        "prediction": label,
        "confidence": round(confidence,2),
        "description": info["description"],
        "recommendation": info["recommendation"]

    }