const mockAxios = require("axios");
const getS2SToken = require("../index");

const validHeaders = {
  "s2s-url": "http://stuff/lease",
  "service-name": "my-name",
  "service-key": "the-key"
};

describe("getS2SToken function", () => {
  beforeEach(() => {
    mockAxios.mockReset();
  });

  it("should return an error response when the header parameters are invalid", async () => {
    const done = jest.fn();
    const ctx = { done };
    await getS2SToken(ctx, { headers: {} });

    expect(ctx.res.status).toEqual(500);
  });

  it("should query the s2s server with the right payload", async () => {
    const done = jest.fn();
    const ctx = { done };
    const req = { headers: validHeaders };
    await getS2SToken(ctx, req);

    expect(mockAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(String),
        headers: {
          "Content-Type": "application/json"
        },
        method: "post",
        url: "http://stuff/lease"
      })
    );

    const calledBody = JSON.parse(mockAxios.mock.calls[0][0].body);

    expect(calledBody).toHaveProperty("microservice", "my-name");
    expect(calledBody).toHaveProperty("oneTimePassword");
  });

  it("should return an error response when the s2s server request fails", async () => {
    const done = jest.fn();
    const ctx = { done };
    const req = { headers: validHeaders };
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error("woops")));
    await getS2SToken(ctx, req);

    expect(ctx.res.status).toEqual(500);
  });

  it("should return a response with the token received from the s2s server", async () => {
    const done = jest.fn();
    const ctx = { done };
    const req = { headers: validHeaders };
    mockAxios.mockImplementationOnce(() =>
      Promise.resolve({
        text: () => "hey"
      })
    );
    await getS2SToken(ctx, req);

    expect(ctx.res).toEqual({ status: 200, body: { token: "hey" } });
  });
});
