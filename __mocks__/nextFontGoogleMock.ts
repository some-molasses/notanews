// __mocks__/nextFontGoogleMock.js
module.exports = new Proxy(
  {},
  {
    get: () => () => ({
      className: "mocked-font-class",
      style: { fontFamily: "mocked-font" },
    }),
  },
);
