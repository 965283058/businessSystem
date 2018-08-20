'use strict';

// had enabled by egg
exports.static = true;

exports.session = true;


exports.validate = {
    enable: true,
    package: 'egg-validate',
};


exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.redis = {
    enable: true,
    package: 'egg-redis',
};

