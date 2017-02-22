const db = require('../db');
const boot = require('./boot');
const _udm = opts => {
  return () => {
    const udm = {};
    opts.extend(udm);
    udm.boot = bootOpts => {
      bootOpts = bootOpts || {};
      return boot(udm, bootOpts, db)
    }
    udm.greetings = () => {
        return "hello from the udm";
      };
    return udm;
  };
}

// loading all the modules
const modules = {
  decisionspace: require('./decisionspace'),
  feature:       require('./feature'),
  user:          require('./user'),
  util:          require('./util')
};

// udm initialization options:
const opts = {
  extend: udm => {
    udm.decisionspace= modules.decisionspace(db, udm),
    udm.feature=       modules.feature(db, udm),
    udm.user=          modules.user(db, udm),
    udm.util=          modules.util(db, udm)
  }
}

// load and initialize
const Udm = _udm(opts);
// create udm instance
const udm = Udm();

module.exports = udm;
