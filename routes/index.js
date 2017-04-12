const adminRoutes = require("./admin");

const path = require('path');

const constructorMethod = (app) => {
    app.use("/admin", adminRoutes);
    app.use("*", adminRoutes);
};

module.exports = constructorMethod;