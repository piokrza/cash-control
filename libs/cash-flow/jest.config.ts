/* eslint-disable */
import { getJestConfig } from '../../jest.config.base';
import { Config } from 'jest';

const projectName = 'cash-flow';

const config: Config = {
  ...getJestConfig(projectName),
};

export default config;
