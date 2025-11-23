# Industrial IoT Digital Twin 🏭

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech Stack](https://img.shields.io/badge/Stack-NestJS_|_Three.js_|_MQTT_|_FreeRTOS-blue)](https://github.com/AyyanYe)
[![Status](https://img.shields.io/badge/Status-Active_Development-green)]()

**A real-time industrial monitoring system featuring a 3D Digital Twin visualization.**

This project demonstrates an end-to-end IoT pipeline: from **bare-metal firmware** (simulated via Python/C++) to **cloud infrastructure**, ending in a high-performance **interactive frontend**. It is designed to simulate the monitoring of high-speed industrial motors, detecting anomalies in vibration and temperature.

---

## 🏗 System Architecture

The system follows an **Event-Driven Architecture** to ensure real-time performance and decoupling between hardware and software layers.

```mermaid
graph LR
    A["Industrial Motor (STM32/Sim)"] -- "MQTT (JSON)" --> B("Mosquitto Broker")
    B -- "TCP" --> C{"NestJS Gateway"}
    C -- "WebSockets (Socket.io)" --> D["React + Three.js Dashboard"]
    D -- "User Interaction" --> C
````

**Key Data Flow:**

1.  **Edge:** Sensor data is acquired (Simulated/Hardware) and packed into JSON payloads.
2.  **Transport:** Data is transmitted via **MQTT** to the central broker.
3.  **Ingestion:** **NestJS** acts as a hybrid microservice, consuming MQTT messages.
4.  **Visualization:** Data is broadcast via **WebSockets** to a **Next.js** frontend, driving a 3D model in real-time.

-----

## 🛠 Technology Stack

This project leverages a modern "Heavy" stack, bridging Embedded Systems with Full-Stack Web Development.

### **1. Firmware & Edge (The "Hard" Engineering)**

  * **Language:** Python (Simulation) / C++ (Target Hardware)
  * **Protocol:** MQTT (Message Queuing Telemetry Transport)
  * **Target Hardware:** STM32 Nucleo-64 / ESP32 (Planned)
  * **OS:** FreeRTOS (Planned for Hardware implementation)

### **2. Backend & Infrastructure (The "Systems" Layer)**

  * **Runtime:** Node.js (NestJS Framework)
  * **Architecture:** Microservices / Event-Driven
  * **Broker:** Eclipse Mosquitto (running in Docker)
  * **API:** REST & WebSockets (Socket.io)

### **3. Frontend (The "Product" Layer)**

  * **Framework:** Next.js (React)
  * **3D Engine:** Three.js (via React-Three-Fiber)
  * **Styling:** Tailwind CSS
  * **State:** React Context / Hooks

-----

## 📂 Project Structure

This repository uses a **Monorepo** structure to maintain version consistency across the stack.

```bash
├── infrastructure/   # Docker configurations (Mosquitto, DBs)
├── backend/          # NestJS API & MQTT Gateway
├── firmware-sim/     # Python-based Hardware Simulator (Digital Twin source)
└── frontend/         # Next.js + Three.js Dashboard (Coming Soon)
```

-----

## 🚀 Getting Started

### Prerequisites

  * **Docker & Docker Compose** (For Infrastructure)
  * **Node.js v18+** (For Backend/Frontend)
  * **Python 3.9+** (For Simulator)

### 1\. Launch Infrastructure

Start the MQTT Broker.

```bash
cd infrastructure
docker-compose up -d
```

### 2\. Start the Backend Gateway

Initialize the NestJS API which bridges MQTT to WebSockets.

```bash
cd backend/api
npm install
npm run start:dev
```

*The API will listen on Port 3001 and subscribe to the MQTT topic `sensors/motor/data`.*

### 3\. Run the Hardware Simulator

Simulate a motor sending telemetry data.

```bash
cd firmware-sim
# (Optional) Create venv: python -m venv venv && source venv/bin/activate
pip install paho-mqtt
python motor_sim.py
```

-----

## 🔮 Roadmap

  - [x] **Phase 1:** Infrastructure Setup (Docker/MQTT)
  - [x] **Phase 2:** Backend Gateway (NestJS MQTT-to-WebSocket)
  - [x] **Phase 3:** Hardware Simulation (Python)
  - [ ] **Phase 4:** 3D Visualization (Three.js/Next.js)
  - [ ] **Phase 5:** Hardware Implementation (STM32 + FreeRTOS)
  - [ ] **Phase 6:** Anomaly Detection (Simple ML Model)

-----

## 👤 Author

**Ayyan Ahmed** *M.Sc. Information & Communication Engineering | TU Darmstadt*

  * **GitHub:** [github.com/AyyanYe](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/AyyanYe)
  * **Focus:** Full-Stack Engineering & Embedded Systems

-----

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
