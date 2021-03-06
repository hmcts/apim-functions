const mockAxios = require("axios");
const getTotp = require("../index");

const validHeaders = {
  "service-key": "the-key"
};

describe("GetTotp function", () => {
  beforeEach(() => {
    mockAxios.mockReset();
  });

  it("should return an error response when the header parameters are invalid", async () => {
    const done = jest.fn();
    const ctx = { done };
    await getTotp(ctx, { headers: {} });

    expect(ctx.res.status).toEqual(500);
  });

  it("should return a response with the totp", async () => {
    const done = jest.fn();
    const ctx = { done };
    const req = { headers: validHeaders };
    await getTotp(ctx, req);

    expect(ctx.res.status).toEqual(200);
    expect(ctx.res.body.totp).toMatch(/[0-9\(\)]+/);
  });
});
