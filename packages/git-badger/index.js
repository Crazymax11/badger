// @flow
import Store from 'git-badger-leveldown-store';
import server from 'git-badger-core';

import eslintErrorsBadge from 'git-badger-eslint-errors-badge';
import eslintWarningsBadge from 'git-badger-eslint-warnings-badge';
import flowCoverageBadge from 'git-badger-flow-coverage-badge';
import testCoverageBadge from 'git-badger-test-coverage-badge';
import vueComponentDecoratorBadge from 'git-badger-vue-component-decorator-badge';

const badges = {
  'eslint-errors': eslintErrorsBadge,
  'eslint-warnings': eslintWarningsBadge,
  'flow-coverage': flowCoverageBadge,
  'test-coverage': testCoverageBadge,
  'vue-component-decorator': vueComponentDecoratorBadge
};

server(80, new Store('./db'), badges);
