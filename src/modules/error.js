function CustomError(error) {
  if (typeof error === 'string') {
    error = { message: error }
  }
  this.status = error.status || 400;
  this.message = error.message || 'Bad Request';
}
CustomError.prototype = Object.create(Error.prototype);


function ServerError(error) {
  if (typeof error === 'string') {
    error = { message: error }
  }
  this.status = error.status || 500;
  this.message = error.message || 'Internal Server Error';
}
ServerError.prototype = Object.create(Error.prototype);

export { CustomError, ServerError };
