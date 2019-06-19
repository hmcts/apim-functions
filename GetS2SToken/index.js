const otp = require("otp");
const axios = require("axios");

/*
 * GetS2SToken
 * -----------
 *
 * Fetches the s2s token from the provided s2s service on behalf of the provided service
 *
 * Expected headers parameters:
 *
 * @param   {String} "s2s-url"        url of the s2s endpoint generating the token
 * @param   {String} "service-name"   name of the service this function acts on behalf from
 * @param   {String} "service-key"    secret to use
 * @returns {Object}                  http response object
 */

module.exports = async function(context, req) {
  try {
    const {
      ["s2s-url"]: s2sUrl,
      ["service-name"]: serviceName,
      ["service-key"]: serviceKey
    } = req.headers;

    const payload = {
      microservice: serviceName,
      oneTimePassword: otp({ secret: serviceKey }).totp()
    };

    const headers = {
      "Content-Type": "application/json"
    };

    const response = await axios({
      method: "post",
      url: s2sUrl,
      body: JSON.stringify(payload),
      headers
    });

    const token = response.text();

    context.res = {
      status: 200,
      body: { token }
    };

    return context.done();
  } catch (e) {
    context.res = {
      status: 500,
      body: {
        error: {
          message: `Unable to retrieve s2s token: ${e.message}`
        }
      }
    };
    return context.done();
  }
};
