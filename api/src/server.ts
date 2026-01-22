import "dotenv/config";

import { app } from "./app.js";

const port = Number(process.env.PORT) || 3000;

async function main() {
  app.listen(port, () => {
    console.log(`Server is working on PORT: ${port}`);
  });
}

main();
