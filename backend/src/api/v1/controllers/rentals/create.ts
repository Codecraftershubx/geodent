import { Request, Response } from "express";
import db from "../../../../db/utils/index.js";
import { matchedData, validationResult } from "express-validator";
import utils from "../../../../utils/index.js";
import type { THandlerOptions } from "../../../../utils/types.js";

const createNewRental = async (req: Request, res: Response): Promise<void> => {
  // hande validation errors
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    const validationErrors = validation.array();
    return utils.handlers.error(req, res, "validation", {
      message: "validation error",
      data: validationErrors,
      count: validationErrors.length,
    });
  }

  // get data and create user
  const { data } = matchedData(req);
  // validate startsAt and endsAt
  try {
    const listing = await db.client.client.listing.findUnique({
      where: { id: data.listingId, isDeleted: false },
    });
    if (!listing) {
      return utils.handlers.error(req, res, "validation", {
        message: `listing ${data.listingId} not found`,
      });
    }
    const startTime = new Date(data.startsAt).getTime();
    const endTime = new Date(data.endsAt).getTime();
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
    // validate tenants
    for (let tenantId of data.tenants) {
      const tempUser = await db.client.client.user.findUnique({
        where: { id: tenantId },
      });
      if (!tempUser) {
        return utils.handlers.error(req, res, "validation", {
          message: `tenant ${tenantId} not found`,
        });
      }
      // tenant is not landlord
      if (tenantId === listing.userId) {
        return utils.handlers.error(req, res, "validation", {
          message: "landlord cannot be a tenant",
        });
      }
    }
    // create rental
    const rental = await db.client.client.rental.create({
      data: {
        landlord: { connect: { id: listing.userId } },
        listing: { connect: { id: data.listingId } },
        tenants: {
          connect: data.tenants.map((id: string) => {
            return { id };
          }),
        },
        amountPaid: parseFloat(data.amountPaid),
        priceIsDifferent: data.priceIsDifferent || false,
        reason: data.reason || null,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      },
      include: db.client.include.rental,
    });
    const filtered = await db.client.filterModels([rental]);
    return utils.handlers.success(req, res, {
      data: filtered,
      message: "rental created successfully",
      status: 201,
    });
  } catch (err: any) {
    console.error(err);
    const resOptions: THandlerOptions = {
      data: [{ details: err?.message ?? err.toString() }],
      message: "user creation failed",
    };
    if (err?.code || null === "P2002") {
      resOptions["status"] = 400;
    }
    return utils.handlers.error(req, res, "general", resOptions);
  }
};

export default createNewRental;
