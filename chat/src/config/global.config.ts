export interface GlobalConfig {
  nodemailer: {
    service: string;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export const globalConfig = (): GlobalConfig => ({
  nodemailer: {
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  },
});
