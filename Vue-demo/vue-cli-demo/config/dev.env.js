var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
  // BASE_API: '"https://api-dev"' //修改为'"https://api-prod"'就行了
})
