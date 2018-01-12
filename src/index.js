const hot =
  process.env.NODE_ENV !== 'production' && module.hot
    ? require('./hot.dev').default
    : require('./hot.prod').default

export default hot
