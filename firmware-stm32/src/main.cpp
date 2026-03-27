#include <Arduino.h>
#include <STM32FreeRTOS.h>
#include <ArduinoJson.h>

// --- Configuration ---
#define SERIAL_BAUD 115200
#define LED_PIN LED_BUILTIN // The Green LED on your board

volatile bool triggerReboot = false;

// --- Global Data ---
struct MotorData
{
    float temperature;
    float vibration;
    char status[16];
} currentData;

// --- Task Definitions ---
void TaskAcquireData(void *pvParameters);
void TaskTelemetry(void *pvParameters);
void TaskHeartbeat(void *pvParameters); // NEW: Visual check

void setup()
{
    // 1. Initialize Serial
    Serial.begin(SERIAL_BAUD);
    // Note: We removed the 'while(!Serial)' loop because it can hang if no monitor is open

    pinMode(LED_PIN, OUTPUT);

    // 2. Create Tasks (INCREASED STACK SIZES)
    xTaskCreate(TaskAcquireData, "Sensors", 256, NULL, osPriorityNormal, NULL);
    xTaskCreate(TaskTelemetry, "Comms", 1024, NULL, osPriorityNormal, NULL); // Increased to prevent crash
    xTaskCreate(TaskHeartbeat, "Blink", 128, NULL, osPriorityLow, NULL);

    // 3. Start Scheduler
    vTaskStartScheduler();
}

void loop()
{
    // Empty
}

// --- Task 1: Simulated Sensors & Z-Score Anomaly Detection ---
#define WINDOW_SIZE 50
float v_history[WINDOW_SIZE];
int v_index = 0;
bool buffer_full = false;

void TaskAcquireData(void *pvParameters)
{
    (void)pvParameters;
    // Initialize default status
    strncpy(currentData.status, "RUNNING", sizeof(currentData.status));

    for (;;)
    {
        float time = millis() / 1000.0;
        currentData.temperature = 45.0 + (5.0 * sin(time));
        currentData.vibration = (random(0, 100) / 100.0) * 0.5;
        
        if (random(0, 100) > 90)
            currentData.vibration += 1.5;

        // --- Z-Score Anomaly Detection Logic ---
        v_history[v_index] = currentData.vibration;
        v_index++;
        if (v_index >= WINDOW_SIZE) {
            v_index = 0;
            buffer_full = true;
        }

        if (buffer_full) {
            float sum = 0;
            for (int i=0; i<WINDOW_SIZE; i++) sum += v_history[i];
            float mean = sum / WINDOW_SIZE;
            
            float sq_diff_sum = 0;
            for (int i=0; i<WINDOW_SIZE; i++) sq_diff_sum += pow(v_history[i] - mean, 2);
            float std_dev = sqrt(sq_diff_sum / WINDOW_SIZE);
            if (std_dev < 0.01) std_dev = 0.01; // Avoid div by zero

            float z_score = fabs(currentData.vibration - mean) / std_dev;

            // Trigger anomaly if Z-Score > 3.0 (statistical outlier) or temperature is too high
            if (z_score > 3.0 || currentData.temperature > 50.0) {
                strncpy(currentData.status, "ANOMALY", sizeof(currentData.status));
            } else {
                strncpy(currentData.status, "RUNNING", sizeof(currentData.status));
            }
        }

        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

// --- Task 2: Telemetry & Command Listener ---
void TaskTelemetry(void *pvParameters)
{
    (void)pvParameters;

    for (;;)
    {
        // 1. READ: Check if computer sent a command
        if (Serial.available() > 0)
        {
            String command = Serial.readStringUntil('\n'); // Read line
            command.trim();                                // Remove whitespace

            if (command == "REBOOT")
            {
                Serial.println("ACK: REBOOTING...");
                vTaskDelay(pdMS_TO_TICKS(100)); // Give time to print

                // ASM command to Hard Reset the STM32
                NVIC_SystemReset();
            }
        }

        // 2. WRITE: Send Telemetry (Existing code)
        StaticJsonDocument<200> doc;
        doc["device_id"] = "STM32-REAL";
        doc["temperature"] = currentData.temperature;
        doc["vibration"] = currentData.vibration;
        doc["status"] = currentData.status;
        // ... (rest of your JSON logic) ...

        serializeJson(doc, Serial);
        Serial.println();

        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
// --- Task 3: Heartbeat ---
// Blinks the LED so you know the OS is alive
void TaskHeartbeat(void *pvParameters)
{
    (void)pvParameters;
    for (;;)
    {
        digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Toggle LED
        vTaskDelay(pdMS_TO_TICKS(500));               // Blink every 0.5s
    }
}