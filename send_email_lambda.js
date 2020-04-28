// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//reference: https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/

var AWS = require('aws-sdk');
var toAddresses = []
//get list of email subscribers from dynamo
var dynamo = new AWS.DynamoDB.DocumentClient(); 
var params = {
    TableName : "EmailList",
    FilterExpression: "#opt_in = :opt_in_val",
    ExpressionAttributeNames: {
        "#opt_in": "opt_in",
    },
    ExpressionAttributeValues: { ":opt_in_val": true }
};


var count = 0;
var scanExecute = function(callback, emailParams,param) {
    dynamo.scan(params,function(err,data) {
        if(err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            return;
        } else {
            console.log("Scan succeeded." + data.Items.length);
            data.Items.forEach(function(itemdata) {
                toAddresses.push(itemdata.email_address)
                console.log("Item :", ++count,JSON.stringify(itemdata));
            });
            if(typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                scanExecute(callback, emailParams,param);              
            } else {
                callback(toAddresses, emailParams,param);
            }   
        }
    });
}

function sendEmail(toAddresses, emailParams,param){
    emailParams.Destination= {
        ToAddresses: toAddresses
    };
    let callback = param.callback;
    let context = param.context;
    let event = param.event;
   ses.sendEmail(emailParams, function (err, data) {
   callback(null, {err: err, data: data});
   if (err) {
       console.log(err);
       context.fail(err);
   } else {
       console.log(data);
       context.succeed(event);
   }
});
}
var ses = new AWS.SES({region: 'us-east-1'});
exports.handler = (event, context, callback) => {
    let foodPlace = event.place
    let foodType = event.type
    var emailParams = {
        Message: {
            Body: {
                Text: { 
                    Data: `Food spotted at ${foodPlace}! Food type: ${foodType}`
                }
            },
            Subject: { 
                Data: `Food spotted at ${foodPlace}! Food type: ${foodType}`
            }
        },
        Source: "example@example.com"
    };
     scanExecute(sendEmail, emailParams,{context,callback, event}); 
};
