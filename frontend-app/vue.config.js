module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          '^/api': '' // 重写路径: 去掉路径中的/api
        }
      }
    }
  }
};