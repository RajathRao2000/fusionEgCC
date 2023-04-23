'use strict';
var credImport=require('./cred.js')

// Documentation for writing custom components: https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// const fetch = require("node-fetch");
 
module.exports = {
  metadata: () => ({
    name: 'fetchDataFusionAddress',
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
    // Retrieve the value of the 'human' component property.
    let codeReceived=context.properties().input

await fetch(`https://fa-${credImport.server}-saasfademo1.ds-fa.oraclepdemos.com//hcmRestApi/resources/11.13.18.05/emps?q=PersonNumber=${codeReceived}`,{
    method: 'get',
    headers: {
        'Authorization': 'Basic '+btoa(credImport.userName+':'+credImport.password),
    },
})
.then(response=>response.json())
.then(json=>{
  let name,address,city,postal,dataAdd;
  name=json.items[0].DisplayName
  address=json.items[0].AddressLine1
  postal=json.items[0].PostalCode
  city=json.items[0].City

  dataAdd=[
    {
        "website": "http://www.sample.com",
        "keywords": "select",
        "imageUrl": "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        "name": name,
        "description": "Address: "+address+"\nPostal-Code: "+postal+"\nCity: "+city
    }
] 

  // context.reply("Name: <b>"+json.items[0].DisplayName+"</b>\n"+"\n"+"Address: "+json.items[0].AddressLine1+"\n"+"City: "+json.items[0].City+"\n"+"Postal Code: "+json.items[0].PostalCode+"\n"+"DOB: "+json.items[0].DateOfBirth)
  context.variable("dataAdd",dataAdd)
  context.keepTurn(true)
  context.transition("output")
  })  
  .catch(error=>{
    context.reply('not found')
    context.keepTurn(true)
    context.transition("output")
    console.log(error)})
  }}
