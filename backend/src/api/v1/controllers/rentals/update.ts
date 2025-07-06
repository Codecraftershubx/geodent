import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { Prisma } from "@prisma/client";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const update = async (req: Request, res: Response): Promise<void> => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  const { id } = req.params;
  const { data } = matchedData(req);

  try {
    // verify rental exists
    const rental = await db.client.client.rental.findUnique({
      where: { id, isDeleted: false },
    });
    if (!rental) {
      return utils.handlers.error(req, res, "validation", {
        status: 404,
        message: `rental ${id} not found`,
      });
    }
    // validating listingId and landlordid if provided
    if (data.listingId) {
      const listing = await db.client.client.listing.findUnique({
        where: { id: data.listingId, isDeleted: false },
      });
      if (!listing) {
        return utils.handlers.error(req, res, "validation", {
          message: `listing ${data.listingId} not found`,
        });
      }
    }
    if (data.landlordId) {
      const landlord = await db.client.client.user.findUnique({
        where: { id: data.landlordId, isDeleted: false },
      });
      if (!landlord) {
        return utils.handlers.error(req, res, "validation", {
          message: `user ${data.landlordid} not found`,
        });
      }
    }
    // validate sartsAt and endsAt
    const startTime = new Date(data?.startsAt ?? rental.startsAt).getTime();
    const endTime = new Date(data?.endsAt ?? rental.endsAt).getTime();
    const todayTime = new Date().getTime();
    if (todayTime - startTime > 0) {
      return utils.handlers.error(req, res, "validation", {
        message: "startsAt in the past",
      });
    }

    if (todayTime - endTime > 0) {
      return utils.handlers.error(req, res, "validation", {
        message: "endsAt in the past",
      });
    }

    if (endTime - startTime < 60 * 60 * 24 * 1000) {
      return utils.handlers.error(req, res, "validation", {
        message: "rental must be at least 24 hours",
      });
    }

    // create update data and update rental
    const fields = [
      "listingId",
      "landlordId",
      "amountPaid",
      "priceIsDifferent",
      "reason",
      "startsAt",
      "endsAt",
    ];
    const updateData = {} as Prisma.RentalUpdateInput;
    for (let field of fields) {
      if (data[field]) {
        if (field === "amountPaid") {
          Object.assign(updateData, {
            amountPaid: parseFloat(data.amountPaid),
          });
        }
        Object.assign(updateData, { [field]: data[field] });
      }
    }
    let updatedRental = await db.client.client.rental.update({
      where: { id },
      data: updateData,
    });
    const filtered = await db.client.filterModels([updatedRental]);
    return utils.handlers.success(req, res, {
      message: "update successful",
      count: 1,
      data: filtered,
    });
  } catch (err: any) {
    console.error(err);
    return utils.handlers.error(req, res, "general", {
      message: err?.message ?? "an error occured",
    });
  }
};

export default update;
