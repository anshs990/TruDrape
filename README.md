👗 TruDrape: AI-Powered 2D-to-3D Clothing Pipeline
TruDrape is a cloud-native generative AI system that automatically transforms 2D clothing images into high-fidelity 3D assets (.glb). It leverages Hunyuan3D-2.1 for geometry and texture synthesis, orchestrated entirely through Python and Microsoft Azure.

🚀 Project Overview
The goal of TruDrape is to solve the bottleneck in 3D e-commerce content creation.

Input: A standard 2D image of a garment (e.g., a shirt).

Process: The system detects the upload, spins up a GPU-accelerated container, and runs a generative AI pipeline.

Output: A textured 3D model ready for web viewing or virtual try-on.

🏗️ Architecture

The system follows a purely Python-based microservices pattern:

Component,Technology,Responsibility
Frontend,React / Next.js,User interface for image uploads and 3D visualization.
Orchestrator,Azure Functions (Python),"""Serverless"" manager that handles events, updates the database, and calls the AI engine."
AI Engine,FastAPI + Hunyuan3D,The core inference engine running on Azure Container Instances (GPU).
Storage,Azure Blob & SQL,"Stores raw images, generated assets, and request status metadata."

✨ Key FeaturesGenerative 3D: Uses Hunyuan3D-2.1 (Shape + Paint pipelines) to create realistic meshes and PBR textures.Event-Driven: Zero-touch automation. Uploading a file to Blob Storage automatically starts the pipeline.Scalable Backend: Built on FastAPI for high-performance, asynchronous model serving.Live Tracking: Real-time status updates (Queued $\rightarrow$ Processing $\rightarrow$ Ready) stored in Azure SQL.

🛠️ Installation & Setup
Prerequisites
Python 3.10+

Azure CLI

Docker

NVIDIA GPU (for local AI testing)

Visual Studio Build Tools 2022 (C++ Desktop Dev)

1. 🧬 AI Engine (The Muscle)
This service runs the heavy Hunyuan3D model.

cd trudrape-ai-engine

# 1. Install Dependencies
pip install -r requirements.txt
# (Ensure you have compiled the C++ rasterizers as per Hunyuan docs)

# 2. Download Model Weights
python download_model.py

# 3. Run the FastAPI Server
uvicorn main:app --host 0.0.0.0 --port 8001


2. 🧠 Azure Function (The Brain)
This service manages the workflow.

cd trudrape-manager

# 1. Setup Environment
# Ensure local.settings.json has your SQL and Blob connection strings

# 2. Start Locally
func start

3. 💻 Frontend (The Face)
The user interface.

cd frontend
npm install
npm run dev

☁️ Deployment Workflow
Push AI Engine: Build the Docker image containing Hunyuan3D and push to Azure Container Registry (ACR).

Deploy ACI: Spin up an Azure Container Instance with GPU support using the image.

Deploy Function: Publish the Python Orchestrator to Azure Functions.

Connect: Update the Function's AI_ENGINE_URL setting to point to the ACI's public address.

📦 API Reference
POST /generate (AI Engine)
Input: { "image_url": "https://..." }

Process:Downloads image $\rightarrow$ Generates Mesh $\rightarrow$ Paints Texture $\rightarrow$ Exports GLB.

Response: { "model_url": "https://...", "status": "success" }

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
