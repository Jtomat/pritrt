// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require("express");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
let serveStatic = require("serve-static");
const app = express();
app.use(serveStatic(__dirname));
const port = process.env.PORT || 5000;
app.listen(port);
console.log("server started " + port);
