const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 4000;

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected...");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to database:", err);
  });
