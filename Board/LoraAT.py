from machine import UART
# Tx = 16, Rx = 17
uart = UART(2, baudrate=115200, bits=8, parity=None, stop=1, timeout=1000)
uart.write("AT+CGATT\r\n")
print(uart.read().decode('utf-8'))