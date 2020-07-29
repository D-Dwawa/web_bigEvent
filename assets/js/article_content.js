$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initcate();
    // 初始化富文本编辑器
    initEditor()
        //定义加载文章分类的方法

    // 1. 初始化图片裁剪器
    var $image = $('#image')


    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);



    function initcate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！');
                }
                // 渲染UI结构
                var htmlStr = template('tpl-cate_id', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 文件选择框
    $('#btn-image').on('click', function() {
            $('#imgUpload').click();
        })
        // 图片裁剪
    $('#imgUpload').on('change', function(e) {
        //获取文件列表数组
        var file = e.target.files
        if (file.length === 0) {
            return
        }
        // 根据文件创建对应URL
        var imgfile = URL.createObjectURL(file[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgfile) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 定义文章的发布状态
    var art_state = '已发布';
    $('#btn-cg').on('click', function() {
        art_state = '草稿';
    })

    // 创建表单数据
    $('#form-data').on('submit', function(e) {
        //1.阻止表单默认提交行为
        e.preventDefault();
        //2.获取表单提交数据 
        var form_data = new FormData($(this)[0]);
        //3.添加新的表单数据
        form_data.append('state', art_state);
        //4将图片的裁剪区域，输出一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.存储文件form_data 文件中
                form_data.append('cover_img', blob);
                //6.发起ajax请求
                publishArticle(form_data);
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //注意，像服务器提交的是FormData数据，必须添加以下配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功！');
                location.href = '/article/article_list.html';
            }
        })
    }

})