const otp = require("otp");

/*
 * GetTotp
 * -----------
 *
 * Returns a Time based One Time Password from the provided secret
 *
 * Expected headers parameters:
 *
 * @param   {String} "service-key"    secret to use
 * @returns {Object}                  http response object
 */

module.exports = async function(context, req) {
  try {
    const { ["service-key"]: serviceKey } = req.headers;

    if (serviceKey === undefined) {
      context.res = {
        status: 500,
        body: {
          error: {
            message: "Invalid service-key header"
          }
        }
      };
      return context.done();
    }

    const timeBasedOneTimePassword = otp({ secret: serviceKey }).totp();

    context.res = {
      status: 200,
      body: { totp: timeBasedOneTimePassword }
    };

    return context.done();
  } catch (e) {
    context.res = {
      status: 500,
      body: {
        error: {
          message: `Unable to generate totp: ${e.message}`
        }
      }
    };
    return context.done();
  }
};
