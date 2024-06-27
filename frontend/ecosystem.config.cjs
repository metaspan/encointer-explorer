
// pm2 start ecosystem.config.cjs
// pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'Encointer Explorer',
      port: '3001',
      exec_mode: 'cluster',
      instances : 2,
      // instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
