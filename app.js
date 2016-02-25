'use strict';

const path = require('path');
const  spdy = require('spdy');
const fs = require('fs');

const koa = require('koa');
const config = require('./config/config');


const app = koa();
app.keys = ['rebase'];


const compress = require('koa-compress');
app.use(compress());


const onerror = require('koa-onerror');
onerror(app);


const sass = require('koa-sass');
app.use(sass({
    src: path.join(config.staticDir, 'sass'),
    prefix: '/sass/',
    force: true,
    response: true
}));


const staticCache = require('koa-static-cache');
app.use(staticCache(config.staticDir, {
    dynamic: true,
}));


const session = require('koa-generic-session');
app.use(session(app));


const bodyParser = require('koa-bodyparser');
app.use(bodyParser());


const ejs = require('koa-ejs');
ejs(app, {
    root: config.viewDir,
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
});


const csrf = require('koa-csrf');
csrf(app);
app.use(csrf.middleware);


const router = require('koa-router')();

const indexRouter = require('./router/index');
router.use('/', indexRouter.routes());

app.use(router.routes());


const options = {
    key: fs.readFileSync(__dirname + '/keys/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/keys/server-cert.pem'),
    ca: fs.readFileSync(__dirname + '/keys/ca-cert.pem'),
};

const server = spdy.createServer(options, app.callback());

server.listen(config.port);
