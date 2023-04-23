'use strict';
var credImport=require('./cred.js')

// Documentation for writing custom components: https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// const fetch = require("node-fetch");
 
module.exports = {
  metadata: () => ({
    name: 'fetchDataworkerFusion',
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
    let data="kelo"
    // Retrieve the value of the 'human' component property.
    let codeReceived=context.properties().input
//     let username='user_r13_a2f'
// let password='eIu4u%4%'
await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/workers?q=PersonNumber=${codeReceived}`,{
    method: 'get',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
    },
})
.then(response=>response.json())
.then(json=>{
  context.reply("PersonId: <b>"+json.items[0].PersonId+"</b>\n"+"Blood Type: "+json.items[0].BloodType+"\n"+"Date of Birth: "+json.items[0].DateOfBirth+"\n"+"DateOfDeath: "+json.items[0].DateOfDeath+"\n"+"CountryOfBirth: "+json.items[0].CountryOfBirth+"\n"+"Postal Code: "+json.items[0].PostalCode+"\n"+"DOB: "+json.items[0].DateOfBirth)
  context.keepTurn(true)
  context.transition("output")
})
.catch(error=>console.log(error))
context.keepTurn(true)
context.transition("output")

  }
};
