function errorFormatter({
  fields: sqlError,
  errors: sequelizeError,
  message: defaultError,
}) {
  let listOfErrors = [];
  if (sequelizeError) {
    for (const error of sequelizeError) {
      listOfErrors.push(error.message);
      return listOfErrors;
    }
  }

  if (sqlError) {
    for (const error of sqlError) {
      listOfErrors.push(`${error} is not available`);
      return listOfErrors;
    }
  }
  return [defaultError];
}

module.exports = errorFormatter;
