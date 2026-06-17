// scripts/createAdmin.js
// Krijon (ose perditeson) nje admin user qe PERPUTHET me modelin live:
//   role: "admin" (string), password: <bcrypt hash>
//
// Perdorimi:
//   node scripts/createAdmin.js                                  -> default
//   node scripts/createAdmin.js admin@paradox.com FjalaJote123 "Emri Mbiemri"
//
// S'ke nevoje per dotenv: e lexon MONGODB_URI nga .env.local vete.

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// --- Lexo MONGODB_URI nga .env.local (ose nga environment) ---
function loadMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*MONGODB_URI\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  }
  return null;
}

// --- Argumentet nga CLI (me default per testim te shpejte) ---
const [, , emailArg, passArg, ...nameParts] = process.argv;
const email = (emailArg || "admin@paradox.com").toLowerCase();
const password = passArg || "admin123";
const name = nameParts.join(" ") || "Admin";

// Schema minimale qe perputhet me modeli live User (models/User.ts)
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    role: { type: String, default: "user" },
    provider: { type: String, default: "credentials" },
  },
  { timestamps: true },
);

async function main() {
  const uri = loadMongoUri();
  if (!uri) {
    console.error(
      "❌ Nuk u gjet MONGODB_URI. Vendose ne .env.local ose: MONGODB_URI=... node scripts/createAdmin.js",
    );
    process.exit(1);
  }

  await mongoose.connect(uri);
  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const hash = await bcrypt.hash(password, 10);

  // upsert: nese ekziston ai email -> e ben admin + reset password; perndryshe e krijon
  const admin = await User.findOneAndUpdate(
    { email },
    { name, email, password: hash, role: "admin", provider: "credentials" },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log("✅ Admin gati:");
  console.log("   email:", admin.email);
  console.log("   role :", admin.role);
  console.log("   pass :", password, "  (ndërroje pas login-it të parë)");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Gabim:", err.message);
  process.exit(1);
});
