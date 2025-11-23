import time
import json
import random
import paho.mqtt.client as mqtt

# Configuration
BROKER = "localhost"
PORT = 1883
TOPIC = "sensors/motor/data"

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with result code {rc}")

client = mqtt.Client()
client.on_connect = on_connect

print("Connecting to Broker...")
client.connect(BROKER, PORT, 60)

# Simulation Loop
try:
    while True:
        # Simulate Sensors
        payload = {
            "device_id": "STM32-MOTOR-01",
            "timestamp": time.time(),
            "temperature": round(random.uniform(45.0, 55.0), 2), # Celsius
            "vibration": round(random.uniform(0.1, 2.5), 3),     # G-force
            "status": "RUNNING"
        }

        # Publish
        client.publish(TOPIC, json.dumps(payload))
        print(f"Published: {payload}")
        
        # 100Hz simulation (Fast updates like real hardware!)
        time.sleep(0.1) 

except KeyboardInterrupt:
    print("Stopping Simulation")
    client.disconnect()