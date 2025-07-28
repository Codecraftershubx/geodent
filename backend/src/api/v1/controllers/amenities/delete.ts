import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const deleteAmenity = async (req: Request, res: Response): Promise<void> => {
  /* --------------------------- */
  /* - Validate User Logged In - */
  /* --------------------------- */
  const { isLoggedIn } = req.body.auth;
  if (!isLoggedIn) {
    return utils.handlers.error(req, res, "authentication", {});
  }

  /* --------------------------- */
  /* - Validate User Is Admin -- */
  /* --------------------------- */
  const { profile: user } = req.body?.auth?.profile;
  if (!user || !user.isAdmin) {
    return utils.handlers.error(req, res, "authentication", {});
  }
  try {
    /* ---------------------------- */
    /* - Validate Amenity Exists - */
    /* -------------------------- */
    const { id } = req.params;
    const amenity = await db.client.client.amenity.findUnique({
      where: { id, isDeleted: false },
    });
    if (!amenity) {
      return utils.handlers.error(req, res, "validation", {
        errno: 13,
      });
    }
    /* ------------------ */
    /* - Delete Amenity - */
    /* ------------------ */
    await db.client.client.amenity.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    });
    return utils.handlers.success(req, res, {
      message: "delete successful",
      count: 1,
    });
  } catch (err: any) {
    console.log("error occured");
    return utils.handlers.error(req, res, "general", {
      data: [{ details: JSON.stringify(err) }],
    });
  }
};

export default deleteAmenity;
