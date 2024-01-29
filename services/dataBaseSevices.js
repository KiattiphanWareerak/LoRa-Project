//---------------------------------------------------------------------//
async function applicationListMatchingRequest(globalUserToken, respFromChirpStack) {
  try {
    return new Promise((resolve, reject) => {
      let dataFromDatabase = {
        resultList: {
          '3dd0a4e2-e7d1-4560-a6a4-734f8c254432': true,
          '3dd0a4e2-e7d1-4560-a6a4-734f8c254321': true,
          '3dd0a4e2-e7d1-4560-a6a4-734f8c222cdb': true,
          'a4c5f426-97bb-4713-b89b-b67f49dfae29': true,
          '6e6e1f9d-4f84-47e4-be17-43b94ccff086': true,
          '831b4b4a-c337-40da-8b70-8e50067e6b30': true
        }
      };

      let matchedApplications = [];
      respFromChirpStack.resultList.forEach(application => {
        if (dataFromDatabase.resultList[application.id]) {
          matchedApplications.push(application);
        }
      });

      let matchedData = {
        totalCount: matchedApplications.length,
        resultList: matchedApplications
      };

      const resp = { request: 'dispApp', message: { 
        status: 'success', 
        data: { app_list: matchedData } 
      }};
      console.log(resp);

      resolve(resp);
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function loginRequest(values) {
  const message = { request: 'login', message: { 
    status: 'success', 
    data: { user_token: "83b547ed-667e-4fdf-b2e7-548b53af1afe", 
            api_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6ImIyODg5NjU1LWM5ODUtNDVmNi05YTBhLTNmODEzMzJkNjgzNCIsInR5cCI6ImtleSJ9.agvFQkC8fFaX2mQeK61UGXfLMwtsVmslK3BD_T2SqOI",
            tenant_id: "52f14cd4-c6f1-4fbd-8f87-4025e1d49242"
          } 
  }};

  return message;
}
//---------------------------------------------------------------------// 
module.exports = {
  applicationListMatchingRequest,
  loginRequest
};
//---------------------------------------------------------------------//