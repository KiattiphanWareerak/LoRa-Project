# Welcome to LoRa Communication Management Web Application.
This project is to develop a web application to manage connections between LoRa devices in the network using the ChirpStack API.

# Getting Started.
1. Install Node.JS on your computer
2. Clone this repository
```
git clone https://github.com/KiattiphanWareerak/LoRa-Project.git
```
3. Open the terminal in LoRa-Project directory
4. Run the Web server (public_server.js)
```
npm run start-web
```
5. Run the service server (service_server.js)
```
npm run start-service
```
6. Open your browser and enter ```localhost:3111```

# Example output.
Web server:
```
PS C:\LoRa-Project> npm run start-web    

> lora-web-application@1.0.0 start-web
> node public_server.js

Web appliction is running at http://localhost:3111/
```
Service server:
```
PS C:\LoRa-Project> npm run start-service

> lora-web-application@1.0.0 start-service
> node service_server.js

Service is running at http://0.0.0.0:3333/
```