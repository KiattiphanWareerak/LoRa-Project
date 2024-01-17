//---------------------------------------------------------------------//
async function loginRequest(values) {
  const message = { request: 'login', message: { status: 'success', data: undefined }};

  return message;
}
//---------------------------------------------------------------------// 
module.exports = {
  loginRequest
};
//---------------------------------------------------------------------//