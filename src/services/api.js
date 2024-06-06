// src/services/api.js

// Set domain id
export const setDomainId = async () => {
  try {
    const domainData = await fetchWorkDomain();
    const domain_id = domainData.payload[0].id;
    console.log(domain_id)
;    return domain_id;
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
    } else {
      // Fetch the access token if not provided
      if (process.env.NODE_ENV === 'development') {
        const responseJSON = await fetch("/api/cwm/v1/mock/users-auth");
        const json = await responseJSON.json();
        token = json.payload["Name1 Surname1"];
      }
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

export const fetchEntriesByOriginId = async (originId, token) => {
  try {
    const limit = 25;
    const url = `/api/elog/v1/entries?originId=${originId}&limit=${limit}`; // Append the limit parameter to the URL
    return fetchData(url, 'GET', null, token);
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    throw error;
  }
};

export const createActivityLog = async (workId, activityId, formData, token) => {
  try {
    return await fetchData(
      `http://localhost:3000/api/cwm/v1/log/work/${workId}/activity/${activityId}`,
      'POST',
      formData,
      token
    );
  } catch (error) {
    throw new Error("Failed to create activity log entry: " + error.message);
  }
};

export const createWorkLog = async (workId, formData, token) => {
  try {
    return await fetchData(
      `api/cwm/v1/log/work/${workId}`,
      'POST',
      formData,
      token
    );
  } catch (error) {
    throw new Error("Failed to create log entry: " + error.message);
  }
};

export const fetchLovValuesForField = async (domainType, subtypeId, fieldName, token) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}/${fieldName}`, 'GET', null, token);
};

export const fetchLovValues = async (domainType, subtypeId, token) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}`, 'GET', null, token);
};

export const fetchAllActivity = async (token) => {
  return fetchData(`/api/cwm/v1/activity?limit=100`, 'GET', null, token);
};

export const fetchAActivity = async (workId, activityId, token) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity/${activityId}`, 'GET', null, token);
};

export const fetchActivity = async (workId, token) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity`, 'GET', null, token);
};

export const createActivity = async (workId, activityData, token) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity`, 'POST', JSON.stringify(activityData), token);
};

export const updateActivity = async (workId, activityId, activityData, token) => {
  return fetchData(`/api/cwm/v1/work/${workId}/activity/${activityId}`, 'PUT', JSON.stringify(activityData), token);
};

export const updateWork = async (workId, workData, token) => {
  return fetchData(`/api/cwm/v1/work/${workId}`, 'PUT', JSON.stringify(workData), token);
};

export const fetchWork = async (token) => {
  return fetchData(`/api/cwm/v1/work?limit=100`, 'GET', token);
};

export const fetchAWork = async (workId, token) => fetchData(`/api/cwm/v1/work/${workId}`, 'GET', token);

export const createWork = async (workData, token) => {
  const response = await fetchData(
    "/api/cwm/v1/work",
    'POST',
    workData,
    token
  );

  if (response.status === 201) {
    console.log(response);
    return response;
  } else {
    const errorData = await response.json();
    console.error("Error creating work:", errorData);
    throw new Error("Error creating work. Please try again.");
  }
};

export const fetchWorkType = async (token) => {
  return await fetchData('/api/cwm/v1/work/work-type', 'GET', null, token);
};

export const fetchActivityType = async (token) => {
  return await fetchData('/api/cwm/v1/work/activity-type', 'GET', null, token);
};

export const fetchActivitySubtype = async (token) => {
  return await fetchData('/api/cwm/v1/work/activity-type-subtype', 'GET', null, token);
};

export const fetchProfile = async (token) => {
  return await fetchData('/api/cwm/v1/auth/me', 'GET', null, token);
};

export const fetchUsers = async (search, token) => {
  console.log(search);
  return await fetchData(`/api/cwm/v1/auth/users${search ? `?search=${search}` : ''}`, 'GET', null, token);
};

export const fetchShopGroups = async (token) => {
  return await fetchData('/api/cwm/v1/shop-group', 'GET', null, token);
};

export const createShopGroup = async (shopGroupData, token) => {
  return await fetchData('/api/cwm/v1/shop-group', 'POST', shopGroupData, token);
};

export const fetchLocations = async (token) => {
  return await fetchData('/api/cwm/v1/location', 'GET', null, token);
};

export const createLocation = async (locationData, token) => {
  const response = await fetchData('/api/cwm/v1/location', 'POST', locationData, token);

  if (response.status === 201) {
    const data = await response.json();
    console.log('Location created successfully:', data);
  } else {
    const errorData = await response.json();
    console.error('Error creating location:', errorData);
    alert('Error creating location. Please try again.');
  }
};

export const getLocationById = async (locationId, token) => {
  return await fetchData(`/api/cwm/v1/location/${locationId}`, 'GET', null, token);
};

export const fetchLogbooks = async (token) => {
  return await fetchData('/api/elog/v1/logbooks', 'GET', null, token);
};

export const fetchAllElements = async (limit = 10, page = 1, anchorId = null, searchQuery = "", token) => {
  try {
    const domain_id = await setDomainId();
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
    const url = `/api/cis/v1/inventory/domain/${domain_id}/element?limit=${limit}&page=${page}${anchorId ? `&anchorId=${anchorId}` : ''}${searchParam}`;
    const data = await fetchData(url, 'GET', null, token);
    return data;
  } catch (error) {
    console.error('Error fetching inventory elements:', error.message);
    throw error; // Re-throw the original error for higher-level handling
  }
};

export default {};
