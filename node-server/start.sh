#!/bin/bash

# 安装依赖（首次部署时使用）
# npm install

# 使用PM2启动服务
pm2 start /data/server/mes-keda-test/web/MES_temporary_kanban/node-server/app.js --name node-server \
--watch \
--log /var/log/node-server.log \
--error /var/log/node-error.log \
--output /var/log/node-output.log

# 保存PM2进程列表（方便开机自启）
pm2 save

# 设置开机自启（需要sudo权限时取消注释）
# sudo pm2 startup