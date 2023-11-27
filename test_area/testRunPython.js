// runPython.js
const { exec } = require('child_process');

// เรียกใช้ไฟล์ Python
const pythonProcess = exec('python hello.py', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  // ดึงค่าที่ได้จาก Python script
  const randomValue = parseInt(stdout.trim(), 10);
  console.log(`Random number from Python: ${randomValue}`);

  // ทำสิ่งที่คุณต้องการด้วยค่านี้
  // เช่น นำค่าไปใช้ใน JavaScript
  // ...

});

// รอให้กระบวนการ Python ทำงานเสร็จสิ้น
pythonProcess.on('exit', (code) => {
  console.log(`Child process exited with code ${code}`);
});
