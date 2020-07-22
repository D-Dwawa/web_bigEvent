//每次调用 $.get() $.post() $.ajax() 的时候 会先调用 ajaxPrefilter 函数

$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 设置统一的请求头
    //判断路径
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //统一挂载 complete
    options.complete = function(res) {
        // console.log(res);

        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //1.清空token
            localStorage.removeItem('token');
            //跳转登录页
            location.href = './login.html';
        }
    }

});