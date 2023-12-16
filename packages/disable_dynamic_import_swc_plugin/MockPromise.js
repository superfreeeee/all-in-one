console.log('load MockPromise.js');
function self() {
  return this;
}
module.exports = { then: self, catch: self, finally: self };
