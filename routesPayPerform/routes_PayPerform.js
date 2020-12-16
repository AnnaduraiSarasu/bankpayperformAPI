import http from 'http';
import url from 'url';
import Contorller from '../controllerPayPerform/controller_PayPerform'

 const server = http.createServer((req, res) => {
    const reqUrl =  url.parse(req.url, true);
    // GET 
    if(req.method === 'GET') {
      if(reqUrl.pathname == '/'){
        Contorller.serverStatus(req, res);
      }
      else if(reqUrl.pathname == '/getusers'){
        Contorller.getUsers(req, res);
      }
      else if(reqUrl.pathname == '/transferhistory'){
        Contorller.tranferHistory(req, res);
      }
      else if(reqUrl.pathname == '/getaccountdetails'){
        Contorller.getAccountDetails(req, res);
      }
      else{
        Contorller.invalidUrl(req, res);
      }
      
    }
    // POST 
    else if(req.method === 'POST') {

      if(reqUrl.pathname == '/createuser'){
        Contorller.createUser(req, res);
      }
      else if(reqUrl.pathname == '/transfer'){
        Contorller.tranferMoney(req, res);
      }
      else{
        Contorller.invalidUrl(req, res);
      }
    }
  
  })

export default server;