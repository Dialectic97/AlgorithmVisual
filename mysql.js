const mysql      = require('mysql')
const pool = mysql.createPool({
  host     : '127.0.0.1',   // 数据库地址
  user     : 'root',    // 数据库用户
  password : '123',  // 数据库密码
  database : 'koa_demo'  // 选中数据库
})


const RegisterSql = "insert into User (id, pass) value (?,?)";
const LoginSql = "select * from User where id = ? and pass = ? ;"
const AddSql = "insert into algorithm (id, name) value (?,?)";
// 执行sql脚本对数据库进行读写 

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}
module.exports = {
    register: async (user, pass) =>{
        await query(RegisterSql, [user, pass])
    },

    Login : async (user, pass) =>{
      let dataset = await query(LoginSql, [user, pass]);
      if(dataset.length == 0) return false;
      else 
      return true;
    },

    Add : async (id, name) =>{
      await query(AddSql, [id, name]);
    } 

}
