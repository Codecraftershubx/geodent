import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const create = async (req: Request, res: Response): Promise<void> => {
  /* ---------------------------------------- */
  /* - Validate User Logged In and is Admin - */
  /* ---------------------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  const { profile: user } = req.body?.auth?.profile;
  if (!user || !user.isAdmin) {
    return utils.handlers.error(req, res, "authentication", { errno: 31 });
  }
  /* ---------------------- */
  /* - Validate sent data - */
  /* ---------------------- */
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      errno: 11,
      data: validationErrors,
      count: validationErrors.length,
    });
  }
  try {
    /* --------------------------- */
    /* - Avoid duplicate entries - */
    /* --------------------------- */
    const { data } = matchedData(req);
    const existingCountry = await db.client.client.country.findMany({
      where: { numericCode: data.numericCode },
    });
    if (existingCountry.length) {
      return utils.handlers.error(req, res, "general", {
        errno: 14,
      });
    }

    /* --------------------- */
    /* - Proceed to Create - */
    /* --------------------- */
    const country = await db.client.client.country.create({
      data: {
        ...data,
        alpha2Code: data.alpha2Code.toUpperCase(),
        alpha3Code: data.alpha3Code.toUpperCase(),
        name: utils.text.titleCase(data.name),
      },
      include: db.client.include.country,
    });
    const filtered = await db.client.filterModels([country]);
    return utils.handlers.success(req, res, {
      message: "country created",
      data: filtered,
      status: 201,
    });
  } catch (err: any) {
    console.error("some error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default create;
