const stripHtml = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '').trim();
};

const deepSanitize = (input) => {
  if (Array.isArray(input)) {
    return input.map(deepSanitize);
  }

  if (input && typeof input === 'object') {
    const sanitizedObject = {};
    Object.entries(input).forEach(([key, value]) => {
      sanitizedObject[key] = deepSanitize(value);
    });
    return sanitizedObject;
  }

  return stripHtml(input);
};

const sanitizeInputs = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitize(req.query);
  }

  next();
};

module.exports = sanitizeInputs;
