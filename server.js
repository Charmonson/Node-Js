const http = require('http');  

const hostname= 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res)=> { /*createServer method creates basic server using basic http server class*/
    console.log(`Request for ${req.url} by method ${req.method}`); //response body

    if (req.method === 'GET'){
        let fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }
    const filePath= path.resolve ('./public' + fileUrl)//this method converst from relative to absolute path 
    const fileExt = path.extname(filePath);

        if(fileExt==='.html') {

            fs.access(filePath, err => { //this method lets us know if a file is accessible 
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content Type', 'text/html');
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not found </h1></body></html>`);
                    return;
                 }

                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'text/html');//tells client to expect an html doc

                 fs.createReadStream(filePath).pipe(res); //takes care of reading file content in small chunks
            }); 

        }  else {
            res.statusCode = 404;
            res.setHeader('Content Type', 'text/html');
            res.end(`<html><body><h1>Error 404: ${fileUrl} is nto an HTML file </h1></body></html>`)
        }
        
        
    } else {
        res.statusCode = 404;
        res.setHeader('Content Type', 'text/html');
        res.end(`<html><body><h1>Error 404: ${req.method}</h1></body></html>`)
    }

});//this informqtion will be send bac to the client

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});