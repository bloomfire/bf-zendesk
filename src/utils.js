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
const getResourceAPIURL = (type, id) => `https://rooms.bloomfire.ws/api/v2/${type}s/${id}`;

// given an array of Bloomfire linked resource objects, return a text string of encoded linked resource objects
const encodeLinkedResources = function (resourceArr) {
  const resourceTxt = resourceArr.map(resource => `${resource.type}|${resource.id}`).join('\r\n');
  return resourceTxt;
};

// given a text string containing Bloomfire linked resources, return an array of linked resource objects
const decodeLinkedResources = function (resourceTxt) {
  const resourceArr = resourceTxt.split(/\r?\n/g).map(resource => {
    resource = resource.split('|');
    return {
      type: resource[0],
      id: resource[1]
    };
  });
  return resourceArr;
};



export {
  fetchOpts,
  getResources,
  getResourceURL,
  getResourceAPIURL,
  encodeLinkedResources,
  decodeLinkedResources
};
