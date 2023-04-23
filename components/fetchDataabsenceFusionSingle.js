'use strict';
var credImport=require('./cred.js')
 
module.exports = {
  metadata: () => ({
    name: 'fetchDataabsenceFusionSingle',
    properties: {
      input: { required: true, type: 'string' },
    },
    supportedActions: ['route1', 'route2']
  }),


  /**
   * invoke methods gets called when the custom component state is executed in the dialog flow
   * @param {CustomComponentContext} context 
   */
  invoke: async (context) => {
    let codeReceived=context.properties().input

await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/absences?q=personNumber=${codeReceived}`,{
    method: 'get',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
    },
})
.then(response=>response.json())
.then(json=>{
  let data=[]
  for(let i=0;i<=3;i++){
  // context.reply("PersonId: <b>"+json.items[i].personId+"</b>\n"+"startDate: "+json.items[i].startDate+"\n"+"endDate: "+json.items[i].endDate+"\n"+"comments: "+json.items[i].comments+"\n"+"absenceReason: "+json.items[i].absenceReason)
  data[i]={
    "PersonID": json.items[i].personId,
    "StartDate": json.items[i].startDate,
    "EndDate": json.items[i].endDate,
    "Comments": json.items[i].comments,
    "AbsenceReason": json.items[i].absenceReason
  }
  }
  context.variable("data",data)
  context.keepTurn(true)
  context.transition("route1")
})
.catch(error=>{
  context.reply('not found')
  context.keepTurn(true)
  context.transition("route2")
  console.log(error)})  
}
};
