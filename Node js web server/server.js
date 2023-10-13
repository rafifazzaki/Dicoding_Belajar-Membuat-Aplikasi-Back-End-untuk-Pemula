const http = require('http');
 
const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('X-Powered-By', 'NodeJS');
    response.setHeader('X-Explanation', 'customHeader using X, Case, and separate word with -');
    response.statusCode = 200;
 
    const {method, url} = request;

    if(url === '/'){

        if(method === 'GET') {
            response.end(JSON.stringify({
                message: 'Ini adalah homepage',
            }));
        }else{
            response.statusCode = 400;
            
            response.end(JSON.stringify({
                message: `Halaman tidak dapat diakses dengan ${method} request`,
            }));
        }
    }else if(url === '/about'){

        if(method === 'POST') {
            let body = [];
        
            request.on('data', (chunk) => {
                body.push(chunk);
            });
            
            request.on('end', () => {
                body = Buffer.concat(body).toString();
                let { name } = JSON.parse(body)
                response.end(JSON.stringify({
                    message: `Halo, ${name}! Ini adalah halaman about`,
                }));
            });
        }else if(method === 'GET'){

            response.end(JSON.stringify({
                message: 'Halo! Ini adalah halaman about',
            }));

        }else{
            response.statusCode = 400;
            response.end(JSON.stringify({
                message: 'Halaman tidak dapat diakses menggunakan ${method} request',
            }));
        }

    }else{
        response.statusCode = 404;
        response.end(JSON.stringify({
            message: 'Halaman tidak ditemukan!',
        }));
    }

    /*
    const { method } = request;
 
    if(method === 'GET') {
        response.end('<h1>Hello!</h1>');
    }
 
    if(method === 'POST') {
        let body = [];
    
        request.on('data', (chunk) => {
            body.push(chunk);
        });
        
        request.on('end', () => {
            body = Buffer.concat(body).toString();
            let { name } = JSON.parse(body)
            response.end(`<h1>Hai, ${name}!</h1>`);
        });
    }
 
    if(method === 'PUT') {
        response.end('<h1>Bonjour!</h1>');
    }
 
    if(method === 'DELETE') {
        response.end('<h1>Salam!</h1>');
    }
    */
};
 
const server = http.createServer(requestListener);
 
const port = 5000;
const host = 'localhost';
 
server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});