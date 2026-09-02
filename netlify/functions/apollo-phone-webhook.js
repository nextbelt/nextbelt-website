// Apollo phone-reveal webhook receiver.
//
// Apollo requires a webhook_url on every async phone-reveal request and POSTs the
// result here. The SMMS lead pipeline never reads this endpoint: it polls Apollo's
// own GET /api/v1/webhook_result/{request_id} for the number. This function exists so
// the delivery lands on a first-party host instead of a public echo service, and it
// deliberately stores and logs NOTHING about the request body.
exports.handler = async () => ({
  statusCode: 200,
  headers: { "Cache-Control": "no-store" },
  body: "",
});
