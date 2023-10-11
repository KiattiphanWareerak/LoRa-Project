const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let fileName = '.' + q.pathname;

    if (fileName === './' || fileName === './login.html') {
        fileName = './login.html';
    } else if (!path.extname(fileName)) {
        fileName += '.html';
    }

    fs.readFile(fileName, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end('404 Page not Found');
        }

        const extname = path.extname(fileName);
        let contentType = 'text/html';

        switch (extname) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
        }

        res.writeHead(200, {'Content-Type': contentType});
        res.write(data);
        return res.end();
    })
})

const host = 'localhost';
const port = 8080;

server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}/`);
  });