# bankpayperformAPI
bankAPI(createuser,tranfermoney,history) for data stored in file

# API Detials
# get All user API
 GET http://127.0.0.1:3004/getusers

 # create User API
 POST http://127.0.0.1:3004/createuser

 var options = { 
        method: 'POST',
        url: 'http://127.0.0.1:3004/createuser',
        headers:{'content-type': 'application/json'},
        body: { name: 'SampleData', age: 27, DOB: '14/10/1990', phoneNo: 9597137990 },
        json: true 
    };


# Money Transfer API

POST http://127.0.0.1:3003/transfer

var options = { 
    method: 'POST',
    url: 'http://127.0.0.1:3003/transfer',
    headers: {'content-type': 'application/json' },
  body: 
   { from_account: 'PAY514540769',
     to_account: 'PAY913229477',
     tranfer_amount: 250 },
    json: true };

# Account Transaction History

GET http://127.0.0.1:3004/transferhistory?accountNo=PAY762430775

# Account Details

GET http://127.0.0.1:3004/getaccountdetails?accountNo=PAY913229477