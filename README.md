# Qevlar
GraphQL API security testing library.

### Developer Information

#### Adding additional tests to the library
1. Create a test file and add it to the "tests" folder that can be configured by importing relevant API information to the qevlarConfig.json file. 
2. Import the configuration file at the top of the test (const config = require('../qevlarConfig.json'))
3. Export your test and import it into the main "qevlar" file. 
4. Adjust the "tests" variable in the qevlar file to include a relevant number as a key. 
5. As the key's value on the "tests" variable, add in an object that has a readable key which users will see this in their terminal and add your test's imported name as the name. 
6. Lastly, add the function name without an invocation. If you invoke the function here then it will run as soon as qevlar runs on start. Invocations are set to happen automatically within the readline module and the settings have already been adjusted.

#### Configuring the testing library for your API
All configuration for testing this library can be done in the qevlarConfig.json file. If you need to add additional information to your test you just need to add this information into the config file and adjust your test functions accordingly. 

#### Adding colors to the library
All color adjustments can be imported first from the color.js file. Only import colors that you use to save on complexity and best practices. Follow existing testing file colors to maintain a similar style across tests.


