import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    /* --------------------------- */
    /* - Validate Address Exists - */
    /* --------------------------- */
    const { id } = req.params;
    const address = await db.client.client.address.findMany({
      where: { id, isDeleted: false },
    });
    if (!address.length) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
        message: `address not found`,
      });
    }
    /* ------------------- */
    /* - Delete Address - */
    /* ------------------ */
    await db.client.client.address.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(req, res, {
      message: "address deleted",
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteAddress;
