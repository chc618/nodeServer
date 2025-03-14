// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {                          // 匹配所有以 /api 开头的请求
        target: 'http://127.0.0.1:3300/', // 转发到 3300 端口
        changeOrigin: true,
        pathRewrite: { '^/api': '' }     // 移除路径中的 /api 前缀
      },
    },
  }
}
