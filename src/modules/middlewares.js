import { CustomError, ServerError } from "./error.js";

export function errorHandler(err, req, res, next) {
  const isCustom = err instanceof CustomError || err instanceof ServerError;
  if (isCustom) {
    res.status(err.status);
    res.json(err);
    return;
  }
  next();
}
