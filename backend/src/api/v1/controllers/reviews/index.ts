import createReview from "./create.js";
import deleteReview from "./delete.js";
import readReviews from "./read.js";
import restoreReviews from "./restore.js";
import updateReview from "./update.js";

export default {
  create: createReview,
  delete: deleteReview,
  get: readReviews,
  restore: restoreReviews,
  update: updateReview,
};
