import _ from 'lodash';



// standard options for .fetch() requests
const fetchOpts = {
  credentials: 'include'
};

// given an array of Bloomfire resource API URLs, return a promise of response data
const getResources = function (resourceURLs) {
  const resourceReqs = resourceURLs
                         .map(resourceURL => fetch(resourceURL, fetchOpts).then(response => response.json()));
  return Promise.all(resourceReqs);
};

// given a Bloomfire linked resource type and ID, return the URL for the resource
const getResourceURL = (type, id) => `https://rooms.bloomfire.ws/${type}s/${id}`;

// given a Bloomfire linked resource type and ID, return the API URL for the resource
const getResourceAPIURL = resourceObj => `https://rooms.bloomfire.ws/api/v2/${resourceObj.type}s/${resourceObj.id}`;

// given a Bloomfire linked resource object, return a text representation
const encodeLinkedResource = resourceObj => `${resourceObj.type}|${resourceObj.id}`;

// given an array of Bloomfire linked resource objects, return a text string of encoded linked resource objects
const encodeLinkedResources = resourceArr => resourceArr.map(encodeLinkedResource).join('\r\n');

// given a text string of a Bloomfire linked resource, return a linked resource object
const decodeLinkedResource = function (resourceTxt) {
  resourceTxt = resourceTxt.split('|');
  return {
    type: resourceTxt[0],
    id: resourceTxt[1]
  };
};

// given a text string containing Bloomfire linked resources, return an array of linked resource objects
const decodeLinkedResources = resourcesTxt => resourcesTxt.split(/\r?\n/g).map(decodeLinkedResource);

// given a Zendesk user's email
const getBloomfireUserIdByEmail = function (email) {
  return fetch('https://rooms.bloomfire.ws/api/v2/users?fields=email,id', fetchOpts)
           .then(response => response.json())
           .then(users => {
             return _.result(_.find(users, user => {
               return user.email === email;
             }), 'id');
           });
};

const getFormDataFromJSON = function (obj) {
  const formData = new FormData();
  Object.keys(obj).forEach(key => formData.append(key, obj[key]));
  return formData;
};

const capitalizeFirstLetter = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;



export {
  fetchOpts,
  getResources,
  getResourceURL,
  getResourceAPIURL,
  encodeLinkedResource,
  encodeLinkedResources,
  decodeLinkedResource,
  decodeLinkedResources,
  getBloomfireUserIdByEmail,
  getFormDataFromJSON,
  capitalizeFirstLetter
};
