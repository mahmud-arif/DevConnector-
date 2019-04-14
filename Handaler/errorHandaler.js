exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

exports.developmentErrors = (err, req, res, next) => {
  let error = err.data;
  if (error) {
    error = error.map(i => `'${i.param}' : ${i.msg}`).join('');
  }
  const errorDetails = {
    message: err.message,
    status: err.statusCode,
    data: error,
    // stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    // 'text/html': () => {
    //   res.render('error', errorDetails);
    // }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
  });
};

/*
  Production Error Handler
  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
};
