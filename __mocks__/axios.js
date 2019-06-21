module.exports = jest
  .fn(() => Promise.resolve("coucou"))
  .mockName("mockedAxios");
