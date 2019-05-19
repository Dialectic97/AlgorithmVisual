const inspect = require('util').inspect
const path = require('path')
const os = require('os')
const fs = require('fs')
const Busboy = require('./node_modules/busboy')
const mysql = require('./mysql')

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName( fileName ) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}         
 */

function streamToString (stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}




function uploadFile( ctx, options) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({headers: req.headers})

  // 获取类型
  let user = options.username;
  let filePath = path.join( options.path,  user)
  let mkdirResult = mkdirsSync( filePath )

  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result = { 
      success: false,
      formData: {},
    }


    let jsname;
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      if(fieldname == "filename") {
        jsname = inspect(val);
      }
      result.formData[fieldname] = inspect(val);
    });


    // 解析请求文件事件

      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log(jsname);
        let fileName = jsname.slice(1,jsname.length-1) + '.' + getSuffixName(filename)
        let _uploadFilePath = path.join( filePath, fileName )
        console.log(_uploadFilePath);
        let saveTo = path.join(_uploadFilePath)
        result.username = user;
        
    
   

      
     

      // 文件保存到制定路径
       file.pipe(fs.createWriteStream(saveTo))
      // 文件写入事件结束
        file.on('end', function() {
        result.success = true
        result.message = '文件上传成功'

        console.log('文件上传成功！')
        resolve(result)
      })

    })
      
    

    

    // 解析结束事件
    busboy.on('finish', function( ) {
      console.log('文件上结束')
      resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function(err) {
      console.log('文件上出错')
      reject(result)
    })

    req.pipe(busboy)
  })

 

} 


module.exports =  uploadFile