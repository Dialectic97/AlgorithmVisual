
$(document).ready(function () {
    getsession();
    //console.log("yes")
    setTimeout(() => {
      initlist();
    }, 500);
    

})

function initlist() {
  lists.lists = [];
  let files;
  let userdir;
  let flag = $("#btn_login").text()
  
  //console.log(flag);

    if(flag != "登陆" ){
      $.ajax({
              type: "GET",//方法类型
              url: "/filelist" ,//url
              success: function (result) {
                  if(result.files.length) {
                    
                    files = result.files;
                    usrdir = result.usrdir;
                    console.log(files, usrdir);
                  }
                  else
                    alert("请上传文件")
              },
              error : function() {
                  alert("获取列表文件异常！");
              }
          });
          //一个假的同步操作
            setTimeout(() => {
              //载入列表
              for(let i = 0; i < files.length; i++) {
                lists.lists.push({name : files[i].slice(0,files.length-4)});
              }
              
              //载入文件
              for(let i = 0; i < files.length; i++) {
                //console.log("algorithm/" +  usrdir  + "/" + files[i]");
                $("#Animation")[0].contentWindow.addscript("algorithm/" +  usrdir  + "/" + files[i], 0);
              }
            }
            , 500);
}
  
 

}



function getsession() {
  console.log("sdfdaf");
  $.ajax({
    type: "GET",//方法类型
    url: "/getsession" ,//url
    success: function (result) {
      console.log(result);
      if(result != undefined) {
        $("#btn_login").text(result);
        $("#btn_logout").css("display", "inline");
      }
    },
    error : function() {
        //alert("获取列表文件异常！");
    }
});
}