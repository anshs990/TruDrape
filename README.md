# TruDrape  
**Microsoft Imagine Cup 2026**

TruDrape is a web-based virtual clothing try-on platform that uses machine learning and 3D rendering to simulate how garments drape on an individual’s true body shape. By estimating body proportions from user images and generating a parametric 3D avatar, TruDrape enables realistic and interactive try-on experiences directly in the browser.

The platform addresses a major challenge in online fashion retail—high return rates due to poor fit—by improving size confidence, reducing waste, and enhancing the online shopping experience. Built using Microsoft Azure cloud services, TruDrape demonstrates how AI-powered body modeling can create more sustainable and accurate fashion ecommerce solutions.

---

## 🚀 Key Features

- **Photo-based body estimation**  
  Uses machine learning to infer body proportions from user-uploaded images.

- **Parametric 3D avatar generation**  
  Generates a scalable, adjustable 3D human model that reflects individual body shape.

- **Virtual clothing try-on**  
  Applies digital garments to the avatar to visualize realistic fit and drape.

- **Interactive 3D experience**  
  Rotate, zoom, and explore the avatar directly in the web browser.

- **Web-first architecture**  
  No special hardware required — runs entirely in the browser.

---

## 🧠 How It Works

1. **User uploads images** (front / side views).
2. **Machine learning models** extract body landmarks and proportions.
3. A **parametric 3D body model** is generated based on inferred measurements.
4. **Digital garments** are fitted to the avatar.
5. The result is rendered in real time using **3D web technologies**.

---

## 🏗️ System Architecture

- **Frontend**
  - React.js
  - Three.js (via WebGL) for 3D rendering

- **Backend**
  - FastAPI (Python)
  - Handles image uploads, ML inference requests, and asset delivery

- **Machine Learning**
  - Body landmark detection and proportion estimation
  - Parametric body modeling

- **Cloud Infrastructure (Microsoft Azure)**
  - Azure App Service – backend hosting
  - Azure Machine Learning – ML inference
  - Azure Blob Storage – image and 3D asset storage

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Three.js  
- **Backend:** FastAPI (Python)  
- **Machine Learning:** Computer Vision & Parametric Body Models  
- **Cloud:** Azure Machine Learning, Azure Blob Storage, Azure App Service  

---

## 🌍 Impact

TruDrape aims to reduce fashion ecommerce return rates caused by poor fit, which contribute significantly to financial loss and environmental waste. By enabling users to see how clothes truly drape on their body before purchasing, TruDrape promotes more confident buying decisions and supports a more sustainable fashion ecosystem.

---

## 👥 Team

TruDrape is developed by a two-person team from **Queen Mary University of London**, with backgrounds in machine learning, web development, and cloud-based systems. The team focuses on applying AI and 3D technologies to solve real-world problems with measurable impact.

---

## 📌 Imagine Cup Context

This project is developed as part of **Microsoft Imagine Cup 2026**, demonstrating the use of Microsoft Azure services to build innovative, AI-powered solutions with real-world relevance.

---

## 📄 License

This project is created for educational and competition purposes as part of Microsoft Imagine Cup 2026.
