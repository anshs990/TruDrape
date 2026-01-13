👗 TruDrape
AI-Powered 2D-to-3D Clothing Generation Pipeline

TruDrape is a cloud-native generative AI system that automatically converts 2D garment images into high-fidelity 3D assets (.glb).
It is designed to eliminate the 3D content creation bottleneck in fashion e-commerce and virtual try-on platforms.

The pipeline leverages Hunyuan3D-2.1 for geometry and texture synthesis, orchestrated entirely with Python and deployed on Microsoft Azure.

🚀 Project Overview

TruDrape transforms a single flat clothing image into a production-ready 3D model through an event-driven AI workflow.

Workflow

Input: 2D image of a garment (e.g., shirt, dress)

Processing:

Upload triggers a serverless orchestrator

A GPU-backed container runs the generative pipeline

Output:

Textured 3D .glb file

Ready for web viewers, AR, or virtual try-on

✨ Key Features

Generative 3D Modeling
Uses Hunyuan3D-2.1 (Shape + Paint pipelines) to generate realistic meshes and PBR textures.

Event-Driven Architecture
Uploading an image to Blob Storage automatically triggers the full pipeline—no manual intervention.

Scalable AI Backend
FastAPI-based inference engine optimized for asynchronous GPU workloads.

Live Status Tracking
Request lifecycle tracked in real time:
Queued → Processing → Ready

Cloud-Native by Design
Built for Azure using serverless orchestration and containerized GPU inference.


🏗️ Architecture

TruDrape follows a Python-first microservices architecture with strict separation of concerns.

System Diagram

graph LR
    A["User / Frontend"] -- Uploads Image --> B["Azure Blob Storage"]
    B -- Triggers Event --> C["Azure Function (Orchestrator)"]
    C -- Updates Status --> D["Azure SQL Database"]
    C -- Calls API --> E["AI Engine (ACI + GPU)"]
    E -- Generates & Uploads 3D --> B
    E -- Returns Success --> C


| Component        | Technology                     | Responsibility                                   |
| ---------------- | ------------------------------ | ------------------------------------------------ |
| **Frontend**     | React / Next.js                | Image upload UI and 3D model preview             |
| **Orchestrator** | Azure Functions (Python)       | Event handling, job coordination, status updates |
| **AI Engine**    | FastAPI + Hunyuan3D-2.1        | 3D generation and texture synthesis              |
| **Storage**      | Azure Blob Storage & Azure SQL | Stores images, models, and job metadata          |


🛠️ Installation & Setup
Prerequisites

Python: 3.10+

Docker

Azure CLI

NVIDIA GPU (local testing, ≥ 6GB VRAM)

Visual Studio Build Tools 2022

C++ Desktop Development (for rasterizers)

🧬 AI Engine (Inference Service)

This service performs the heavy 3D generation using Hunyuan3D.

cd trudrape-ai-engine

# Install dependencies
pip install -r requirements.txt
# Ensure C++ rasterizers are compiled per Hunyuan3D documentation

# Download model weights
python download_model.py

# Run FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8001


🧠 Orchestrator (Azure Function)

Manages workflow orchestration and system state.
cd trudrape-manager

# Configure local.settings.json
# Add Blob Storage and SQL connection strings

# Run locally
func start

💻 Frontend

User-facing interface for uploads and visualization.

cd frontend
npm install
npm run dev


☁️ Deployment Workflow

Build AI Engine Image

Dockerize the FastAPI + Hunyuan3D service

Push image to Azure Container Registry (ACR)

Deploy GPU Container

Launch Azure Container Instance (ACI) with GPU support

Deploy Orchestrator

Publish Python Azure Function

Connect Services

Set AI_ENGINE_URL in Function App settings to ACI endpoint


📦 API Reference
POST /generate

Description:
Generates a 3D model from a provided image URL.

Request

{
  "image_url": "https://example.com/image.jpg"
}


Processing Steps

Download image

Generate mesh (Shape pipeline)

Apply textures (Paint pipeline)

Export .glb

Response

{
  "model_url": "https://example.com/output.glb",
  "status": "success"
}

🤝 Contributing

Contributions are welcome.

Fork the repository

Create a feature branch

Submit a pull request

For major changes, please open an issue first to discuss the proposal.

