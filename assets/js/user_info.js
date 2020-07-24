$(function() {
    var form = layui.form;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度在1-6之前";
            }
        }
    });
    initUserInfo();
    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return '获取用户信息失败!'
                }
                // console.log(res);
                form.val('formUserInfo', res.data);

            }
        })
    }

    //重置功能
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                //调用父页面元素中的方法
                window.parent.getUserInfo();
            }
        });
    })
})