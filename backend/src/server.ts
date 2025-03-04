import { PrismaClient } from "@prisma/client";
import env from "./config.js";

const DB_URL = env.DB_URL;
console.log("dburl: ", DB_URL);
const db = new PrismaClient({
  datasourceUrl: `${DB_URL}`,
});

async function main() {
  const James = await db.user.create({
    data: {
      name: "some 2 user",
      email: "user_2@gmail.com",
    },
  });
  console.log(James);

  // get all users:
  const res = await db.user.findMany();
  console.log(res);
}

main()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
