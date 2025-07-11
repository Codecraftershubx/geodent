import likes from "./likes.js";
import reviews from "./createReview.js";
import createDocuments from "./createDocuments.js";
import type { TCreateOpRes } from "../../../../utils/types.js";

export default { likes, reviews, documents: { create: createDocuments } };
export type { TCreateOpRes };
