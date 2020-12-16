import url from 'url';
import fs from 'fs';


function checkValidAccount(Obj,fromaccno,toaccno){
  return new Promise((resolve,reject) => {
    let resfromaccno = Obj.userTable.filter(x => x.accountNo === fromaccno);
    let restoaccno = Obj.userTable.filter(x => x.accountNo === toaccno);
    if(resfromaccno.length > 0 && restoaccno.length > 0){
      resolve(true)
    }else{
      resolve(false)
    }
  });
}


exports.getAccountDetails = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  let dataObj;
  const data = fs.readFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
  if(data){
   dataObj = JSON.parse(data); //now it an object
   dataObj = dataObj.userTable.filter(x => x.accountNo === query.accountNo);
  }else{
  dataObj = {"userTable":"No Records Found"}; //now it an object
  }
  var response = [
    {
      "message": "succees",
      "statusCode":200,
      "info":"Account Details"
    },
    dataObj
  ];
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}


exports.tranferHistory = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  let dataObj;
  const data = fs.readFileSync('../bankpayperformAPI/dataStorePayPerform/transactionDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
  if(data){
   dataObj = JSON.parse(data); //now it an object
   dataObj = dataObj.transferTable.filter(x => x.from_account === query.accountNo);
  }else{
  dataObj = {"transferTable":"No Records Found"}; //now it an object
  }
  var response = [
    {
      "message": "succees",
      "statusCode":200,
      "info":"Transation history details"
    },
    dataObj
  ];
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}


exports.getUsers = function(req, res) {
  let dataObj;
  const data = fs.readFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
  if(data){
   dataObj = JSON.parse(data); //now it an object
  }else{
  dataObj = {"userTable":"No Records Found"}; //now it an object
  }
  var response = [
    {
      "message": "succees",
      "statusCode":200,
      "info":"List of user Details"
    },
    dataObj
  ];
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}





exports.serverStatus = function(req, res) {
  var response = [
    {
      "message": "Server Running Success"
    }
  ];
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}

exports.tranferMoney = function(req, res) {
  let body = '';
  let finaldataObjTrans;
  let finaldataObj;
  var response = {};
  req.on('data',  function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    let postBody = JSON.parse(body);
    const data = fs.readFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
    if (data) {
      let dataObj = JSON.parse(data); 
      let promiseObj = checkValidAccount(dataObj,postBody.from_account,postBody.to_account);
        promiseObj.then(function(value){
        if(value){
          dataObj.userTable.filter(x => x.accountNo === postBody.from_account).forEach(orginalData => orginalData.amount = (parseInt(orginalData.amount) - parseInt(postBody.tranfer_amount)));
          dataObj.userTable.filter(x => x.accountNo === postBody.to_account).forEach(orginalData => orginalData.amount = (parseInt(orginalData.amount) + parseInt(postBody.tranfer_amount)));
          finaldataObj = JSON.stringify(dataObj); 

          fs.writeFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json', finaldataObj,{flag:'w'}); 

          let dataObjtrans = {transferTable:[]};
          postBody.transactionDate = new Date();
          const dataTransaction = fs.readFileSync('../PayPerformBankAPI/dataStorePayPerform/transactionDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
          if (dataTransaction) {
            dataObjtrans = JSON.parse(dataTransaction); //now it an object
            dataObjtrans.transferTable.push(postBody); //add new data
            finaldataObjTrans = JSON.stringify(dataObjtrans); 
          } else {
            dataObjtrans.transferTable.push(postBody); //add first data
            finaldataObjTrans = JSON.stringify(dataObjtrans); //convert it back to json
          }
          fs.writeFileSync('../bankpayperformAPI/dataStorePayPerform/transactionDetails_PayPerform.json', finaldataObjTrans,{flag:'w'}); 
          response.message ="success";
          response.info =  "Transaction Completed Success!!";
          response.statusCode = 200;

        }else{
          response.message ="success";
          response.info =  "Account No Validation Fail";
          response.statusCode = 200;
        }

        res.statusCode = 201;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
      });
    } 
   
  })
}


exports.createUser = function(req, res) {
  let body = '';
  req.on('data',  function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    let postBody = JSON.parse(body);
    let dataObj = {userTable:[]};
    let finaldataObj;
    let accountNo = Math.floor(100000000 + Math.random() * 900000000);
    let accountid = Math.floor(10000 + Math.random() * 90000);
    let intialAmount ="500";
    postBody.accountid =accountid;
    postBody.accountNo ="PAY"+accountNo;
    postBody.amount =intialAmount;
    const data = fs.readFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json',{encoding:'utf8', flag:'r'}); 
    if (data) {
      dataObj = JSON.parse(data); //now it an object
      dataObj.userTable.push(postBody); //add new data
      finaldataObj = JSON.stringify(dataObj); 
    } else {
      dataObj.userTable.push(postBody); //add first data
      finaldataObj = JSON.stringify(dataObj); //convert it back to json
    }
    fs.writeFileSync('../bankpayperformAPI/dataStorePayPerform/userDetails_PayPerform.json', finaldataObj,{flag:'w'}); 
    var response = [
      {
      "message":"success",
      "info": "User added successfully",
      "statusCode":200,
      }
    ]

    res.statusCode = 201;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response))
  })
}

exports.invalidUrl = function(req, res) {
  var response = [
    {
    "message": "Page Not Found"
    }
  ]
  res.statusCode = 404;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}
