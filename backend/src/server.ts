import { app } from "./app";
import { env } from "./config";
app.listen(env.PORT, () => console.log(`FINORA API berjalan di http://localhost:${env.PORT}`));
