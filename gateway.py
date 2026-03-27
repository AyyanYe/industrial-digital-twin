import serial
import json
import time
import paho.mqtt.client as mqtt
import ssl

# --- CONFIGURATION ---
SERIAL_PORT = "COM5"       
BAUD_RATE = 115200
MQTT_BROKER = "055b4bf179fd47febadfa84365e1037a.s1.eu.hivemq.cloud"
MQTT_USER = "admin"        
MQTT_PASS = "Gayassnigga123"  # Your Password
MQTT_TOPIC = "sensors/motor/data"  
MQTT_ADMIN_TOPIC = "motor/admin"

# Global Serial Variable (So on_message can access it)
ser = None 

# --- MQTT SETUP ---
client = mqtt.Client()
client.username_pw_set(MQTT_USER, MQTT_PASS)
client.tls_set(cert_reqs=ssl.CERT_NONE, tls_version=ssl.PROTOCOL_TLSv1_2)
client.tls_insecure_set(False)

# 1. NEW: Handle Incoming MQTT Messages (Cloud -> STM32)
def on_message(client, userdata, msg):
    global ser
    try:
        command = msg.payload.decode('utf-8')
        print(f"📥 Received Command: {command}")
        
        # Write to USB Serial (Send to STM32)
        if ser and ser.is_open:
            ser.write((command + "\n").encode('utf-8'))
            print("Sent to STM32")
        else:
            print("Serial not open, cannot send command")
            
    except Exception as e:
        print(f"Error handling message: {e}")

# 2. UPDATE: Subscribe on Connect
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to HiveMQ Cloud!")
        # Subscribe to the admin channel to hear the Backend
        client.subscribe(MQTT_ADMIN_TOPIC) 
        print(f"Listening on {MQTT_ADMIN_TOPIC}")
    else:
        print(f"Connection Failed (Code: {rc})")

client.on_connect = on_connect
client.on_message = on_message  # <--- Link the new function

# --- MAIN LOOP ---
try:
    print(f"Connecting to MQTT Broker: {MQTT_BROKER}...")
    client.connect(MQTT_BROKER, 8883, 60)
    client.loop_start() 

    print(f"Listening on {SERIAL_PORT}...")
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2) # Wait for board to reset

    while True:
        if ser.in_waiting > 0:
            # Read line from STM32
            line = ser.readline().decode('utf-8').strip()
            
            # Validate JSON
            if line.startswith("{") and line.endswith("}"):
                try:
                    data = json.loads(line)
                    
                    # Forward to Cloud
                    client.publish(MQTT_TOPIC, json.dumps(data))
                    print(f"Forwarded: {data}")
                    
                except json.JSONDecodeError:
                    pass 

except KeyboardInterrupt:
    print("\nStopping...")
    if ser: ser.close()
    client.disconnect()
except Exception as e:
    print(f"\nError: {e}")