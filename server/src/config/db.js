module.exports = {
  database: process.env.DB_NAME || 'hypertube',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  dialect: process.env.DIALECT || 'mysql',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3306',
  operatorsAliases: false
}
