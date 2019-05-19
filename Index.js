/// <reference path="typings/globals/jquery/index.d.ts" />
/// <reference path="typings/globals/node/index.d.ts" />
/// <reference path="typings/modules/koa/index.d.ts" />
const Koa = require('koa'); // koa v2
const loggerAsync  = require('./log');
const bodyParser = require('koa-bodyparser')
const PrasePost = require('./PrasePost')
const home = require('./Router')
const static = require('koa-static')
const path = require('path')
//const session = require('koa-session-minimal')
const session=require('koa-session');
const MysqlStore = require('koa-mysql-session')




const app = new Koa();
app.keys = ['this is my secret and fuck you all'];

app.use(session({
  key: 'koa:sess', /** cookie的名称，可以不管 */
  maxAge: 7200000, /** (number) maxAge in ms (default is 1 days)，cookie的过期时间，这里表示2个小时 */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
},app));
// post解析
app.use(bodyParser())

//后台监控
app.use(loggerAsync());

//静态资源服务器
const staticPath = './static'
app.use(static(
  path.join( __dirname,  staticPath)
))

//路由
app.use(home.routes())
    .use(home.allowedMethods())


//session


app.listen(3000)
console.log('the server is starting at port 3000')



