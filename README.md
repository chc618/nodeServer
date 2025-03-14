## 实现node服务器与数据库直接交互

### **第一步：安装 Node.js 和 npm**

```
# 1. 更新软件包列表
sudo yum update -y

# 2. 安装基础依赖
sudo yum install -y curl

# 3. 添加 NodeSource 仓库
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -

# 4. 安装 Node.js 和 npm
sudo yum install -y nodejs
# 5. 验证安装
node -v  # 应显示 v18.x 或更高
npm -v   # 应显示 9.x 或更高
```

### **第二步：安装 PM2 进程管理器**

```
# 全局安装 PM2（需要 sudo 权限）
sudo npm install -g pm2

# 验证安装
pm2 --version  # 应显示 5.x 或更高
```

### **第三步：安装 MySQL 客户端库**

```
sudo yum install -y mysql-devel
```

### 开发防火墙端口
```
sudo firewall-cmd --permanent --add-port=3300/tcp
sudo firewall-cmd --reload
npm run lint
```

配置Nginx

脚本

```
# 赋予执行权限
chmod +x start.sh stop.sh

# 启动服务
./start.sh

# 停止服务
./stop.sh
```

### **验证服务运行**

```
# 查看 PM2 进程列表
pm2 list

# 检查服务日志
pm2 logs my-node-server

# 测试接口访问（从其他机器执行）
curl http://你的服务器IP:3300/info
```

上传进去的启动和关闭脚本,启动不了

```
sed -i 's/\r$//' start.sh
```

 