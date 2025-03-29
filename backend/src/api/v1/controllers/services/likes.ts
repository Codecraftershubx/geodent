import type { LikeTarget } from "../../../../utils/types.js";
import db from "../../../../db/utils/index.js";

const likeHandler = async (
  likerId: string,
  target: "LISTING" | "USER",
  id: string,
): Promise<Record<string, any>> => {
  let updated, newLike;
  const likeTarget = target as LikeTarget;
  if (target === "USER") {
    // get user being liked
    const user = await db.client.client.user.findMany({
      where: { id, isDeleted: false },
    });
    if (!user.length) {
      return {
        error: true,
        status: 404,
        message: `user: ${id} not found`,
      };
    }

    // check if liker has liked this user
    const hasLiked = await db.client.client.like.findFirst({
      where: {
        likerId,
        userId: id,
        target: likeTarget,
      },
    });
    if (hasLiked) {
      // unlike the like
      try {
        updated = await db.client.client.like.delete({
          where: { id: hasLiked.id },
        });
        return {
          error: false,
          data: {
            action: "unlike",
            message: `user ${id} unliked`,
            data: updated,
          },
        };
      } catch (err: any) {
        console.error(err);
        return {
          error: true,
          status: 500,
          message: err.toString() || "an error occured",
        };
      }
    }

    // create the like
    newLike = await db.client.client.like.create({
      data: {
        target: likeTarget,
        liker: { connect: { id: likerId } },
        user: { connect: { id } },
      },
      include: db.client.include.like,
    });
    return {
      error: false,
      data: {
        action: "like",
        message: `user ${id} liked`,
        data: newLike,
      },
    };
  }
  // handle listing like
  const listing = await db.client.client.listing.findMany({
    where: { id, isDeleted: false },
  });
  if (!listing.length) {
    return {
      error: true,
      status: 404,
      message: `listing: ${id} not found`,
    };
  }
  // check if liker has liked this listing
  const hasLiked = await db.client.client.like.findFirst({
    where: {
      likerId,
      listingId: id,
      target: likeTarget,
    },
  });
  if (hasLiked) {
    // unlike the like
    try {
      updated = await db.client.client.like.delete({
        where: { id: hasLiked.id },
      });
      return {
        error: false,
        data: {
          action: "unlike",
          message: `listing ${id} unliked`,
          data: updated,
        },
      };
    } catch (err: any) {
      console.error(err);
      return {
        error: true,
        status: 500,
        message: err.toString() || "an error occured",
      };
    }
  }

  // create the like
  newLike = await db.client.client.like.create({
    data: {
      target: likeTarget,
      liker: { connect: { id: likerId } },
      listing: { connect: { id } },
    },
    include: db.client.include.like,
  });
  return {
    error: false,
    data: {
      action: "like",
      message: `listing ${id} liked`,
      data: newLike,
    },
  };
};

export default likeHandler;
