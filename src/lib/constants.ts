export enum Collections {
  User = "user",
  Auth = "auth",
  Note = "note",
}

export enum HttpStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export enum TIME {
  THIRTY_SECONDS = 30000,
  ONE_MINUTE = 60000,
  TWO_MINUTES = 120000,
  FIVE_MINUTES = 300000,
  TEN_MINUTES = 600000,
  FIFTEEN_MINUTES = 900000,
  THIRTY_MINUTES = 1800000,
  ONE_HOUR = 3600000,
  ONE_DAY = 86400000,
  ONE_WEEK = 604800000,
}