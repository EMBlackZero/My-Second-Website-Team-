"use strict";

/**
 * car controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::car.car", ({ strapi }) => ({
  async increaseRemaining(ctx) {
    const entityId = ctx.params.id;
    try {
      let car = await strapi.entityService.findOne("api::car.car", entityId);
      car = await strapi.entityService.update("api::car.car", entityId, {
        data: { remaining: (car.remaining || 0) + 1 }, // เพิ่มค่า remaining
      });
      ctx.body = { ok: 1, remaining: car.remaining };
    } catch (err) {
      ctx.body = err;
    }
  },

  async decreaseRemaining(ctx) {
    const entityId = ctx.params.id;
    try {
      let car = await strapi.entityService.findOne("api::car.car", entityId);
      car = await strapi.entityService.update("api::car.car", entityId, {
        data: { remaining: (car.remaining || 0) - 1 }, // ลดค่า remaining
      });
      ctx.body = { ok: 1, remaining: car.remaining };
    } catch (err) {
      ctx.body = err;
    }
  },
}));
