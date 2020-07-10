cocos creator

1. cc.loader.loadRes(“路径”，文件类型，function) // 加载资源
   // 1. 路径是 assets/resource 目录下的路径
   // 2. function(err,res){}, res 成功找到文件返回的文件， err 未成功找到文件返回的错误

2. cc.loader.releaseRes(“路径”，文件类型，function) // 清理资源

// 加载 test assets 目录下所有资源
cc.loader.loadResDir("test assets", function (err, assets) {
// ...
});

// 加载 test assets 目录下所有 SpriteFrame，并且获取它们的路径
cc.loader.loadResDir("test assets", cc.SpriteFrame, function (err, assets, urls) {
// ...
});

3. // 直接释放某个贴图
   cc.loader.release(texture);
   // 释放一个 prefab 以及所有它依赖的资源
   var deps = cc.loader.getDependsRecursively('prefabs/sample');
   cc.loader.release(deps);
   // 如果在这个 prefab 中有一些和场景其他部分共享的资源，你不希望它们被释放，可以将这个资源从依赖列表中删除
   var deps = cc.loader.getDependsRecursively('prefabs/sample');
   var index = deps.indexOf(texture2d.\_uuid);
   if (index !== -1)
   deps.splice(index, 1);
   cc.loader.release(deps);

4. // 远程 url 带图片后缀名
   var remoteUrl = "http://unknown.org/someres.png";
   cc.loader.load(remoteUrl, function (err, texture) {
   // Use texture to create sprite frame
   });

// 远程 url 不带图片后缀名，此时必须指定远程图片文件的类型
remoteUrl = "http://unknown.org/emoji?id=124982374";
cc.loader.load({url: remoteUrl, type: 'png'}, function () {
// Use texture to create sprite frame
});

// 用绝对路径加载设备存储内的资源，比如相册
var absolutePath = "/dara/data/some/path/to/image.png"
cc.loader.load(absolutePath, function () {
// Use texture to create sprite frame
});

//碰撞组件
开启碰撞检测
cc.director.getCollisionManager().enabled=true; 这是一个全局属性，开启后就代表碰撞检测组件可以进行检测了
cc.director.getCollisionManager().enabledDebugDraw = true; 绘制碰撞区域
————————————————

    onCollisionEnter:function(other,self)
    碰撞开始事件(第一次接触)
    onCollisionStay:function(other,self)
    碰撞持续事件(组件相交)
    onCollisionExit:function(other,self)
    碰撞结束事件(离开的一瞬间)

————————————————
版权声明：本文为 CSDN 博主「章鱼仔」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/agsgh/java/article/details/79723394
