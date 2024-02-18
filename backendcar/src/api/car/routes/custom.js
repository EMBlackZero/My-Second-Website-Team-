'use strict';

module.exports = {
  routes: [ // custom routes
    {
      method: 'GET',
      path: '/cars/:id/increase_remaining', // custom route เพิ่ม remaining
      handler: 'car.increaseRemaining'
    },
    {
      method: 'GET',
      path: '/cars/:id/decrease_remaining', // custom route ลด remaining
      handler: 'car.decreaseRemaining'
    }
  ]
}
