// src/services/api.js

// Set Auth TokenresponseJSON with mock user data and JWTs
function __SET_ACCESS_CODE(code) {
  if (code === null) {
    localStorage.removeItem("vouch-idp-accesstoken");
    return;
  }
  localStorage.setItem("vouch-idp-accesstoken", code);
}

function __GET_ACCESS_CODE() {
  const tokenFromLocalStorage = localStorage.getItem("vouch-idp-accesstoken");
  if (tokenFromLocalStorage) {
    return tokenFromLocalStorage;
  } else {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'slac-vouch') {
        return value;
      }
    }
    return null;
  }
}

const extractJWT = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Development environment: Fetching mock token");
    const responseJSON = await fetch("/api/cwm/v1/mock/users-auth");
    const json = await responseJSON.json();
    const token = json.payload["Name1 Surname1"];
    console.log("Mock token retrieved:", token);
    __SET_ACCESS_CODE(token);
    return token;
  } else {
    console.log("Production or staging environment: Retrieving token from localStorage or cookies");

    let token = __GET_ACCESS_CODE();
    if (token) {
      console.log("Token retrieved:", token);
      return token;
    } else {
      throw new Error('Authentication token not found in localStorage or cookies');
    }
  }
};



// Set domain id
export const setDomainId = async () => {
  try {
    const domainData = await fetchAllDomain();
    const domain_id = domainData.payload[0].id;
    return domain_id;
  } catch (error) {
    console.error('Error setting domain_id:', error.message);
    throw new Error('Unable to determine domain_id');
  }
};

// Utility function to fetch data from the API with authentication headers
export const fetchData = async (url, method = 'GET', body = null, token = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['x-vouch-idp-accesstoken'] = token;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}, StatusText: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Error fetching data from ${url}: ${error.message}`);
  }
};


export const fetchWorkDomain = async (token) => {
  return fetchData('/api/cwm/v1/domain', 'GET', null, token);
};

export const fetchOneWorkDomain = async (domainId, token) => {
  return fetchData(`/api/cwm/v1/domain/${domainId}`, 'GET', null, token);
};

export const createWorkDomain = async (domainData, token) => {
  return fetchData(`/api/cwm/v1/domain`, 'POST', domainData, token);
};


export const fetchEntriesByOriginId = async (originId) => {
  try {
    const token = await extractJWT();
    const limit = 25; // Set the limit to 25
    const url = `/api/elog/v1/entries?originId=${originId}&limit=${limit}`; // Append the limit parameter to the URL
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-vouch-idp-accesstoken': token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch entries by originId: ${originId}. Status: ${response.status}, StatusText: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    throw error;
  }
};

export const createActivityLog = async (workId, activityId, formData) => {
  const token = await extractJWT();
  const response = await fetchData(
    `http://localhost:3000/api/cwm/v1/log/work/${workId}/activity/${activityId}`,
    'POST',
    token,
    formData
  );

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to create activity log entry");
  }
};

export const createWorkLog = async (workId, formData) => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      `api/cwm/v1/log/work/${workId}`,
      {
        method: "POST",
        headers: {
          "x-vouch-idp-accesstoken": token,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to create log entry");
    }
  } catch (error) {
    throw new Error("Error creating log entry: " + error.message);
  }
};

export const fetchLovValuesForField = async (domainType, subtypeId, fieldName) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}/${fieldName}`, 'GET', null);
};

export const fetchLovValues = async (domainType, subtypeId) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}`, 'GET', null);
};

export const fetchAllActivity = async () => {
  return fetchData(`/api/cwm/v1/activity?limit=100`, 'GET', null);
};

export const fetchAActivity = async (workId, activityId) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity/${activityId}`, 'GET', null);
};

export const fetchActivity = async (workId) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity`, 'GET', null);
};

export const createActivity = async (workId, activityData) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity`, 'POST', JSON.stringify(activityData));
};

export const updateActivity = async (workId, activityId, activityData) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity/${activityId}`,'PUT', JSON.stringify(activityData));
};

export const updateWork = async (workId, workData) => {
  return fetchData(`/api/cwm/v1/work/${workId}`, 'PUT', JSON.stringify(workData));
};

export const fetchWork = async () => {
  return fetchData(`/api/cwm/v1/work?limit=100`, 'GET');
};

export const fetchAWork = async (workId) => fetchData(`/api/cwm/v1/work/${workId}`, 'GET');

export const createWork = async (workData) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      "/api/cwm/v1/work",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(workData)
      }
    );

    if (response.status === 201) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error creating work:", errorData);
      throw new Error("Error creating work. Please try again.");
    }
  } catch (error) {
    console.error("Error creating work:", error);
    return { errorCode: -1, payload: [] }; // Return a default error response
  }
};

export const fetchWorkType = async () => {
  return await fetchData('/api/cwm/v1/work/work-type', 'GET');
};

export const fetchActivityType = async () => {
  return await fetchData('/api/cwm/v1/work/activity-type', 'GET');
};

export const fetchActivitySubtype = async () => {
  return await fetchData('/api/cwm/v1/work/activity-type-subtype', 'GET');
};

export const fetchProfile = async () => {
  return await fetchData('/api/cwm/v1/auth/me', 'GET');
};

export const fetchUsers = async (search) => {
  return await fetchData(`/api/cwm/v1/auth/users${search ? `?search=${search}` : ''}`, 'GET');
};

export const fetchShopGroups = async () => {
  return await fetchData('/api/cwm/v1/shop-group', 'GET');
};

export const createShopGroup = async (shopGroupData) => {
  return await fetchData('/api/cwm/v1/shop-group', 'POST', JSON.stringify(shopGroupData));
};

export const fetchLocations = async () => {
  return await fetchData('/api/cwm/v1/location', 'GET');
};

export const createLocation = async (locationData) => {
  const response = await fetchData('/api/cwm/v1/location', 'POST', JSON.stringify(locationData));

  if (response.status === 201) {
    const data = await response.json();
    console.log('Location created successfully:', data);
  } else {
    const errorData = await response.json();
    console.error('Error creating location:', errorData);
    alert('Error creating location. Please try again.');
  }
};

export const getLocationById = async (locationId) => {
  return await fetchData(`/api/cwm/v1/location/${locationId}`, 'GET');
};

export const fetchLogbooks = async () => {
  return await fetchData('/api/elog/v1/logbooks', 'GET');
};


export const fetchAllElements = async (limit = 10, page = 1, anchorId = null, searchQuery = "") => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const url = `/api/cis/v1/inventory/domain/${domain_id}/element?limit=${limit}&page=${page}${anchorId ? `&anchorId=${anchorId}` : ''}${searchParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-vouch-idp-accesstoken': token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Log details before throwing the error
      console.error(`Failed to fetch inventory elements. URL: ${url}, Status: ${response.status}, StatusText: ${response.statusText}`);

      // Include detailed error message
      const errorData = await response.json().catch(() => null); // Try to parse JSON error response
      const errorMessage = errorData?.message || 'Unknown error';

      throw new Error(`Error fetching inventory elements. Status: ${response.status}, Message: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error fetching inventory elements:', error.message);
    throw error; // Re-throw the original error for higher-level handling
  }
};

export default {};
