'use strict';
var credImport=require('./cred.js')
 
module.exports = {
  metadata: () => ({
    name: 'patchContactsData',
    properties: {
      input: { required: true, type: 'string' },
      code: { required: true, type: 'string' },
      FirstName: { required: true, type: 'string' },
      LastName: { required: true, type: 'string' },
      Phone: { required: true, type: 'string' },
      Email: { required: true, type: 'string' },
    },
    supportedActions: ['route1', 'route2']
  }),

  /**
   * invoke methods gets called when the custom component state is executed in the dialog flow
   * @param {CustomComponentContext} context 
   */
  invoke: async (context,done) => {
    let url,fn,ln,phn,mail,data;
    let codeReceived=context.properties().code
    let usrIP=context.properties().input
    let fname=context.properties().FirstName
    let lname=context.properties().LastName
    let phone=context.properties().Phone
    let email=context.properties().Email

     data = usrIP.split("|");

     fn = data[0];
     ln = data[1];
     mail = data[2];
     phn = data[3];
/////
//unnessesery


     context.variable("FirstNameCont", fn);
     context.variable("LastNameCont", mail);
     context.variable("phoneCont", phn);
     context.variable("emailCont", mail);
/////////////
    //  context.done(true);
    //  context.keepTurn(true);
//////////

//GET Data
// let username="user_r13_a2f"
// let password="dFw4E#6?"
await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/emps?q=PersonNumber=`+codeReceived,{
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

// let username="user_r13_a2f"
// let password="dFw4E#6?"

var raw = JSON.stringify({
    "FirstName": fn,
    "LastName": ln,
    "WorkMobilePhoneNumber": phn,
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
  context.transition("route1")
  context.keepTurn(true);
  done();
})
.catch(error=>{
  console.log(json)
  context.transition("route2")
  context.keepTurn(true);
  done();
})
})
/////////////////////////endpatch
.catch(error=>{
  console.log(json)
  context.reply('fail')
  context.transition("route2")
  context.keepTurn(true);
  done();
})
}
};
