# Live2D Character Mods for Majsoul Web Game

这是一个将雀魂人物静态立绘替换为 Live2D 动画立绘的 mod 。请将该 mod 和 [雀魂 Plus](https://github.com/MajsoulPlus/majsoul-plus-client) 一起使用。

## 构建

```
npm i
npx gulp v2-default
```

打包好的 mod 在 dist 目录下。

已经打包好的 [一姬替换Live2D Haru](https://github.com/giantpand2000/majsoul-live2d-mods/files/3365671/live2d-character-v2.mspm.zip) 可以在 [releases](https://github.com/giantpand2000/majsoul-live2d-mods/releases/tag/v1.0.0) 下载到。

## 安装

请参考 [雀魂 Plus](https://github.com/MajsoulPlus/majsoul-plus-client) mod 安装。


## 自定义人物

目前只提供了 live2d 官方演示素材人物。如果想要使用自定义 Live2D 人物，请按以下步骤进行。

1. 把模型复制到 `public/live2d-character-v2/files/0/live2d` 目录下。可按照需要增加子目录。模型的配置文件请用 `.model.json` 作为后缀。

2. 编辑 `src/character-skin.js` 里的模型映射表。

```
    let l2dMap = new Map([
        [400101, "/0/live2d/official-models/haru/haru.model.json"],
        // [400201, "/0/live2d/azur-lane/bisimai_2/bisimai_2.model3.json"],
```

可以添加多个模型分别对应多个游戏人物。

3. 测试。运行 `npx gulp v2` 更新文件。把 `public/live2d-character-v2` 目录符号链接到雀魂 Plus 的 mods 目录。重新载入插件观看效果。

3. 打包，安装。

## 模型位置及大小的调整

模型映射表的每一条其实由三项组成：替换角色的 id, 模型配置 url, 和可以缺省的 放置方式。

默认的放置方式是 `"layoutActual"`，指的是通过计算模型的可视大小，并放入对应的矩形。
另一种方式是 `"layoutDefault"`，指的是根据模型配置文件 .model.json 里的方式放置。模型配置文件里可以定义一个 `layout` 对象，可以设置 `center_x, center_y, x, y, width, height` 等属性，具体参考 live2d cubism v2 的配置文件。注：这些值是在 [规范坐标系](https://en.wikipedia.org/wiki/Orthographic_projection) 下的值, x 范围 [-1, 1], y 范围 [-1, 1]。

## 模型说明

目前仅支持 live2d v2 的模型格式。模型的配置文件请使用 `.model.json` 作为后缀。

模型来源可以去网上找，或者由设计制作。

自定义的 mod 可以上传到网盘后，在 [自定义模型分享 issue](https://github.com/giantpand2000/majsoul-live2d-mods/issues/1) 里分享给大家。