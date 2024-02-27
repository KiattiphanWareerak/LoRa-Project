// ขออนุญาตจากผู้ใช้
// navigator.serial.requestPort().then(port => {
//     // แสดงรายชื่อ COM PORT
//     console.log('COM Port:', port.getInfo().usbProductId);
  
//     // ส่ง AT Command
//     // port.write('AT+CGREG?\r\n', () => {
//     //   // รับ DevEUI
//     //   port.on('data', data => {
//     //     console.log('DevEUI:', data.toString().trim());
//     //   });
//     // });
//   });
document.getElementById("myButton").addEventListener("click", function() {
    navigator.serial.requestPort().then(port => {
        // แสดงรายชื่อ COM Port
        const portList = document.getElementById("portList");
        portList.innerHTML = "";

        for (const port of ports) {
            const listItem = document.createElement("li");
            listItem.textContent = port.getInfo().usbProductId;
            portList.appendChild(listItem);
        }
    });
});

  