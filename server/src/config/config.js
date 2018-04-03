module.exports = {
  // db
  dialect: 'mysql',
  database: process.env.DB_NAME || 'hypertube',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  port: process.env.DB_PORT || '3306',
  host: process.env.DB_HOST || 'localhost',
  db: {
    database: process.env.DB_NAME || 'hypertube',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'localhost',
      port: '3306',
      operatorsAliases: false
    }
  },
  server: {
    port: process.env.PORT || 8081
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
