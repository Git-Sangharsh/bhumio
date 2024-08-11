const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Adjust this to match your API routes
    createProxyMiddleware({
      target: 'https://www.consumerfinance.gov',
      changeOrigin: true,
    })
  );
};
