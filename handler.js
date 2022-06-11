"use strict";

module.exports.plasmatic = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Welcome to Plasmatic-serverless prject!",
        purpose: "Jr Full Stack Interview project"
      },
      null,
      2
    ),
  };
};
