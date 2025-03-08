import { argon2id, hash, verify } from "argon2";

export default {
  hash: async (password: string): Promise<string | null> => {
    try {
      const passwordHash = await hash(password, {
        type: argon2id,
        memoryCost: 15360,
        parallelism: 2,
        timeCost: 3,
      });
      return passwordHash;
    } catch (_) {
      return null;
    }
  },
  verify: async (hash: string, password: string): Promise<boolean> => {
    try {
      const matches = await verify(hash, password);
      return matches;
    } catch (_) {
      return false;
    }
  },
};
