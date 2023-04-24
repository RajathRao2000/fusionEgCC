'use strict';
var credImport=require('./cred.js')
 
module.exports = {
  metadata: () => ({
    name: 'changeEmail',
    properties: {
      newEmail: { required: true, type: 'string' },
      code: { required: true, type: 'string' },
    },
    supportedActions: ['success', 'fail']
  }),

  /**
   * invoke methods gets called when the custom component state is executed in the dialog flow
   * @param {CustomComponentContext} context 
   */
  invoke: async (context,done) => {
    let url,mail;
    mail=context.properties().newEmail
    let usrIP=context.properties().code

await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/emps?q=PersonNumber=`+usrIP,{
    method: 'get',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
    },
})
.then(response=>response.json())
.then(async json=>{
  ////////////////////
  //code for patch
  console.log(json)
  url=json.items[0].links[0].href
  console.log(url)
context.logger().info(url)
var raw = JSON.stringify({
    "WorkEmail": mail,
  });

await fetch(url,{
    method: 'PATCH',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
        'Content-type': 'application/json'
    },
    body: raw,
})
.then(response=>response.json())
.then(json=>{
  console.log(json)
  context.transition("success")
  context.keepTurn(true);
  done();
})
.catch(error=>{
  console.log(error)
  context.transition("fail")
  context.keepTurn(true);
  done();
})
})
/////////////////////////endpatch
.catch(error=>{
  console.log(json)
  context.reply('fail')
  context.transition("fail")
  context.keepTurn(true);
  done();
})
}
};
