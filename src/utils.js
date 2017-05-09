import _ from 'lodash';



// standard options for .fetch() requests
const fetchOpts = {
  credentials: 'include',
  mode: 'cors',
  headers: new Headers({ 'Bloomfire-Integration': 'Zendesk 1.0' })
};



// convert text containing newlines into paragraphs
const paragraphify = function (text) {
  let lines = text
                .split(/(?:\r\n|\r|\n)+/g) // split text at one or more newlines
                .map(line => _.trim(line)); // trim each line
  lines = _.filter(lines, line => line.length > 0); // only keep lines with content
  lines = lines.map(line => `<p>${line}</p>`); // wrap lines in paragraph tags
  return lines.join(''); // rejoin
};



//
const getCustomFieldID = function (client) {
  const devID = 58324067; // found in the class `custom_field_[ID]` on the <div class="form_field"> that wraps the text field in the Zendesk ticket UI
  return Promise.all([
    client.get('requirement:bloomfire_linked_resources'), // field automatically created on app installation via app/requirements.json
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
const getResourcesTxtFromCustomField = function (client) {
  let customFieldID;
  return getCustomFieldID(client)
           .then(function (id) {
             customFieldID = id; // cache value
             // if (getFromServer) {
             return getFromClientTicket(client, 'id')
                      .then(data => client.request(`/api/v2/tickets/${data.id}.json`))
                      .then(function (data) {
                        const customFieldObj = _.find(data.ticket.custom_fields, field => field.id === customFieldID);
                        return customFieldObj.value || '';
                      });
            // } else { // get from ticket field client-side
            //   return getFromClientTicket(client, `customField:custom_field_${customFieldID}`)
            //            .then(data => data[`customField:custom_field_${customFieldID}`]);
            // }
           });
};



// given a Bloomfire linked resource domain, type and ID, return the URL for the resource
const getResourceURL = function (domain, type, id, loginToken) {
  let url = `https://${domain}/${type}s/${id}`;
  if (typeof loginToken !== 'undefined') {
    url += `?token=${loginToken}`;
  }
  return url;
};



// given a Bloomfire linked resource domain, type and ID, return the API URL for the resource
const getResourceAPIURL = (domain, type, id) => `https://${domain}/api/v2/${type}s/${id}`;



// given a Bloomfire linked resource object, return a text representation
const encodeLinkedResource = resourceObj => `${resourceObj.type}|${resourceObj.id}`;



// given an array of Bloomfire linked resource objects, return a text string of encoded linked resource objects
const encodeLinkedResources = resourcesArr => resourcesArr.map(encodeLinkedResource).join(',');



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
    return resourcesTxt.split(',').map(decodeLinkedResource);
  } else {
    return [];
  }
}



// given a Zendesk user's email, match it to their Bloomfire email and get their Bloomfire ID
const getBloomfireUserIDByEmail = function (client, email, handleAPILock) {
  return Promise.all([
           getTokens(client),
           client.metadata()
         ])
           .then(function (values) {
             const sessionToken = values[0].sessionToken,
                   domain = values[1].settings.bloomfire_domain;
             return fetch(`https://${domain}/api/v2/users?fields=email,id&session_token=${sessionToken}`, fetchOpts)
                      .then(handleAPILock) // handle 403/422 status codes
                      .then(response => response.json())
                      .then(users => {
                        return _.result(_.find(users, user => {
                          return user.email === email;
                        }), 'id');
                      })
                        .catch(_.noop); // suppress error (no need to continue)
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
const normalizeResource = (resourceObj) => {
  const normalResourceObj = {
    id: resourceObj.id,
    type: resourceObj.contribution_type,
    public: resourceObj.public,
    title: resourceObj.title || resourceObj.question,
    display: true // set to display initially
  };
  if (resourceObj.url) {
    normalResourceObj.url = resourceObj.url;
  }
  return normalResourceObj;
};



//
let tokens = {};
const getTokens = function (client) {
  if (tokens.sessionToken && tokens.loginToken) {
    return Promise.resolve(tokens);
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
               return fetch(`https://${domain}/api/v2/login?email=${encodeURIComponent(email)}&api_key=${key}&fields=session_token,login_token`)
                        .then(data => data.json())
                        .then(function (data) {
                          tokens = {
                            sessionToken: data.session_token,
                            loginToken: data.login_token
                          };
                          return tokens;
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
           getTokens(client),
           client.metadata()
         ])
           .then(function (values) {
             const sessionToken = values[0].sessionToken,
                   domain = values[1].settings.bloomfire_domain,
                   resourceReqs = resourcesArr.map(function (resource) {
                     return fetch(`${getResourceAPIURL(domain, resource.type, resource.id)}?fields=id,public,published,contribution_type,title,description,question,explanation,url&session_token=${sessionToken}`, fetchOpts)
                              .then(response => response.json());
                   });
             return Promise.all(resourceReqs);
           });
};



//
const showNewTicketMessage = function (client, type, id, loginToken) {
  client.metadata()
    .then(metadata => {
      const resource = capitalizeFirstLetter(type),
            postURL = getResourceURL(metadata.settings.bloomfire_domain, type, id),
            postHref = getResourceURL(metadata.settings.bloomfire_domain, type, id, loginToken),
            message = `You’ve created a new Bloomfire ${resource}. View it here: <a href="${postHref}" target="_blank">${postURL}</a>`;
      client.invoke('notify', message, 'notice');
    });
};



// build and append href values to resources
const addHrefs = function (domain, resourcesArr, loginToken) {
  resourcesArr.forEach(function (resourceObj) {
    resourceObj.href = resourceObj.url ? `${resourceObj.url}?token=${loginToken}` : getResourceURL(domain, resourceObj.type, resourceObj.id, loginToken);
  });
};



export {
  paragraphify,
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
  normalizeResource,
  getTokens,
  getFromClientTicket,
  showNewTicketMessage
};
