import { Request, Response } from "express";
import type { TPayload } from "../../../../utils/types.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const login = async (req: Request, res: Response): Promise<void> => {
  // extract access token
  let authHeader = req.headers.authorization;
  if (authHeader) {
    const [_, accessToken] = authHeader.split(" ");
    try {
      let data = utils.tokens.decompose.accessToken(accessToken);
      if (data.expired) {
        const refreshToken = req.cookies.refreshToken;
        // if found, and not expired, refresh user accessToken
        if (!refreshToken) {
          return utils.handlers.error(res, "authentication", {
            message: "invalid credentials provided",
          });
        }
        try {
          // extract userId from refreshToken
          data = utils.tokens.decompose.refreshToken(refreshToken);
          if (!data.expired) {
            // refresh access token
            const temp = data.payload as TPayload;

            let newToken = utils.tokens.generate.accessToken({
              id: temp.id,
            });
            return utils.handlers.success(res, {
              message: "login successful",
              data: [{ accessToken: newToken, id: temp.id }],
            });
          }
          return utils.handlers.error(res, "authentication", {
            message: "expired credentials",
          });
        } catch (err: any) {
          return utils.handlers.error(res, "authentication", {
            message: `${err?.message ?? "an error occured"}`,
            data: [{ details: err }],
          });
        }
      }
      // login authenticated User
      const payload = data.payload as TPayload;
      // get payload and authenticate
      return utils.handlers.success(res, {
        data: [{ id: payload.id }],
        message: "user authenticated",
      });
    } catch (err) {
      // error occured while generating token
      if (err instanceof Error) {
        return utils.handlers.error(res, "general", {
          message: "user authentication failed",
          status: 500,
          data: [{ details: err.toString() }],
        });
      }
      // invalid access token
      return utils.handlers.error(res, "authentication", {
        message: "invalid credentials provided",
      });
    }
  }
  // no auth header: use user credentials
  const { email, password } = req.body;
  if (!email || !password) {
    return utils.handlers.error(res, "authentication", {
      message: "missing email or password",
    });
  }
  // verify credentials
  const user = await db.client.client.user.findUnique({
    where: { email },
  });
  if (!user) {
    return utils.handlers.error(res, "authentication", {
      message: "invalid credentials provided",
    });
  }

  // verify password
  const match = await utils.passwords.verify(user.password, password);
  if (!match) {
    return utils.handlers.error(res, "authentication", {
      message: "invalid credentials provided",
    });
  }
  // auth success
  return utils.handlers.success(res, {
    message: "user authenticated",
    data: [{ id: user.id }],
  });
};

export default login;
