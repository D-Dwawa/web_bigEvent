$(function() {
    getUserInfo();

    var layer = layui.layer;
    $('#btnExit').on('click', function() {
        // console.log('退出');
        // 提示用户是否退出
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function(index) {
            //do something

            // 1.清空本地存储中 token值
            localStorage.removeItem('token');
            //2.重新跳转到首页
            location.href = './login.html';
            layer.close(index);
        });
        //eg2
        // layer.confirm('is not?', function(index) {
        //     //do something

        //     layer.close(index);
        // });

    });
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers 就是请求配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                // console.log(res);
                // 判断登录成功
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户信息失败！");
                }
                //登录成功 调用renderAvatar 渲染用户的头像
                renderAvatar(res.data);

            }
            // // 无论登录成功还是失败 后台限制
            // complete: function(res) {
            //     console.log(res);

        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         //1.清空token
        //         localStorage.removeItem('token');
        //         //跳转登录页
        //         location.href = './login.html';
        //     }
        // }
    });
}

function renderAvatar(user) {
    var name = user.nickname || user.username;
    //1设置欢迎的文本
    $('.wellcome').html('欢迎&nbsp;&nbsp' + name);
    //2.按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avator').hide();
    } else {
        $('.layui-nav-img').hide();
        //获取文本内容第一个英文字母转换大写
        var pic = name[0].toUpperCase();
        $('.text-avator').html(pic).show();
    }
}