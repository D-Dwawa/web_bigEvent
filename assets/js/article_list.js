$(function() {

    var form = layui.form;
    var laypage = layui.laypage;
    //定义查询参数对象，将请求数据，参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类ID
        state: '' //文章的发布状态
    }

    //定义模板时间过滤器
    template.defaults.imports.DateFormat = function(date) {
            const dt = new Date(date);
            var y = dt.getFullYear();
            var m = patZero(dt.getMonth() + 1);
            var h = patZero(dt.getDate());

            var hh = patZero(dt.getHours());
            var mm = patZero(dt.getMinutes());
            var ss = patZero(dt.getSeconds());
            return y + '-' + m + '-' + h + ' ' + hh + ":" + mm + ":" + ss;
        }
        // 补0函数
    function patZero(n) {
        return n < 9 ? '0' + n : n;
    }
    // 渲染文章列表
    articleList();
    // 渲染下拉分类类表
    getArticleList();
    //获取所有文章列表
    function articleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // layer.msg('获取文章列表成功！');

                var htmlArticle = template('art-list', res);
                $('tbody').html(htmlArticle);
                renderPage(res.total);
            }
        })
    }

    //获取文章列表分类
    function getArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！');
                }
                var htmlStr = template('tpl-articleList', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                //layui重新渲染
                form.render();


            }
        })
    }

    //为表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //1.为查询对象赋值
        q.cate_id = cate_id ? cate_id : '';
        q.state = state ? state : '';
        //2. 重新渲染文章列表
        articleList();
    })

    // 定义渲染的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageList', //渲染元素内容
            count: total, //渲染总数据
            limit: q.pagesize, //分页显示几条数据
            limits: [2, 3, 5, 10],
            curr: q.pagenum, //默认选页码,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //设置最新页码
                q.pagenum = obj.curr;
                //设置分页条目数
                q.pagesize = obj.limit;
                // console.log(q.pagenum);
                //first 为true 通过laypage 方式调用
                // first 为undefine 通过点击方式调用
                if (!first) {
                    articleList();
                }

            }
        });

    }

    // 删除文章功能 通过代理方式添加事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        var length = $('.btn-delete').length;
        //弹出询问层
        layer.confirm('删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!');
                    }
                    console.log(res);

                    layer.msg('删除文章成功!');
                    if (length === 1) {
                        // 页面值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 重新渲染文章列表
                    articleList();
                }
            })
            layer.close(index);
        });
    })

    //编辑文章功能
    // 6. 监听编辑按钮的点击事件
    $('body').on('click', '#btn-edit', function() {
        //1.获取文章ID
        location.href = '/article/article_edit.html?id=' + $(this).attr('data-id')
            // 6. 监听编辑按钮的点击事件

        // 2.发送ajax请求



    })
})