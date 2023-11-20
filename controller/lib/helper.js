function errorHandler(error, name, from) {
  let loggerFunction = console.log;
  loggerFunction("_________start_________");
  loggerFunction("error occured in " + name);

  if (from === "axios") {
    if (error.response) {
      loggerFunction(error.response.data);
      loggerFunction(error.response.status);
      loggerFunction(error.response.headers);
    } else if (error.request) {
      loggerFunction(error.request);
    } else {
      loggerFunction("Error", error.message);
    }
    loggerFunction(error.toJSON());
  } else {
    loggerFunction(error);
  }
  loggerFunction("________end_________");
}

module.exports = { errorHandler };
