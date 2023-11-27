import serial
import time

# กำหนดพอร์ต COM ของ ESP32
ser = serial.Serial('COMx', 115200, timeout=1)

# รอให้ ESP32 เริ่มต้น
time.sleep(2)

# ส่งคำสั่ง AT เพื่อขอข้อมูล DevEUI
ser.write(b'AT+DEVEUI?\r\n')
response = ser.readline().decode().strip()
print(f'DevEUI: {response}')

# ส่งคำสั่ง AT เพื่อกำหนดค่า AppKey (เปลี่ยนค่า 'YOUR_APP_KEY' เป็น AppKey ที่คุณต้องการใช้)
app_key = 'YOUR_APP_KEY'
ser.write(f'AT+APPKEY={app_key}\r\n'.encode())
response = ser.readline().decode().strip()
print(f'Set AppKey Response: {response}')

# ปิดพอร์ต
ser.close()
