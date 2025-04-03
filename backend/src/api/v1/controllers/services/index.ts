import likes from "./likes.js";
import reviews from "./createReview.js";
import createDocuments from "./createDocuments.js";

export default { likes, reviews, documents: { create: createDocuments } };
