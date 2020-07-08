$(function() {
    $("#link-rigester").on("click", function() {
        $(".login-box").hide();
        $(".rigester-box").show();
    });

    $("#link-login").on("click", function() {
        $(".rigester-box").hide();
        $(".login-box").show();
    });

    //效验密码
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        //自定义叫做 pwd 效验规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 效验两次秘密法是否一致的规则
        repdw: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $(".rigester-box [name=password]").val();
            // console.log(repdw.value); //表单的值

            if (pwd !== value) {
                return "两次输出密码不相同";
            }

        }
    });

    $("#form_reg").on("submit", function(e) {
        //1.阻止默认提价行为
        e.preventDefault();
        // 2.发起ajax请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log("注册成功");
            layer.msg("注册成功,请登录");
            $("#link-login").click();
        });
    })

    // 登录
    $("#form_login").on("submit", function(e) {
        //阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: "/api/login",
            method: 'post',
            //获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                //token保存起来
                localStorage.setItem("token", res.token);
                location.href = '/index.html';
            }
        });
    });
})