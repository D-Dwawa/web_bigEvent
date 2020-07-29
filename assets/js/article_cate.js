$(function() {
    initArtCateList();
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // 渲染模板引擎
                var htmls = template('tpl-table', res);
                $('tbody').html(htmls);

            }
        })
    }

    //添加分类
    var layer = layui.layer;
    var index = null;
    //添加文章
    $('#addArt').on('click', function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    })

    // 通过代理的方式，submit添加文章提交事件
    var form = layui.form;
    $('body').on('submit', '#add-article', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                //渲染数据
                initArtCateList();
                // 关闭弹出层
                layer.close(index);
            }
        })
    })

    // 通过代理的方式，添加弹出层 编辑分类
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function(e) {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });
        //获取自定义属性ID
        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('article-edit', res.data);
                // console.log(res);

            }
        });

    });

    //修改弹出的层的数据 submit提交是委托body 
    $('body').on('submit', '#article-edit', function(e) {
        // console.log('你好');

        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败!');
                }
                layer.msg('更新分类成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })

    })

    //通过代理的方式提交click 删除文章 委托事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败！');
                    }
                    layer.msg('文章删除成功');
                    //关闭弹出层
                    layer.close(index);
                    //重新渲染文章数据
                    initArtCateList();

                }
            })

        });
    })
})