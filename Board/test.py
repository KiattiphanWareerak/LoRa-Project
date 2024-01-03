import subprocess

# Replace 'COMx' with the correct serial port of your ESP32
serial_port = 'COM4'

# Replace 'lora.py' with the name of your Python script
script_name = 'D:/Project/Board/lora.py'

try:
    # Upload the Python script to the ESP32
    subprocess.run(['ampy', '--port', serial_port, 'put', script_name])

    # Run the script on the ESP32
    subprocess.run(['ampy', '--port', serial_port, 'run', script_name])
except Exception as e:
    print(f"An error occurred: {e}")
