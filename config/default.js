module.exports = {
  port: 3003,
  session: {
    secret: 'wlhblog',
    maxAge: 1000 * 60 * 60 * 12 * 7
  },
  mongodb: 'mongodb://localhost:27017/wlhblog'
}