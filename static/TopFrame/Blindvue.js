let lists = new Vue({
    el: "#vuelist",
    data: {
        lists: [],
        activepos:0
    },
    methods: {
      deleteicon: function() {
        if ($(".delete").css("display") == "none") {
          $(".delete").show()
        } else {
          $(".delete").hide();
        }
      },
      delete2 : function() {
        let dom = $(event.currentTarget);
        let name = dom.prev().html();
        this.lists.splice(this.lists.findIndex(item => item.name === name), 1)//删除该元素更新列表io
        //ajax 更新数据库
      },
        
      
      select: function() {
        if(this.activepos != 0) 
          this.activepos.removeClass("active");
        
        this.activepos = $(event.target)
        this.activepos.addClass("active");
        
        //解析文件，导出各个命令行操作
        //$("#Animation")[0].contentWindow.addscript("algorithm/" + activepos.text() + ".js");
       
      },

      upload : function(){
            
            if ($("#div_upload").css("display") == "none") {
              $("#div_upload").slideDown();
            } else {
              $("#div_upload").slideUp();
            }
            let filename = $("#filename").val();
            //let username = $("btn_login").val();
            
            //let ans = false;
            let usrdir;
            $.ajax({
                    url: '/upload.json',
                    type: 'POST',
                    cache: false,
                    data: new FormData($('#form_upload')[0]),
                    processData: false,
                    contentType: false
                }).done(function(res) {
                  usrdir = res.username
                  alert('添加' + filename + "成功");
                }).fail(function(res) {});

            this.lists.push({name : filename});
            setTimeout(() => {
              $("#Animation")[0].contentWindow.addscript("algorithm/" + usrdir  + "/" + filename + ".js", 1);
            }, 500);
            
      
    
      },
      getsessionName : function() {
            let ans;
              $.ajax({
                url: '/getsession',
                type: 'GET',
            }).done(function(res) {
                ans = res;
            }).fail(function(res) {}); 
            setTimeout(() => {
              return ans;
            }, 500);
      }

        
    },
})


