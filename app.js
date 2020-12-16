const hostname = '127.0.0.1';
const port = 3004;

import server from './routesPayPerform/routes_PayPerform';
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
