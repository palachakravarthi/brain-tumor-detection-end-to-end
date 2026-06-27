🧠 Brain Tumor Detection [End-to-End]

«An End-to-End Deep Learning project for automated Brain Tumor MRI classification using TensorFlow, Keras, Custom CNN, and VGG16 Transfer Learning.»

"Python" (https://img.shields.io/badge/Python-3.11-blue)
"TensorFlow" (https://img.shields.io/badge/TensorFlow-2.21-orange)
"Deep Learning" (https://img.shields.io/badge/Deep%20Learning-CNN-red)
"Status" (https://img.shields.io/badge/Status-In%20Progress-success)

---

📖 Project Overview

Brain tumors are among the most life-threatening neurological disorders. Accurate and early detection using Magnetic Resonance Imaging (MRI) plays a significant role in improving diagnosis and treatment planning.

This project presents an End-to-End AI-powered Brain Tumor Detection System capable of classifying MRI images into four categories using Deep Learning techniques.

The project is being developed as part of the Blackbucks Internship Program.

---

🎯 Objectives

- Develop an automated Brain Tumor Detection System.
- Perform MRI image preprocessing and augmentation.
- Train a Custom CNN model.
- Improve performance using VGG16 Transfer Learning.
- Evaluate model performance using multiple metrics.
- Build a deployment-ready AI application.

---

🧠 Brain Tumor Classes

- Glioma
- Meningioma
- Pituitary Tumor
- No Tumor

---

🛠 Technology Stack

Programming Language

- Python 3.11

Deep Learning

- TensorFlow
- Keras
- Custom CNN
- VGG16 Transfer Learning

Image Processing

- OpenCV
- NumPy
- Pillow

Data Analysis & Visualization

- Pandas
- Matplotlib
- Seaborn

Machine Learning

- Scikit-learn

Backend (Planned)

- FastAPI

Database (Planned)

- Supabase

Frontend (Planned)

- Lovable

---

📂 Project Structure

BrainTumorProject/
│
├── app/
├── dataset/
│
├── models/
│
├── notebooks/
│
├── outputs/
│
├── scripts/
│   └── dataset_analysis.py
│
├── utils/
│
├── main.py
├── requirements.txt
├── README.md
└── .gitignore

---

📊 Dataset

Dataset Name

Brain Tumor MRI Dataset

Source

Kaggle

https://www.kaggle.com/datasets/mohiburrahmanrifat/brain-tumor-mri

Dataset Statistics

Dataset| Images
Training| 5600
Validation| 800
Testing| 800
Total| 7200

Dataset Structure

Training/
    glioma/
    meningioma/
    notumor/
    pituitary/

Validation/
    glioma/
    meningioma/
    notumor/
    pituitary/

Testing/
    glioma/
    meningioma/
    notumor/
    pituitary/

«Note: The dataset is not included in this repository because of GitHub size limitations. Download it from Kaggle and place it inside the "dataset/" folder.»

---

🚀 Current Progress

- ✅ Project Setup
- ✅ Dataset Analysis
- ✅ Dataset Visualization
- ✅ Image Preprocessing
- ✅ Data Augmentation
- ⏳ Custom CNN Model
- ⏳ VGG16 Transfer Learning
- ⏳ Model Evaluation
- ⏳ FastAPI Integration
- ⏳ Supabase Integration
- ⏳ End-to-End Deployment

---

📸 Outputs

Dataset Class Distribution

"Dataset Class Distribution" (outputs/class_distribution.png)

---

Sample MRI Images

"Sample MRI Images" (outputs/sample_mri_images.png)

---

Augmented MRI Images

"Augmented MRI Images" (outputs/augmented_images.png)

---

⚙ Installation

git clone https://github.com/palachakravarthi/Brain-Tumor-Detection-End-to-End.git

cd Brain-Tumor-Detection-End-to-End

conda create -n braintumor python=3.11

conda activate braintumor

pip install -r requirements.txt

---

▶ Run

python scripts/dataset_analysis.py

---

📈 Future Enhancements

- EfficientNet
- MobileNetV2
- Vision Transformer (ViT)
- Explainable AI (Grad-CAM)
- REST API Deployment
- Docker Containerization
- Cloud Deployment

---

👨‍💻 Author

Palachakravarthi

AI • Machine Learning • Deep Learning • Data Engineering

GitHub: https://github.com/palachakravarthi

---

⭐ Acknowledgements

- Blackbucks Internship Program
- TensorFlow
- Kaggle
- OpenCV
- Scikit-learn

---

«If you found this project helpful, consider giving it a ⭐ on GitHub.»
