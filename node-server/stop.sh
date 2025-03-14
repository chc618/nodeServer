#!/bin/bash

# 停止服务
pm2 stop node-server

# 删除服务记录
pm2 delete node-server