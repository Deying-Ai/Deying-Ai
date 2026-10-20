# AI 个人档案发布指南

## 1. 修改资料

打开 `profile.config.json`，替换姓名、GitHub 用户名、简介、项目、技能与联系方式。

项目都使用可替换的示例内容，不会虚构历史成绩。发布前请把示例项目换成你真正做过的事情。

## 2. 重新生成内容

```bash
npm run build
```

这会同步生成：

- `profile-data.js`：个人主页使用的数据
- `README.md`：显示在 GitHub 仓库首页的个人档案
- `assets/banner.svg`：自动使用你的姓名、身份和字母标识生成的仓库横幅

## 3. 在本地预览

```bash
npm run dev
```

然后打开 <http://127.0.0.1:4173>。

## 4. 创建 GitHub Profile 仓库

GitHub 的个人主页仓库必须与用户名完全一致。例如用户名为 `alice`：

1. 在 GitHub 新建公开仓库 `alice`
2. 初始化 README 可勾选，也可以不勾选
3. 将本目录内容推送至仓库

```bash
git init
git add .
git commit -m "Build AI personal profile"
git branch -M main
git remote add origin https://github.com/<用户名>/<用户名>.git
git push -u origin main
```

推送后，仓库首页的 `README.md` 会自动成为 GitHub 个人主页。

## 5. 开启 GitHub Pages

进入仓库：

1. `Settings`
2. `Pages`
3. `Build and deployment` 选择 `Deploy from a branch`
4. Branch 选择 `main`，目录选择 `/ (root)`
5. 保存并等待部署

个人主页地址会是：

```text
https://<用户名>.github.io/<用户名>/
```

## 6. 可选增强

- 在 `profile.config.json` 填写 `avatar` 后重新构建，可替换默认的字母头像
- 为项目填写 `url` 后，项目行会变成可点击链接
- 填写 LinkedIn、X 与邮箱后，联系区会自动出现对应入口
