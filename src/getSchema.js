const config = require('./qevlarConfig.json');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

//Find match between types and types referenced in fields to populate CIRCULAR_REF_FIELD in qevlarConfig.json
const getCircularRefField = (schema) => {
  const visited = new Set();
  let circularRef = null;
  schema.types.forEach((type) => {
    if (type.description === 'Root Query') {
      type.fields.forEach((field) => {
        if (field.type.name) {
          visited.add(field.type.name);
        }
      });
    }

    if (type.fields) {
      type.fields.forEach((field) => {
        if (visited.has(field.type.name)) {
          circularRef = field.type.name;
        }
      });
    }
  });

  return circularRef;
};

//Extract types array to populate TOP_LEVEL_FIELD and SUB_FIELD in qevlarConfig.json
const getTopAndSubField = (schema) => {
  const types = schema.data.__schema.types;

  let rootQuery;
  let topField;
  let topObjType;
  let subField;

  const circularRefField = getCircularRefField(schema.data.__schema);

  types.forEach((type) => {
    if (type.name === 'Query') {
      rootQuery = type;
    }
  });

  topField = rootQuery.fields[0].name;
  topObjType = rootQuery.fields[0].type.name;

  const getSubField = types.find((type) => type.name === topObjType);

  subField = getSubField.fields[0].name;

  config.TOP_LEVEL_FIELD = topField;
  config.SUB_FIELD = subField;
  config.CIRCULAR_REF_FIELD = circularRefField;
};
const introspectionQuery = `{
    __schema {
      types {
        name
        description
        fields {
          name
          description
          type {
            name
            kind
          }
        }
      }
    }
  }`;

// Dynamically generate qevlarConfig.json
const modifyConig = () => {
  fs.writeFile(
    path.join(__dirname, './qevlarConfig.json'),
    JSON.stringify(config, null, 2),
    (err) => {
      if (err) {
        console.log('error writing to qevlarConfig.json:', err);
      } else {
        console.log('qevlarConfig.json updated successfully!');
      }
    }
  );
  return 'success';
};

const getSchema = (url, returnToTestMenu) => {
  config.API_URL = url;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery }),
  })
    .then((res) => {
      console.log('res status', res.status);
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((data) => {
      getTopAndSubField(data);

      modifyConig();
      if (returnToTestMenu) returnToTestMenu();
    })
    .catch((error) => {
      console.log('error', error);
    });
};

module.exports = getSchema;
