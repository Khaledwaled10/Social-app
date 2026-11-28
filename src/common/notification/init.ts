
import { FirebaseProvider } from "../../pkj/email/firebase";
import fs from "node:fs";
import path from "node:path";

const firebaseConfigPath = path.join(
    __dirname,
    "../config/social-app-969c3-firebase-adminsdk-fbsvc-711a2495f8.json"
);

const firebaseConfig = JSON.parse(
    fs.readFileSync(firebaseConfigPath, "utf-8")
);

export const firebaseProvider = new FirebaseProvider(firebaseConfig);
