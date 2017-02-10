import _ from 'lodash';



// standard options for .fetch() requests
const fetchOpts = {
  credentials: 'include'
};



//
const getCustomFieldID = function (client) {
  const devID = 54394587; // found in the class `custom_field_[ID]` on the <div class="form_field"> that wraps the textarea in the Zendesk ticket UI
  return Promise.all([
    getFromClientTicket(client, 'requirement:bloomfire_linked_resources'), // field automatically created on app installation via app/requirements.json
    getFromClientTicket(client, `customField:custom_field_${devID}`) // field manually created for development
  ])
    .then(function (values) {
      const prod = values[0]['requirement:bloomfire_linked_resources'],
            dev = values[1][`customField:custom_field_${devID}`];
      if (typeof prod !== 'undefined') {
        return prod.requirement_id;
      } else if (typeof dev !== 'undefined') {
        return devID;
      }
    });
};



//
const getResourcesTxtFromCustomField = function (client, getFromServer = true) {
  let customFieldID;
  return getCustomFieldID(client)
           .then(function (id) {
             customFieldID = id; // cache value
             if (getFromServer) {
               return getFromClientTicket(client, 'id')
                        .then(data => client.request(`/api/v2/tickets/${data.id}.json`))
                        .then(function (data) {
                          const resourcesTxt = _.result(_.find(data.ticket.custom_fields, field => {
                                  return field.id === customFieldID;
                                }), 'value');
                          return resourcesTxt;
                        });
             } else {
               return getFromClientTicket(client, `customField:custom_field_${customFieldID}`)
                        .then(data => data[`customField:custom_field_${customFieldID}`]);
             }
           });
};



// given a Bloomfire linked resource domain, type and ID, return the URL for the resource
const getResourceURL = (domain, type, id) => `https://${domain}/${type}s/${id}`;



// given a Bloomfire linked resource domain, type and ID, return the API URL for the resource
const getResourceAPIURL = (domain, type, id) => `https://${domain}/api/v2/${type}s/${id}`;



// given a Bloomfire linked resource object, return a text representation
const encodeLinkedResource = resourceObj => `${resourceObj.type}|${resourceObj.id}`;



// given an array of Bloomfire linked resource objects, return a text string of encoded linked resource objects
const encodeLinkedResources = resourcesArr => resourcesArr.map(encodeLinkedResource).join('\r\n');



// given a text string of a Bloomfire linked resource, return a linked resource object
const decodeLinkedResource = function (resourcesTxt) {
  resourcesTxt = resourcesTxt.split('|');
  return {
    type: resourcesTxt[0],
    id: parseInt(resourcesTxt[1], 10)
  };
};



// given a text string containing Bloomfire linked resources, return an array of linked resource objects
const decodeLinkedResources = function (resourcesTxt) {
  if (resourcesTxt.length > 0) {
    return resourcesTxt.split(/\r?\n/g).map(decodeLinkedResource);
  } else {
    return [];
  }
}



// given a Zendesk user's email
const getBloomfireUserIDByEmail = function (client, email) {
  return Promise.all([
           getSessionToken(client),
           client.metadata()
         ])
           .then(function (values) {
             const token = values[0],
                   domain = values[1].settings.bloomfire_domain;
             return fetch(`https://${domain}/api/v2/users?fields=email,id&session_token=${token}`, fetchOpts)
                      .then(response => response.json())
                      .then(users => {
                        return _.result(_.find(users, user => {
                          return user.email === email;
                        }), 'id');
                      });
           });
};



//
const getFormDataFromJSON = function (obj) {
  const formData = new FormData();
  Object.keys(obj).forEach(key => formData.append(key, obj[key]));
  return formData;
};



//
const capitalizeFirstLetter = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;



//
const trimResource = (resource) => ({
  id: resource.id,
  type: resource.contribution_type,
  public: resource.public,
  title: resource.title || resource.question,
  display: true // set to display initially
});



//
let sessionToken;
const getSessionToken = function (client) {
  if (sessionToken) {
    return Promise.resolve(sessionToken);
  } else {
    return Promise.all([
             client
               .get('currentUser.email') // get current user's email via Zendesk client SDK
               .then(data => data['currentUser.email']), // extract the returned property
             client.metadata()
           ])
             .then(function (values) {
               const email = values[0],
                     domain = values[1].settings.bloomfire_domain,
                     key = values[1].settings.bloomfire_api_key;
               return fetch(`https://${domain}/api/v2/login?email=${encodeURIComponent(email)}&api_key=${key}`)
                        .then(data => data.json())
                        .then(function (data) {
                          if (typeof sessionToken === 'undefined') {
                            sessionToken = data.session_token;
                          }
                          return data.session_token;
                        });
             });
  }
};



// convenience wrapper to ZAF's client.get() for `ticket` property
// TODO: abstract this for other properties besides `ticket`
const getFromClientTicket = function (client, ...paths) {
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
const getResources = function (client, resourcesArr) {
  return Promise.all([
           getSessionToken(client),
           client.metadata()
         ])
           .then(function (values) {
             const token = values[0],
                   domain = values[1].settings.bloomfire_domain,
                   resourceReqs = resourcesArr.map(function (resource) {
                     return fetch(`${getResourceAPIURL(domain, resource.type, resource.id)}?session_token=${token}`, fetchOpts)
                              .then(response => response.json());
                   });
             return Promise.all(resourceReqs);
           });
};



//
const showNewTicketMessage = function (client, type, id) {
  client.metadata()
    .then(metadata => {
      const resource = capitalizeFirstLetter(type),
            postURL = `https://${metadata.settings.bloomfire_domain}/${type}s/${id}`,
            message = `You’ve created a new Bloomfire ${resource}. View it here: <a href="${postURL}" target="_blank">${postURL}</a>`;
      client.invoke('notify', message, 'notice');
    });
};



// build and append href values to resources
const addHrefs = function (domain, resourcesArr) {
  resourcesArr.forEach(function (resourceObj) {
    resourceObj.href = getResourceURL(domain, resourceObj.type, resourceObj.id);
  });
};



export {
  getCustomFieldID,
  getResourcesTxtFromCustomField,
  addHrefs,
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
  getFromClientTicket,
  showNewTicketMessage
};
