export default () => ({
  port: parseInt(process.env.PORT) || 3001,
  database: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
