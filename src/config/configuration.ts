export default () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGO_URI,
    expiresIn: process.env.EXPIRES_IN,
  };
};
