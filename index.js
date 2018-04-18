module.exports =
  process.env.NODE_ENV !== 'production' && module.hot
    ? require('./lib/hot.dev')
    : require('./lib/hot.prod')
