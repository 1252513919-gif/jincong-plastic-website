# 本地企业客户开发系统

本后台位于 `/lead-dev`，用于邢台及周边制造企业的注塑外协客户开发。它与官网页面和 `/api/contact` 询盘接口分离。

## 当前安全边界

- 默认 `TEST_MODE=true`。
- 当前阶段禁止向真实客户邮箱发送邮件。
- 所有测试邮件只能发送到 `TEST_RECIPIENT`。
- 所有 `/lead-dev` 页面和 `/api/lead-dev/*` 接口都需要服务端登录。
- 邮件草稿必须人工审核，联系方式必须是 `VERIFIED` 后才能批准。
- 本地 MVP 不提供完整自动队列，只允许每次点击发送一封已批准邮件。

## 环境变量

复制 `.env.example` 为 `.env.local`，至少配置：

```env
DATABASE_URL=file:./dev.db
TEST_MODE=true
TEST_RECIPIENT=your-test-mailbox@example.com
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=lianhaoxuan@jincongrp.cn
SMTP_PASS=your_tencent_exmail_client_password
FROM_NAME=邢台锦聪橡塑有限公司
FROM_EMAIL=lianhaoxuan@jincongrp.cn
COMPANY_WEBSITE=https://www.jincongplastic.com
LEAD_DEV_ADMIN_USERNAME=admin
LEAD_DEV_ADMIN_PASSWORD_HASH=生成后的密码哈希
LEAD_DEV_SESSION_SECRET=至少32位随机字符串
```

生成管理员密码哈希：

```bash
npm run lead-dev:hash-password
```

## 初始化数据库

```bash
npm install
npm run prisma:generate
npm run lead-dev:init-db
```

## 本地启动

```bash
npm run dev
```

访问：

```text
http://127.0.0.1:3000/lead-dev
```

## CSV 导入

模板文件：

```text
public/templates/lead-import-template.csv
```

导入流程：

1. 粘贴 CSV 内容。
2. 点击“预览”。
3. 确认错误、重复、无效邮箱和公式注入处理结果。
4. 点击“确认导入有效行”。

导入不会生成草稿，也不会发送邮件。

## 邮件发送测试

1. 确保 `TEST_MODE=true`。
2. 配置 `TEST_RECIPIENT` 为你自己的测试邮箱。
3. 客户详情页先标记联系方式 `VERIFIED`。
4. 生成草稿并提交待审核。
5. 批准草稿。
6. 到发送队列点击“发送下一封已批准邮件”。

实际收件人必须显示为 `TEST_RECIPIENT`。
