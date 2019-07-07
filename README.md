# Live2D Character Mods for Majsoul Web Game

这是一个将雀魂人物静态立绘替换为 Live2D 动画立绘的 mod 。请将该 mod 和 [雀魂 Plus](https://github.com/MajsoulPlus/majsoul-plus-client) 一起使用。

## 构建

```
npm i
npx gulp v2-default
```

打包好的 mod 在 dist 目录下。

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

## 模型说明

目前仅支持 live2d v2 的模型格式。模型的配置文件请使用 `.model.json` 作为后缀。

模型来源可以去网上找，或者由设计制作。

自定义的 mod 可以上传到网盘后，在 [自定义模型分享 issue](https://github.com/giantpand2000/majsoul-live2d-mods/issues/1) 里分享给大家。