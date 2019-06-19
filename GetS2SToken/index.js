const otp = require("otp");
const axios = require("axios");

const { S2S_URL, SERVICE_NAME, MICROSERVICE_KEY } = process.env;

module.exports = async function(context) {
  try {
    const payload = {
      microservice: SERVICE_NAME,
      oneTimePassword: otp({ secret: MICROSERVICE_KEY }).totp()
    };

    const headers = {
      "Content-Type": "application/json"
    };

    const response = await axios({
      method: "post",
      url: S2S_URL,
      body: JSON.stringify(payload),
      headers
    });

    const token = response.text();

    context.res = {
      status: 200,
      body: { token }
    };
  } catch (e) {
    context.res = {
      status: 500,
      body: {
        error: {
          message: `Unable to retrieve s2s token: ${e.message}`
        }
      }
    };

    return false;
  }
};
