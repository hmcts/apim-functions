/*
 * GetE2e
 * -----------
 *
 * Dummy function
 *
 */

module.exports = async function(context) {
  context.res = {
    status: 200,
    body: { message: "ok" }
  };

  return context.done();
};
