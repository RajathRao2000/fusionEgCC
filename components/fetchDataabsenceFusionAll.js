'use strict';
var credImport=require('./cred.js')

// Documentation for writing custom components: https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// const fetch = require("node-fetch");

module.exports = {
  metadata: () => ({
    name: 'fetchDataabsenceFusionAll',
    properties: {
      input: { required: true, type: 'string'},
    },
    supportedActions: ['route1', 'route2']
  }),

  /**
   * invoke methods gets called when the custom component state is executed in the dialog flow
   * @param {CustomComponentContext} context 
   */
  invoke: async (context) => {
    let dataAbsenceAll=[];

await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/absences`,{
    method: 'get',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
    },
})
.then(response=>response.json())
.then(json=>{
  for(let i=0;i<=10;i++){
  // context.reply("PersonId: <b>"+json.items[i].personId+"</b>\n"+"startDate: "+json.items[i].startDate+"\n"+"endDate: "+json.items[i].endDate+"\n"+"comments: "+json.items[i].comments+"\n"+"absenceReason: "+json.items[i].absenceReason)
  dataAbsenceAll[i]={
    "PersonID": json.items[i].personId,
    "StartDate": json.items[i].startDate,
    "EndDate": json.items[i].endDate,
    "Comments": json.items[i].comments,
    "AbsenceReason": json.items[i].absenceReason
    }
  }
  context.variable("dataAbsAll",dataAbsenceAll)
  context.keepTurn(true)
  context.transition("route1")
})
.catch(error=>{
  context.reply('We are facing issues please try again')
  .transition('route2')
  console.log(error)})
  }
};
