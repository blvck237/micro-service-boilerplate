export const jwtConfig = {
  admin: {
    secret: process.env.JWT_SECRET_ADMIN,
    duration: '24h',
  },
  user: {
    secret: process.env.JWT_SECRET_USER,
    duration: '24h',
  },
  refresh: {
    secret: process.env.JWT_SECRET_REFRESH,
    duration: '30d',
  },
};
