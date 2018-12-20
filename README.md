```
# clone the repo
git clone https://github.com/fenglanzhan/angular-components.git

# change into the repo directory
cd angular-components

# install
npm install

# run
ng serve
```



公司内有几个app经常会用到图片上传的功能，类似于咸鱼的产品发布。

## 图片上传压缩功能

关于图片，有一些基础知识在这里整理一下。

1. FormData对象：可以将数据以键值对的形式，通过ajax请求发送给服务器，是常见的移动端上传方式。在移动端兼容性非常不错。
2. base64格式：也就是用一段字符串描述二进制数据
3. Blob对象：一个二进制对象，原生支持，XHR level2支持Blob对象
4. FileReader对象：可以将本地文件转换成base64格式的dataUrl；可以使用File或者Blob对象指定要读取的文件或数据

图片压缩的实现是将图片用canvas画出来，使用canvas.toDataUrl方法将图片转化成base64格式，利用此方法设置导出图像的质量进行压缩

1. 使用input获取文件file
2. 将file转换成dataUrl，即base64格式
3. 然后用canvas绘制图片进行压缩，生成新的dataUrl
4. 将dataUrl转化成Blob(可以试试canvas.toBlob方法)
5. 将数据添加到FormData对象中
6. 通过XHR上传



在移动端，图库和拍照选择图片是基于ionic native的插件实现的，直接转化成base64格式的图片



一个Promise的坑：测试时，发现在使用promise来实现异步回调时，异步代码的运行时错误无法被自动 reject 进而被 catch 捕获，而是直接报错

不过这里用了img的`onerror`事件监听，还是可以避免的。


优化点：
1. 多张上传
   1. 根据具体业务来说，我们做的并不是工具类的开发，所以图片上传的数量不会很多。基于此，可以限定每次选取的最大张数，比如3张，多张并发上传，性能方面应该还是可以的
   2. 如果要实现多图(多余3张)上传，还没有思路
2. 兼容性问题：因为主要做Hybrid APP，所以在兼容性方面没有考虑那么多，后来查can i use，发现兼容性的问题还挺麻烦的，框架拖多了，技术渣的不行。。。