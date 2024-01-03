//---------------------------------------------------------------------//
//--------------------------SCRIPT FOR ORDER---------------------------//
//---------------------------------------------------------------------//
// import '../pages/scripts/login.js';
// import '../pages/scripts/applications.js'

function onLoadFunction() {
    const currentPath = window.location.pathname;

    if (currentPath === '/pages/applications.html') {
        console.log('Currently on the Applications Page.');
    } else if (currentPath === '/pages/index.html') {
        console.log('Currently on the Login Page.');
    } else {
        console.log('Currently on unknow page.');
    }
}

document.addEventListener("DOMContentLoaded", onLoadFunction);
// window.onload = onLoadFunction;

// // สร้าง event listener ให้รับทราบเมื่อผู้ใช้กำลังจะออกจากหน้าเว็บ
// window.onbeforeunload = function () {
//     // สามารถทำสิ่งที่คุณต้องการทำก่อนผู้ใช้ออกจากหน้าเว็บได้
//     console.log('User is leaving the page.');
// };
