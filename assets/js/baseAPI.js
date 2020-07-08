//每次调用 $.get() $.post() $.ajax() 的时候 会先调用 ajaxPrefilter 函数

$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
});