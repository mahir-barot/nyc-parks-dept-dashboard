const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Data',
    createProxyMiddleware({
      target: 'https://forestrymapapi-cbfga6a9bbfpaxa2.centralindia-01.azurewebsites.net',
      changeOrigin: true,
      secure: false,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: function(err, req, res) {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong with the proxy');
      }
    })
  );
}; 