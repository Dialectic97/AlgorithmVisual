const fs = require("fs");
const Router = require('koa-router');
const uploadFile = require('./upload')
const path = require('path')
const mysql = require('./mysql');
const getlist = require('./getList')

let home = new Router();

//读取文件
const render =  pagename => {
    return new Promise((resolved, reject) => {
        let htmlurl = `./static/TopFrame/${pagename}`; // './' + pagename
        //判断是否有该文件
        console.log(htmlurl);
        fs.readFile(htmlurl, {encoding: 'utf-8'}, (err, data) => {
            if(err) {
                reject(err);
            }
            else 
                resolved(data);

        } )
    });
}

//子路由1
home.get('/', async ( ctx )=>{
    if ( ctx.session && ctx.session.isLogin && ctx.session.userName ) {
          //alert(ctx.session.userName + "已登陆");
          console.log(ctx.session.userName );
    }
    
    ctx.body = await render('index.html');
})

home.post('/login', async ( ctx )=>{
    let postData =  ctx.request.body ;
    //console.log(postData);
    //连接数据库判断
    
    if(await mysql.Login(postData.user, postData.pass)) {
      console.log("login yes")
      let session = ctx.session
      session.isLogin = true
      session.userName = postData.user;
      //console.log(session);
      ctx.body = true;
    }
    else {
      console.log("login no");
      ctx.body = false;
    }

  })

  home.post('/register', async ( ctx )=>{
    let postData =  ctx.request.body ;
    console.log(postData.user, postData.pass)
    await mysql.register(postData.user, postData.pass);
    ctx.body = true;
  })

  home.get('/filelist', async ( ctx )=>{
    let ans = {
      files:[],
      usrdir : undefined
    }
    ans.usrdir = ctx.session.userName;
    console.log(ans.usrdir);
    root = path.join(__dirname,'static/AnimationFrame/algorithm/');

    if(fs.existsSync(root + ans.usrdir)) {
        let pa = fs.readdirSync( root + ans.usrdir);
        console.log(pa);
        for(let i = 0; i < pa.length; i++) {
          ans.files.push(pa[i]);
        }
    }
    console.log(ans.files);
    ctx.body = ans;

  })

  home.get('/getsession', async ( ctx )=>{
    ctx.body = ctx.session.userName;

  })

  
  home.post('/upload.json', async ( ctx )=>{
    //console.log("fdsfadf");
    let result = { success: false }
    let serverFilePath = path.join( __dirname, 'static/AnimationFrame/algorithm/' )
    // 上传文件事件
    result = await uploadFile( ctx, {
      username: ctx.session.userName,// common or album
      path: serverFilePath
    })
    //console.log(ctx);
    ctx.body = result;
  })

  home.get('/clearsession', async ( ctx )=>{
    ctx.session = null;
    ctx.body = undefined;
  })



module.exports = home;