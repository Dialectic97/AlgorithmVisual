/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="typings/modules/koa/index.d.ts" /
$(document).ready(function () {
    $(function() {
        $("#btn_login").click(function() {
          if ($("#div_login").css("display") == "none") {
            $("#div_login").slideDown();
          } else {
            $("#div_login").slideUp();
          }
          if ($("#div_register").css("display") != "none") {
            $("#div_register").slideUp();
          }
        });
        
        $("#btn_register").click(function() {
          if ($("#div_register").css("display") == "none") {
            $("#div_register").slideDown();
            $("#div_login").slideUp(); 
          } else {
            $("#div_register").slideUp();
          }
        });
        

        
        $("#btn_upload").click(function() {
          if ($("#div_upload").css("display") == "none") {
            $("#div_upload").slideDown();
          } else {
            $("#div_upload").slideUp();
          }
        });
  
        $("#ajax_login").click(function() {
          $("#div_login").css("display","none");
          $("#div_register").css("display","none");
          let username = $("#login_user").val();
          //alert(username);
          $.ajax({
                type: "POST",//方法类型
                url: "/login" ,//url
                data: $('#form_login').serialize(),
                success: function (result) {
                    if(result) {
                      alert("登录成功");
                      $("#btn_login").html(username);
                      $("#btn_logout").css("display", "inline");
                      initlist();
                      $("#terminal")[0].contentWindow.$("#terminalname").text(username + "$");
                    }
                    else
                      alert("登录失败")
                },
                error : function() {
                    alert("异常！");
                }
            });
            
        });

        $("#btn_logout").click(function() {
          $("#btn_login").html("登陆"); 
          $("#btn_logout").css("display", "none");
          //session
          $.ajax({
            type: "GET",//方法类型
            url: "/clearsession" ,//url
            });
            lists.lists = [];
            $("#Animation")[0].contentWindow.canvasclear()
            $("#Code")[0].contentWindow.editor.setValue("")

       })
       
        $("#ajax_register").click(function() {
          $("#div_login").css("display","none");
          $("#div_register").css("display","none");
          
          $.ajax({
                type: "POST",//方法类型
                url: "/register" ,//url
                data: $('#form_register').serialize(),
                success: function (result) {
                    alert("注册成功");
                },
                error : function() {
                    alert("异常！");
                }
            });
        })
        
      });

       
})


