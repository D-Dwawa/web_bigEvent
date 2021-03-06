$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 上传文件
    $('#imgFileUpload').on('click', function() {
        $('#iamgeFile').click();
    })

    //为文件框绑定change事件
    $("#iamgeFile").on('change', function(e) {
            // console.log(e);
            var fileList = e.target.files;
            if (fileList.length === 0) {
                return layui.layer.msg('请选择照片');
            }
            // 拿到用户的文件
            var file = e.target.files[0];
            //根据选择文件，创建一个url
            var newImgUrl = URL.createObjectURL(file);
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgUrl) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        //确定上传点击事件
    $('#btnUpload').on('click', function(e) {
        e.preventDefault();
        //裁剪区域内容
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发送到服务器
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！');
                }
                layui.layer.msg('设置头像成功');
                window.parent.getUserInfo();
            }
        });

    })
})