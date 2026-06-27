🧠 Brain Tumor MRI Classification using Deep Learning

<p align="center"><img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python"/><img src="https://img.shields.io/badge/TensorFlow-2.21-orange?style=for-the-badge&logo=tensorflow"/><img src="https://img.shields.io/badge/Deep%20Learning-CNN-red?style=for-the-badge"/><img src="https://img.shields.io/badge/Status-In%20Progress-success?style=for-the-badge"/><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/></p>---

<p align="center">🧠 Brain Tumor MRI Classification

End-to-End Deep Learning Project for Brain Tumor Detection using MRI Images

Developed using TensorFlow • Keras • Python • Transfer Learning

</p>---

📑 Table of Contents

- 📌 Project Overview
- 🎯 Objectives
- 🧠 Brain Tumor Classes
- 🛠️ Technology Stack
- 📂 Project Structure
- 📊 Dataset
- 📷 Outputs
- 🚀 Installation
- ▶️ Run Project
- 📈 Current Progress
- 🛣️ Future Roadmap
- 🤝 Contributing
- 👨‍💻 Author
- 🙏 Acknowledgements
- 📜 License

---

📌 Project Overview

Brain tumors are among the most life-threatening neurological disorders. Accurate diagnosis from MRI scans is essential for timely treatment.

This project focuses on building an End-to-End Brain Tumor Classification System capable of identifying four different classes of brain MRI images using Deep Learning.

The current phase includes:

- Dataset Analysis
- Data Visualization
- Dataset Validation
- Project Structure Setup

Future phases include:

- Custom CNN
- Transfer Learning
- Model Evaluation
- FastAPI Backend
- Deployment

---

🎯 Objectives

✅ Analyze Brain MRI Dataset

✅ Visualize Class Distribution

✅ Validate Dataset Integrity

✅ Build Deep Learning Pipeline

✅ Train CNN Models

✅ Compare Transfer Learning Models

✅ Deploy using FastAPI

---

🧠 Brain Tumor Classes

Class| Description
🟥 Glioma| Brain Tumor
🟨 Meningioma| Brain Tumor
🟩 No Tumor| Healthy Brain
🟦 Pituitary| Pituitary Tumor

---

🛠️ Technology Stack

Programming

- Python 3.11

Deep Learning

- TensorFlow
- Keras
- Custom CNN
- VGG16
- ResNet50V2
- EfficientNetB0
- MobileNetV2

Machine Learning

- Scikit-Learn

Image Processing

- OpenCV
- Pillow
- NumPy

Data Analysis

- Pandas
- Matplotlib
- Seaborn

Backend (Planned)

- FastAPI

Database (Planned)

- Supabase

---

📂 Project Structure

BrainTumorProject/
│
├── app/                      # FastAPI backend
├── dataset/                  # MRI dataset (not uploaded)
│   ├── Training/
│   ├── Validation/
│   └── Testing/
│
├── models/                   # Saved models
├── notebooks/                # Jupyter notebooks
├── outputs/                  # Generated graphs & results
├── scripts/
│   └── dataset_analysis.py
│
├── main.py
├── requirements.txt
├── README.md
├── .gitignore
└── LICENSE

---

📊 Dataset

Source

Kaggle – Brain Tumor MRI Dataset

Dataset Statistics

Dataset| Images
Training| 5600
Validation| 800
Testing| 800
Total| 7200

«Note: The dataset is not included in this repository because of GitHub file size limitations. Download it from Kaggle and place it inside the "dataset/" folder.»

---

📷 Outputs

📊 Dataset Class Distribution

"Class Distribution" (outputs/class_distribution.png)

---

🧠 Sample MRI Images

"Sample MRI Images" (outputs/sample_mri_images.png)

---

🖼️ MRI Dataset Visualization

"MRI Samples" (outputs/mri_samples.png)

---

📈 Dataset Summary

"Dataset Summary" (outputs/dataset_summary.png)

---

📏 Image Information

"Image Information" (outputs/image_information.png)

---

🚀 Installation

Clone the repository:

git clone https://github.com/palachakravarthi/BrainTumorProject.git

Move into the project folder:

cd BrainTumorProject

Create a Conda environment:

conda create -n braintumor python=3.11

Activate it:

conda activate braintumor

Install dependencies:

pip install -r requirements.txt

---

▶️ Run Project

Run dataset analysis:

python scripts/dataset_analysis.py

---

📈 Current Progress

Task| Status
Project Setup| ✅
Dataset Analysis| ✅
Dataset Visualization| ✅
Image Validation| ✅
Data Preprocessing| 🔄
Data Augmentation| 🔄
CNN Model| ⏳
Transfer Learning| ⏳
Model Evaluation| ⏳
FastAPI API| ⏳
Deployment| ⏳

---

🛣️ Future Roadmap

- Custom CNN
- VGG16
- ResNet50V2
- EfficientNetB0
- MobileNetV2
- Vision Transformer (ViT)
- Explainable AI (Grad-CAM)
- REST API using FastAPI
- Docker Support
- Cloud Deployment

---

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

👨‍💻 Author

Palachakravarthi

Senior Data Engineer | AI & Machine Learning Enthusiast

GitHub: https://github.com/palachakravarthi

---

🙏 Acknowledgements

- Blackbucks Internship Program
- Kaggle
- TensorFlow
- OpenCV
- Scikit-Learn
- Python Community

---

📜 License

This project is licensed under the MIT License.

---

<p align="center">⭐ If you found this project useful, please consider giving it a Star! ⭐

</p>
