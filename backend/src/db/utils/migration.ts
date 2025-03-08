import { exec } from "child_process";

export default {
  dev: (name: string) => {
    return new Promise((resolve, reject) => {
      // Run the Prisma Migrate dev command
      exec(
        `npx prisma migrate dev --name '${name}'`,
        (error, stdout, stderr) => {
          if (error) {
            reject(stderr);
          } else {
            resolve(stdout);
          }
        },
      );
    });
  },

  deploy: () => {
    return new Promise((resolve, reject) => {
      // Run the Prisma Migrate deploy command
      exec("npx prisma migrate deploy", (error, stdout, stderr) => {
        if (error) {
          console.log("MIGRATION ERROR:", error);
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  },
};
