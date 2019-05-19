// 获取子框架 绑定播放器功能栏按钮点击事件
let is_play = false;
$(document).ready(function () {

    const AnimationWindow = $("#Animation")[0].contentWindow;
    $("#run").click(function () {
        if(is_play == false) {
               $("#play").css('display', "none")
               $("#pause").css('display', "inline")
               AnimationWindow.Auto();
               is_play = true;
               console.log("Auto");
        }
        else {
            $("#play").css('display', "inline")
            $("#pause").css('display', "none")
            AnimationWindow.stop();
            is_play = false;
            console.log("stop")
        }
    });
    $("#next").click(function () {
        AnimationWindow.step(1);
        //AnimationWindow.;
    })
    $("#pre").click(function () {
        AnimationWindow.step(-1);
    })
    // With JQuery
    $('#ex1').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });
})


