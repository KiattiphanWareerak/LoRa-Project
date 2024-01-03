//------------------------------IMPORTS--------------------------------// 
//---------------------------------------------------------------------// 
// import { displayListApplications } from '../services/display.js';
// import { checkUser } from "../services/db/dataBaseRequest.js";
// const worker = new Worker('../services/worker.js');
//-------------------------------Variable------------------------------// 
//---------------------------------------------------------------------// 
let respFromCheckUser, respFromAppsList;

//---------------------------------------------------------------------// 
//-------------------------SCRIPT FOR REQUEST--------------------------//
//---------------------------------------------------------------------//
export function loginRequest(items) {
  respFromCheckUser = checkUser(items);
  
  console.log(respFromCheckUser);

  if (respFromCheckUser.status == 'success') {
    alert('Welcome to ChripStack!');
    window.location.href = '../pages/applications.html';
  } else {
    return console.log('Login Failed.');
  }
}

export function applicationsList() {
  console.log(respFromCheckUser);

  worker.onmessage = function (event) {
    const { type, data, code } = event.data;
  
    switch (type) {
      case 'result':
        const respFromAppsList = data;
  
        if (respFromAppsList.status === 'success') {
          displayListApplications(respFromAppsList.message);
        } else {
          console.log('Applications List Request Failed.');
        }
        break;
      case 'close':
        console.log(`chirpStackRequest.js process closed with code ${code}`);
        break;
      default:
        break;
    }
  };
  
  // ส่งคำสั่งไปยัง worker
  worker.postMessage({
    command: 'appsListReq',
    tenant_id: respFromCheckUser.tenant_id
  });
}
//---------------------------------------------------------------------//

//-----------------------REFRESH CHECKING------------------------------//
// ตรวจสอบว่าอยู่ในหน้าไหน เพื่อดึงข้อมูลมาแสดงให้ใหม่ เมื่อมีการรีเฟรชหน้าจอ
// if (window.location.pathname === '/applicationsPage.html' || window.location.pathname === '/') {
//   mySocketService.send_listApplicationsRequest_to_server(data.user_tenantID, (err, resp_listApplicationsReq) => {
//     if (err) {
//         alert('error to req application list!');
//     } else {
//         displayListApplications(resp_listApplicationsReq);
//     }
//   });
// } else if (window.location.pathname === '/devicesPage.html') {
//   mySocketService.send_listDevicesRequest_to_server();
// }
//---------------------------------------------------------------------//