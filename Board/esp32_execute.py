import subprocess

try:
    # Prompt the user to enter the COM port number
    port_num = input("Enter the COM port number: ")
    filePath = "D:/Project/Board/lora.py"

    # Run the ampy command to upload the Python script
    subprocess.run(["ampy", "--port", f"COM{port_num}", "put", filePath], check=True)
    print("Upload successful!")
    #subprocess.run(["ampy", "--port", f"COM{port_num}", "run", "checkFile.py"], check=True)

except subprocess.CalledProcessError as e:
    print(f"Error uploading file: {e}")
