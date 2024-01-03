import { checkUser } from "./db/dataBaseRequest.js";
import { tenant_id, storeTenantId } from "./stores/storeVariable.js";

export function loginRequest(items) {
  let respFromCheckUser = checkUser(items);

  if (respFromCheckUser.status == 'success') {     
    storeTenantId(respFromCheckUser);

    console.log(tenant_id);
    alert('Welcome to ChripStack!');
    window.location.href = '../pages/applications.html';
  } else {
      console.log('Login Failed.');
  }
}