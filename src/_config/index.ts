const config = {
  APP_NAME: process.env.APP_NAME || "Inventory Management",
  port: process.env.APP_PORT || 5000,
  dbUrl: "mongodb://localhost:27017",
  nodeEnv: process.env.NODE_ENV || "development",
  corsAcceptedOrigins: [
    "http://localhost:5173",
    "https://inventory-management-fe-ten.vercel.app",
    "https://app.inventory-management.com.ng",
  ],
  mail: {
    user: "6c53d765680ca4",
    password: "83175273732073",
    port: 2525,
  },
  ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
  REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
  verificationTokenExpiresAt: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  passwordResetTokenExpiresAt: () => new Date(Date.now() + 1 * 60 * 60 * 1000),
  refreshTokenExpiresIn: "30d",
  accessTokenExpiresIn: "5d",
  maxAgeOfRefreshTokenInCookie: 24 * 60 * 60 * 1000,
  DEFAULT_MAX_FILE_UPLOAD_SIZE: 5 * 1024 * 1024, //5 MB
  DEFAULT_PAGE_SIZE: 15,
};

export default config;
