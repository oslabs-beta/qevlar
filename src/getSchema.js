const config = require('./qevlarConfig.json');
const readline = require('readline'); // => console interaction module
const fs = require('fs');
const path = require('path');

// //getCircularRefField function
const getCircularRefField = (schema) => {
  const visited = new Set();
  //create variable, 'circularRef', assign null to its value
  let circularRef = null;
  //iterate through array of types in schema object
  schema.types.forEach((type) => {
    //we need to find relevant schema types that aren't generic data types
    //these can be found in the root query so if the description is root query we go in there
    if (type.description === 'Root Query') {
      //iterate through fields array in type object
      type.fields.forEach((field) => {
        //if name key is not null
        if (field.type.name) {
          //add that to our set object
          visited.add(field.type.name);
        }
      });
    }
    //we need to iterate through valid fields array in type object
    //make sure fields is not null
    if (type.fields) {
      //iterate through fields array
      type.fields.forEach((field) => {
        //if set object has a value of name that matches
        if (visited.has(field.type.name)) {
          //assign that to circularRef
          circularRef = field.type.name;
        }
      });
    }
  });

  return circularRef;
};

getTopAndSubField = (schema) => {
  //extract types array from schema
  const types = schema.data.__schema.types;

  //create variables for root query, top field, top obj type, subfield
  let rootQuery;
  let topField;
  let topObjType;
  let subField;

  //get circularRef field
  const circularRefField = getCircularRefField(schema.data.__schema);

  //iterate through types array
  types.forEach((type) => {
    //if type name is strictly equal to query
    if (type.name === 'Query') {
      //assign type to rootQuery variable
      rootQuery = type;
    }
  });

  //get the top field from root query
  topField = rootQuery.fields[0].name;
  //get the top object type from root query
  topObjType = rootQuery.fields[0].type.name;

  //find the type that matches the topObjType name in the types array
  const getSubField = types.find((type) => type.name === topObjType);

  //assign the name of the first field to subfield
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
};

const getSchema = (url) => {
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
      return 'sucess';
    })
    .catch((error) => {
      console.log('error', error);
    });
};

module.exports = getSchema;
