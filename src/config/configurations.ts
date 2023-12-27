export default () => ({
  secret_jwt: process.env.SECRET,
  expire_jwt: process.env.EXPIRE_JWT,
  host: process.env.HOST,
  port: process.env.PORT,
  user_name: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database:  process.env.DATABASE,
});
