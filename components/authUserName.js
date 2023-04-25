'use strict';
var credImport=require('./cred.js')

// Documentation for writing custom components: https://github.com/oracle/bots-node-sdk/blob/master/CUSTOM_COMPONENT.md

// You can use your favorite http client package to make REST calls, however, the node fetch API is pre-installed with the bots-node-sdk.
// Documentation can be found at https://www.npmjs.com/package/node-fetch
// Un-comment the next line if you want to make REST calls using node-fetch. 
// const fetch = require("node-fetch");
 
module.exports = {
  metadata: () => ({
    name: 'authUserName',
    properties: {
      input: { required: true, type: 'string' },
    },
    supportedActions: ['success', 'fail', "cancel"]
  }),


  /**
   * invoke methods gets called when the custom component state is executed in the dialog flow
   * @param {CustomComponentContext} context 
   */
  invoke: async (context,done) => {
    let userId=context.properties().input
    let check=false;

    if(userId=="cancel"){
      context.reply("Sure!")
      .reply("reply \"Hi\" to start")
      .keepTurn(true)
      .transition("cancel")
      done()
    }

    await fetch("https://api.jsonbin.io/v3/b/6445380f9d312622a3508399")
    .then(response => response.json())
    .then(json => {
      for(let i=0;i<=json.record.users.length-1;i++){
        if(json.record.users[i].userID==userId){
          check=true;
          break;
        }
      }
      
      if(check){
        context.reply("Verified!")
        .keepTurn(true)
        .transition("success")
        done()
      }else{
        context.reply("User not Found!")
        .keepTurn(true)
        .transition("fail")
        done()
      }
      // console.log(json.record.users)
    })
    .catch(error=>console.log(error))
  }
};
