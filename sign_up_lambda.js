'use strict';  
const AWS = require("aws-sdk");  
const dynamo = new AWS.DynamoDB.DocumentClient();  
exports.handler = (event, context, callback) => {    
  const contactInfo = {};    
  contactInfo.Item = {      
    "email_address": event.email,      
    "name": event.name,      
    "phone_number": event.phone    
  };    
  contactInfo.TableName = "EmailList";                        
  dynamo.put(contactInfo, callback); 
};
