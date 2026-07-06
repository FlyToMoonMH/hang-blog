#!/bin/bash
# 自动部署脚本：构建博客并上传到阿里云服务器
# 用法：./deploy.sh
#
# 首次使用：需在 .env.local 中配置 SERVER_PASSWORD
#   cp .env.example .env.local  # 按模板创建
#   vim .env.local              # 填入密码
#   chmod 600 .env.local        # 仅当前用户可读

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 从 .env.local 加载配置（密码等敏感信息）
if [ -f "$SCRIPT_DIR/.env.local" ]; then
  set -a
  source "$SCRIPT_DIR/.env.local"
  set +a
fi

SERVER_IP="120.26.254.10"
SERVER_USER="root"
REMOTE_DIR="/var/www/mhang-blog"
PROJECT_DIR="$SCRIPT_DIR"
TEMP_DIR="/tmp/hang-blog"

# 检查必要变量
if [ -z "$SERVER_PASSWORD" ]; then
  echo "❌ 错误: SERVER_PASSWORD 未设置"
  echo "   请在 .env.local 中配置: SERVER_PASSWORD=你的密码"
  exit 1
fi

echo "📦 开始部署博客到阿里云服务器..."

# 1. 复制到英文路径（避免中文路径 Turbopack 问题）
echo "  → 复制项目到临时目录..."
rm -rf "$TEMP_DIR"
cp -R "$PROJECT_DIR" "$TEMP_DIR"

# 2. 构建
echo "  → 构建静态文件..."
cd "$TEMP_DIR"
env -u NODE_OPTIONS npm run build

# 3. 打包
echo "  → 打包构建产物..."
cd "$TEMP_DIR/out"
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/mhang-blog-out.tar.gz .

# 4. 上传
echo "  → 上传到服务器..."
expect -c "
set timeout 120
spawn scp -o StrictHostKeyChecking=no /tmp/mhang-blog-out.tar.gz $SERVER_USER@$SERVER_IP:/tmp/mhang-blog-out.tar.gz
expect {
    \"password:\" { send \"$SERVER_PASSWORD\r\"; exp_continue }
    eof
}
"

# 5. 远程解压并重载 Nginx
echo "  → 服务器端解压部署..."
expect -c "
set timeout 60
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP \"rm -rf $REMOTE_DIR/* && tar xzf /tmp/mhang-blog-out.tar.gz -C $REMOTE_DIR && rm /tmp/mhang-blog-out.tar.gz && systemctl reload nginx && echo DEPLOY_OK\"
expect {
    \"password:\" { send \"$SERVER_PASSWORD\r\"; exp_continue }
    \"DEPLOY_OK\" { }
    eof
}
"

# 6. 清理
rm -f /tmp/mhang-blog-out.tar.gz

echo ""
echo "✅ 部署完成！"
echo "   访问 http://$SERVER_IP 查看效果"
echo "   访问 https://mhang.cc 查看域名（备案后生效）"
