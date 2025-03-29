import type { ReviewTarget } from "../../../../utils/types.js";
import db from "../../../../db/utils/index.js";
import utils from "../../../../utils/index.js";

const reviewHandler = async (
  reviewerId: string,
  target: "AGENT" | "LANDLORD" | "LISTING",
  targetId: string,
  data: { rating: number; message: string },
): Promise<Record<string, any>> => {
  let review, existingReview;
  const reviewTarget = target as ReviewTarget;
  try {
    if (target === "LANDLORD" || target === "AGENT") {
      // get user being liked
      const user = await db.client.client.user.findMany({
        where: { id: reviewerId, isDeleted: false },
      });
      if (!user.length) {
        return {
          error: true,
          status: 404,
          message: `user: ${reviewerId} not found`,
        };
      }

      // avoid duplicate
      existingReview = await db.client.client.review.findMany({
        where: {
          message: data.message,
          rating: data.rating,
          userId: targetId,
          reviewerId,
          target: reviewTarget,
        },
      });
      if (existingReview.length) {
        return {
          error: true,
          message: "review already exists",
          status: 400,
        };
      }

      // create the review
      review = await db.client.client.review.create({
        data: {
          message: data.message,
          rating: data.rating,
          target: reviewTarget,
          reviewer: { connect: { id: reviewerId } },
          user: { connect: { id: targetId } },
        },
        include: db.client.include.review,
      });
      return {
        error: false,
        data: {
          action: "review",
          message: `${utils.text.titleCase(target)} ${targetId} reviewed`,
          data: review,
        },
      };
    }
    // handle listing review
    const listing = await db.client.client.listing.findMany({
      where: { id: targetId, isDeleted: false },
    });
    if (!listing.length) {
      return {
        error: true,
        status: 404,
        message: `listing: ${targetId} not found`,
      };
    }
    // avoid duplicates
    existingReview = await db.client.client.review.findMany({
      where: {
        message: data.message,
        rating: data.rating,
        target: reviewTarget,
        isDeleted: false,
        reviewerId,
        listingId: targetId,
      },
    });
    if (existingReview.length) {
      return {
        error: true,
        message: "review already exists",
        status: 400,
      };
    }
    // create the review
    review = await db.client.client.review.create({
      data: {
        message: data.message,
        rating: data.rating,
        target: reviewTarget,
        reviewer: { connect: { id: reviewerId } },
        listing: { connect: { id: targetId } },
      },
      include: db.client.include.review,
    });
    return {
      error: false,
      data: {
        action: "review",
        message: `listing ${targetId} reviewed`,
        data: review,
      },
    };
  } catch (err: any) {
    console.error(err);
    return {
      error: true,
      status: 500,
      message: err.toString || "some error occured",
    };
  }
};

export default reviewHandler;
