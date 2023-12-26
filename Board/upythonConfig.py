import subprocess
import sys
import time

# Function to check if a command is available
def is_command_available(command):
    try:
        subprocess.run([command, "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

# Check if esptool is installed
if not is_command_available("esptool"):
    print("esptool is not installed. Attempting to install...")
    
    try:
        # Install esptool using pip
        subprocess.run([sys.executable, "-m", "pip", "install", "esptool"], check=True)
        print("esptool installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install esptool: {e}")
        sys.exit(1)

# Prompt the user to enter the COM port number
port_num = input("Enter the COM port number: ")

while True:

    # Prompt the user to select the action
    action = input("What would you like to do?\n 1) Erase flash\n 2) Flash firmware\n 3) Both of them\n 4) Exit\n :")

    # Check the user's action choice and execute the corresponding esptool command
    if action == "1":
        subprocess.run(["esptool", "--chip", "esp32", "--port", f"COM{port_num}", "erase_flash"])
    elif action == "2":
        subprocess.run(["esptool", "--chip", "esp32", "--port", f"COM{port_num}", "write_flash", "-z", "0x1000", "D:/Project/firmware/ESP32_v1.20.0.bin"])
    elif action == "3":
        subprocess.run(["esptool", "--chip", "esp32", "--port", f"COM{port_num}", "erase_flash"])
        time.sleep(1)
        subprocess.run(["esptool", "--chip", "esp32", "--port", f"COM{port_num}", "write_flash", "-z", "0x1000", "D:/Project/firmware/ESP32_v1.20.0.bin"])
    elif action == "4":
        break       
    else:
        print("Invalid action choice. Please try again")

print("Good Bye")