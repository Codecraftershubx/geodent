// error numbers object type

type TAccessTokenPayload = { id: string };

type TDecomposeResult = {
  payload: TAccessTokenPayload | null;
};

type TErrNumber = {
  code: number;
  desc: string;
  statusCode: number;
};

type TErrNumbers = {
  [key: string]: TErrNumber;
};

type THandlerOptions = {
  status?: number;
  data?: Array<Record<string, any>>;
  message?: String;
  [key: string]: any;
};

type TUserData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  [key: string]: Array<any> | boolean | string;
};

type TUserModel = {
  id: String;
  serial: Number;
  documents?: Array<any>;
  refreshtoken?: String | null;
  isAdmin: Boolean;
  chatrooms: Array<any>;
  createdAt: Date;
  email: String;
  addressId?: String | null;
  address?: any | null;
  firstName: String;
  lastName: String;
  isDeleted: Boolean;
  deletedAt?: Date | null;
  emailVerified: Boolean;
  likes: Array<any>;
  likedBy: Array<any>;
  listings: Array<any>;
  notifications: Array<any>;
  password: String;
  phone?: String | null;
  tenancy: Array<any>;
  rentals: Array<any>;
  reviews: Array<any>;
  receivedReviews: Array<any>;
  role: any;
  updatedAt: Date;
  messages: Array<any>;
  rooms: Array<any>;
  flats: Array<any>;
  verifications: Array<any>;
};

enum SchoolType {
  COLLEGE = "COLLEGE",
  UNIVERSITY = "UNIVERSITY",
  POLYTECHNIC = "POLYTECHNIC",
}

enum ListingProximity {
  IN = "IN",
  NEAR = "NEAR",
}

enum ListingType {
  STUDIO = "STUDIO",
  SELF_CONTAINED = "SELF_CONTAINED",
  FLAT = "FLAT",
  BLOCK = "BLOCK",
}

enum LikeTarget {
  LISTING = "LISTING",
  USER = "USER",
}

enum ReviewTarget {
  AGENT = "AGENT",
  LANDLORD = "LANDLORD",
  LISTING = "LISTING",
}

enum ChatroomType {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

enum DocumentOwner {
  CHATROOM = "CHATROOM",
  USER = "USER",
  LISTING = "LISTING",
  VERIFICATION = "VERIFICATION",
  ROOM = "ROOM",
  FLAT = "FLAT",
  BLOCK = "BLOCK",
  SCHOOL = "SCHOOL",
  CAMPUS = "CAMPUS",
  CITY = "CITY",
  COUNTRY = "COUNTRY",
  STATE = "STATE",
  MESSAGE = "MESSAGE",
}

enum DocumentRole {
  AVATAR = "AVATAR",
  RESOURCE = "RESOURCE",
  THUMBNAIL = "THUMBNAIL",
  BANNER = "BANNER",
}

export type {
  ChatroomType,
  DocumentRole,
  DocumentOwner,
  LikeTarget,
  ListingProximity,
  ListingType,
  ReviewTarget,
  SchoolType,
  TDecomposeResult,
  TAccessTokenPayload,
  TErrNumber,
  TErrNumbers,
  THandlerOptions,
  TUserData,
  TUserModel,
};
