export default () => {
  return {
    database: {
      port: process.env.PORT,
      host: process.env.HOST,
      user_name: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
    jwt: {
      secret_jwt: process.env.SECRET,
      expire_jwt: process.env.EXPIRE_JWT,
    },
    emailConfig: {
      email: process.env.EMAIL,
      emailPw: process.env.EMAIL_PW,
    },
  };
};

export interface IJwtConfig {
  secret_jwt: string;
  expire_jwt: string;
}

export interface IMailerConfig {
  email: string;
  emailPw: string;
}
