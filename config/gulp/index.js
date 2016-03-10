import registerBuild from './tasks/build';
import registerClean from './tasks/clean';
import registerDefault from './tasks/default';
import registerLint from './tasks/lint';
import registerSelenium from './tasks/selenium';
import registerTest from './tasks/test';

registerClean();
registerLint();
registerTest();
registerBuild();
registerSelenium();

registerDefault();
