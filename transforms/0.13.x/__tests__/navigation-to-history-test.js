'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'navigation-to-history');
defineTest(__dirname, 'navigation-to-history', null, 'navigation-to-history-two');
