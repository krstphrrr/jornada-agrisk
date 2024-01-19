// loading dependencies for express server
const express = require('express');
const app = express();
const port = 3000
const php = require('phpcgijs')
const path = require("path")

const p = path.join("/dist")


app.use(express.static('dist'));
app.use('/', php.cgi(p, { cgi_path: '/usr/bin/', options: { "-c": "/etc/php81/php.ini" } }))


// serves everything in the src directory on the '/' route
app.use('/', express.static(__dirname + '/dist'));

app.listen(port, ()=>{console.log(`listening internally on port ${port}`)});
