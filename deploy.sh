#!/bin/bash
# 自动部署脚本：构建博客并上传到阿里云服务器
# 用法：./deploy.sh

set -e

SERVER_IP="120.26.254.10"
SERVER_USER="root"
REMOTE_DIR="/var/www/mhang-blog"
PROJECT_DIR="/Users/mh/Downloads/博客"
TEMP_DIR="/tmp/hang-blog"

echo "📦 开始部署博客到阿里云服务器..."

# 1. 复制到英文路径（避免中文路径 Turbopack 问题）
echo "  → 复制项目到临时目录..."
rm -rf "$TEMP_DIR"
cp -R "$PROJECT_DIR" "$TEMP_DIR"

# 2. 运行 prebuild 脚本（RSS、搜索索引、加密内容）
echo "  → 生成 RSS、搜索索引、加密内容..."
cd "$TEMP_DIR"
npx tsx scripts/generate-rss.ts
npx tsx scripts/generate-search-index.ts
npx tsx scripts/encrypt-content.ts

# 3. 构建
echo "  → 构建静态文件..."
cd "$TEMP_DIR"
env -u NODE_OPTIONS node ./node_modules/.bin/next build

# 4. 打包
echo "  → 打包构建产物..."
cd "$TEMP_DIR/out"
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/mhang-blog-out.tar.gz .

# 5. 上传
echo "  → 上传到服务器..."
expect -c "
set timeout 120
spawn scp -o StrictHostKeyChecking=no /tmp/mhang-blog-out.tar.gz $SERVER_USER@$SERVER_IP:/tmp/mhang-blog-out.tar.gz
expect {
    \"password:\" { send \"Mahangmh370..\r\"; exp_continue }
    eof
}
"

# 6. 远程解压并重载 Nginx
echo "  → 服务器端解压部署..."
expect -c "
set timeout 60
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP \"rm -rf $REMOTE_DIR/* && tar xzf /tmp/mhang-blog-out.tar.gz -C $REMOTE_DIR && rm /tmp/mhang-blog-out.tar.gz && systemctl reload nginx && echo DEPLOY_OK\"
expect {
    \"password:\" { send \"Mahangmh370..\r\"; exp_continue }
    \"DEPLOY_OK\" { }
    eof
}
"

# 7. 清理
rm -f /tmp/mhang-blog-out.tar.gz

echo ""
echo "✅ 部署完成！"
echo "   访问 http://$SERVER_IP 查看效果"
echo "   访问 https://mhang.cc 查看域名（备案后生效）"
