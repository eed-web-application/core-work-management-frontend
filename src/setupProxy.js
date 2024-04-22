const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy middleware for /api/cis
  app.use(
    '/api/cis',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: { '^/api/cis': '' },
    })
  );

  // Proxy middleware for /api/cwm
  app.use(
    '/api/cwm',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: { '^/api/cwm': '' },
    })
  );

  // Proxy middleware for /api/elog
  app.use(
    '/api/elog',
    createProxyMiddleware({
      target: 'http://localhost:8083',
      changeOrigin: true,
      pathRewrite: { '^/api/elog': '' },
    })
  );
};