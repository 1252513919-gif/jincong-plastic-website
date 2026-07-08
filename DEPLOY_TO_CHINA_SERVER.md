# 国内服务器部署说明

适用项目：邢台锦聪橡塑有限公司官网

## 1. 项目框架

当前项目使用：

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Node.js 运行时

项目包含一个后端接口：

- `/api/inquiry`

该接口用于询盘提交和邮件发送，因此当前项目不是纯静态站。

## 2. 本地生产构建

在项目根目录执行：

```bash
npm install
npm run build
```

构建成功后会生成：

```text
.next/
```

同时还需要保留：

```text
public/
package.json
package-lock.json
next.config.mjs
```

Windows PowerShell 如果提示 `npm` 执行策略问题，可改用：

```powershell
npm.cmd install
npm.cmd run build
```

## 3. 最终部署目录

推荐服务器部署目录：

```text
/www/wwwroot/jincong-website
```

可以把整个项目上传到该目录，但不要上传：

```text
node_modules/
.git/
.next/cache/
.env.local
```

推荐在服务器上重新安装依赖并构建：

```bash
cd /www/wwwroot/jincong-website
npm install
npm run build
```

启动生产服务：

```bash
npm run start
```

默认监听：

```text
http://127.0.0.1:3000
```

## 4. 是否可以纯静态部署

当前不建议纯静态部署。

原因：

- 项目使用 Next.js App Router。
- 项目包含 `/api/inquiry` 后端接口。
- 询盘表单需要后端能力，不能只靠静态 HTML 完成邮件发送。

如果以后决定不使用网站内置询盘接口，改为第三方表单或独立后端，可以再配置静态导出。届时静态目录通常会是：

```text
out/
```

但当前项目的正式生产部署目录不是 `out/`，而是通过 `.next/` 由 Next.js 服务运行。

## 5. 推荐部署方式：Nginx + Next.js Node 服务

推荐结构：

```text
用户浏览器
  -> Nginx 80/443
  -> Next.js 127.0.0.1:3000
```

Nginx 负责域名、HTTPS、反向代理。

Next.js 负责页面渲染、产品详情路由和询盘接口。

## 6. PM2 守护进程

服务器安装 PM2：

```bash
npm install -g pm2
```

在项目目录启动：

```bash
cd /www/wwwroot/jincong-website
pm2 start npm --name jincong-website -- run start
pm2 save
pm2 startup
```

查看运行状态：

```bash
pm2 status
pm2 logs jincong-website
```

重启服务：

```bash
pm2 restart jincong-website
```

## 7. Nginx 配置

把 `your-domain.com` 替换为你的真实域名。

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}
```

配置 HTTPS 后，建议再增加 HTTP 跳转 HTTPS：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}
```

HTTPS 证书可以使用：

- 宝塔面板 SSL
- 阿里云免费证书
- 腾讯云免费证书
- Let's Encrypt

## 8. 前端路由刷新 404 处理

当前推荐部署方式是 Nginx 反向代理到 Next.js。

这种方式下，不需要写 `try_files /index.html`，因为所有页面请求都会交给 Next.js 处理：

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

这样刷新以下地址不会 404：

```text
/products
/products/automotive-plastic-parts-001
/en/products
/contact
```

如果未来改为纯静态部署，才需要类似配置：

```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

但这不适用于当前带 `/api/inquiry` 的完整功能版本。

## 9. 询盘邮件环境变量

如果要让询盘表单真正发送邮件，需要在服务器配置环境变量。

建议在服务器项目目录创建 `.env.production`，不要提交到公开仓库。

示例：

```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_USER=lianhaoxuan@jincongrp.cn
SMTP_PASS=你的腾讯企业邮箱SMTP授权码
INQUIRY_RECEIVER_EMAIL=lianhaoxuan@jincongrp.cn
```

说明：

- `SMTP_USER` 必须是完整邮箱地址。
- `SMTP_PASS` 应填写企业邮箱 SMTP 授权码或服务密码。
- 不要把真实密码写进前端代码。
- 修改环境变量后需要重启服务：

```bash
pm2 restart jincong-website
```

## 10. 服务器安全组和端口

阿里云 / 腾讯云安全组建议开放：

```text
80
443
22
```

不建议把 `3000` 端口直接暴露到公网。

Next.js 服务监听 `127.0.0.1:3000`，由 Nginx 转发即可。

## 11. 常用上线流程

首次部署：

```bash
cd /www/wwwroot/jincong-website
npm install
npm run build
pm2 start npm --name jincong-website -- run start
pm2 save
```

后续更新：

```bash
cd /www/wwwroot/jincong-website
npm install
npm run build
pm2 restart jincong-website
```

检查服务：

```bash
curl http://127.0.0.1:3000
pm2 status
```

检查 Nginx：

```bash
nginx -t
systemctl reload nginx
```

## 12. 验收检查

上线后建议检查：

- 首页是否正常打开。
- `/products` 是否正常打开。
- 产品详情页刷新是否正常。
- `/en` 英文页面是否正常。
- `/contact` 联系页面是否正常。
- 询盘表单是否能提交。
- 手机端是否正常显示。
- HTTPS 是否正常。
- 浏览器控制台是否没有明显报错。

