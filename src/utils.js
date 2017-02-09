import _ from 'lodash';



// standard options for .fetch() requests
const fetchOpts = {
  credentials: 'include'
};

// given a Bloomfire linked resource type and ID, return the URL for the resource
const getResourceURL = (type, id) => `https://mashbox.bloomfire.biz/${type}s/${id}`;

// given a Bloomfire linked resource type and ID, return the API URL for the resource
const getResourceAPIURL = resourceObj => `https://mashbox.bloomfire.biz/api/v2/${resourceObj.type}s/${resourceObj.id}`;

// given a Bloomfire linked resource object, return a text representation
const encodeLinkedResource = resourceObj => `${resourceObj.type}|${resourceObj.id}`;

// given an array of Bloomfire linked resource objects, return a text string of encoded linked resource objects
const encodeLinkedResources = resourceArr => resourceArr.map(encodeLinkedResource).join('\r\n');

// given a text string of a Bloomfire linked resource, return a linked resource object
const decodeLinkedResource = function (resourceTxt) {
  resourceTxt = resourceTxt.split('|');
  return {
    type: resourceTxt[0],
    id: parseInt(resourceTxt[1], 10)
  };
};

// given a text string containing Bloomfire linked resources, return an array of linked resource objects
const decodeLinkedResources = function(resourcesTxt) {
  if (resourcesTxt.length > 0) {
    return resourcesTxt.split(/\r?\n/g).map(decodeLinkedResource);
  } else {
    return [];
  }
}

// given a Zendesk user's email
const getBloomfireUserIDByEmail = function (client, email) {
  return getSessionToken(client)
           .then(token => {
             return fetch(`https://mashbox.bloomfire.biz/api/v2/users?fields=email,id&session_token=${token}`, fetchOpts)
                      .then(response => response.json())
                      .then(users => {
                        return _.result(_.find(users, user => {
                          return user.email === email;
                        }), 'id');
                      });
           });
};

const getFormDataFromJSON = function (obj) {
  const formData = new FormData();
  Object.keys(obj).forEach(key => formData.append(key, obj[key]));
  return formData;
};

const capitalizeFirstLetter = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const trimResource = (resource) => ({
  id: resource.id,
  type: resource.contribution_type,
  public: resource.public,
  title: resource.title || resource.question,
  display: true // set to display initially
});

let sessionToken;
const getSessionToken = function(client) {
  if (sessionToken) {
    return Promise.resolve(sessionToken);
  } else {
    return client.get('currentUser.email') // get current user's email via Zendesk client SDK
      .then(data => data['currentUser.email']) // extract the returned property
      .then(email => fetch(`https://mashbox.bloomfire.biz/api/v2/login?email=${encodeURIComponent(email)}&api_key=18aef5db45af3d1e72fd6030d1bef033f81aab72`))
      .then(data => data.json())
      .then(function(data) {
        if (typeof sessionToken === 'undefined') {
          sessionToken = data.session_token;
        }
        return data.session_token;
      });
  }
};

// convenience wrapper to this.client.get()
const getFromClientTicket = function(client, ...paths) {
  paths = paths.map(path => `ticket.${path}`);
  return client.get(paths)
    .then(data => {
      let obj = {};
      for (let key in data) {
        if (key !== 'errors') { // discard errors object
          obj[key.slice(7)] = data[key]; // remove 'ticket.' prefix
        }
      }
      return obj;
    });
};

// given an array of Bloomfire resource API URLs, return a promise of response data
const getResources = function (client, resourceURLs) {
  const resourceReqs = resourceURLs.map(resourceURL => {
    return getSessionToken(client)
             .then(token => fetch(`${resourceURL}?session_token=${token}`, fetchOpts))
             .then(response => response.json());
  });
  return Promise.all(resourceReqs);
};



export {
  fetchOpts,
  getResources,
  getResourceURL,
  getResourceAPIURL,
  encodeLinkedResource,
  encodeLinkedResources,
  decodeLinkedResource,
  decodeLinkedResources,
  getBloomfireUserIDByEmail,
  getFormDataFromJSON,
  capitalizeFirstLetter,
  trimResource,
  getSessionToken,
  getFromClientTicket
};
