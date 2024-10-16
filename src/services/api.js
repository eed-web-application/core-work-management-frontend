// Set domain id
export const setDomainId = async () => {
  try {
    const domainData = await fetchAllDomain();
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

// DOMAIN-WORK-CONTROLLER
export const fetchAllWork = async (limit = 100, anchorId = null, search = "", token) => {
  const url = new URL("/api/cwm/v1/work", window.location.origin);
  url.searchParams.append('limit', limit);
  if (anchorId) url.searchParams.append('anchorId', anchorId);
  if (search) url.searchParams.append('search', search);

  return fetchData(url.toString(), 'GET', null, token);
};

export const fetchWork = async (domain_id, workId, token) => {
  return fetchData(`/api/cwm/v1/domain/${domain_id}/work/${workId}`, 'GET', null, token);
};

export const updateWork = async (domainId, workId, workData, token) => {
  return fetchData(`/api/cwm/v1/domain/${domainId}/work/${workId}`, 'PUT', workData, token);
};

export const createWork = async (domainId, workData, logIf = false, token) => {
  const workDataWithLog = {
    ...workData,
    logIf,
  };

  try {
    const response = await fetchData(`/api/cwm/v1/domain/${domainId}/work`, 'POST', workDataWithLog, token);
    
    // Return the entire response for better handling in the calling component
    return response; 
  } catch (error) {
    console.error('Error creating work:', error);
    throw error;
  }
};


// DOMAIN-CONTROLLER
export const fetchAllDomain = async (token) => {
  return fetchData('/api/cwm/v1/domain', 'GET', null, token);
};

export const createDomain = async (domainData, token) => {
  return fetchData(`/api/cwm/v1/domain`, 'POST', domainData, token);
};

export const fetchDomain = async (domainId, token) => {
  return fetchData(`/api/cwm/v1/domain/${domainId}`, 'GET', null, token);
};

export const fetchWorkType = async (domainId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/work-type`, 'GET', null, token);
};

export const fetchAllLocation = async (domainId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/location`, 'GET', null, token);
};

export const fetchLocation = async (locationId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/location/${locationId}`, 'GET', null, token);
};

export const createLocation = async (domainId, locationData, token) => {
  const response = await fetchData(`/api/cwm/v1/domain/${domainId}/location`, 'POST', locationData, token);
};

// missing createChildLocation

export const fetchAllShopGroup = async (domainId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/shop-group`, 'GET', null, token);
};

export const fetchShopGroup = async (domainId, shopGroupId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/shop-group/${shopGroupId}`, 'GET', null, token);
};

export const createShopGroup = async (domainId, shopGroupData, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/shop-group`, 'POST', shopGroupData, token);
};

export const updateShopGroup = async (shopGroupId, domainId, shopGroupData, token) => {
  return await fetchData(
    `/api/cwm/v1/domain/${domainId}/shop-group/${shopGroupId}`, 
    'PUT', 
    shopGroupData, 
    token
  );
};


// MAINTENANCE-CONTROLLER
export const fetchAllBucket = async (token) => {
  return await fetchData('/api/cwm/v1/maintenance/bucket?limit=100', 'GET', null, token);
};

export const createBucket = async (bucketData, token) => {
  const response = await fetchData('/api/cwm/v1/maintenance/bucket', 'POST', bucketData, token);
};

export const fetchBucket = async (bucketId, token) => {
  return await fetchData(`/api/cwm/v1/maintenance/bucket/${bucketId}`, 'GET', null, token);
};

export const addToBucket = async (domainId, workId, bucketId, token) => {
  return await fetchData(`/api/cwm/v1/domain/${domainId}/work/${workId}/buket/${bucketId}`, 'PUT', null, token)
};

// NEED
export const fetchBucketTypes = async (token) => {
  return await fetchData('/api/cwm/v1/lov/Bucket/bucket/type', 'GET', null, token);
};

// NEED
export const fetchBucketStatus = async (token) => {
  return await fetchData('/api/cwm/v1/lov/Bucket/bucket/status', 'GET', null, token);
};


// LOG CONTROLLER
export const createLog = async (domainId, workId, logData, token) => {
  const response = await fetchData(`/api/cwm/v1/domain/${domainId}/work/${workId}/log`, 'POST', logData, token);
};


// AUTHORIZATION CONTROLLER
export const fetchProfile = async (token) => {
  return await fetchData('/api/cwm/v1/auth/me', 'GET', null, token);
};

export const fetchUsers = async (search, token) => {
  return await fetchData(`/api/cwm/v1/auth/users${search ? `?search=${search}` : ''}`, 'GET', null, token);
};


// LOV CONTROLLER
export const fetchLovValues = async (domainType, subtypeId, token) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}`, 'GET', null, token);
};

export const fetchLovValuesForField = async (domainType, subtypeId, fieldName, token) => {
  return fetchData(`/api/cwm/v1/lov/${domainType}/${subtypeId}/${fieldName}`, 'GET', null, token);
};


// LOCAL GROUP CONTROLLER
export const fetchLocalGroupById = async (localGroupId, token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group/${localGroupId}`, 'GET', null, token);
};

export const updateLocalGroupById = async (localGroupId, localGroupData, token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group/${localGroupId}`, 'PUT', localGroupData, token);
};

export const deleteLocalGroupById = async (localGroupId, token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group/${localGroupId}`, 'DELETE', null, token);
};

export const fetchLocalGroupsByQuery = async (token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group?limit=10`, 'GET', null, token);
};

export const createLocalGroup = async (localGroupData, token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group`, 'POST', localGroupData, token);
};

export const authorizeCurrentUser = async (token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group/authorize`, 'POST', null, token);
};

export const authorizeUsersByIds = async (userIds, token) => {
  return await fetchData(`/api/cwm/v2/auth/local/group/authorize/${userIds}`, 'GET', null, token);
};



// OTHER CUSTOM FETCH DATAs
export const fetchSubsystems = async (domainId, workTypeId, token) => {
  return fetchData(`/api/cwm/v1/lov/Work/${domainId}/${workTypeId}/subsystem`, 'GET', null, token);
};

export const fetchProjectGroups = async (domainId, workTypeId, token) => {
  return fetchData(`/api/cwm/v1/lov/Work/${domainId}/${workTypeId}/project`, 'GET', null, token);
}

export const fetchLOVs = async (domainId, workTypeId, token) => {
  return fetchData(`/api/cwm/v1/lov/Work/${domainId}/${workTypeId}`)
}

export const createActivityLog = async (workId, activityId, formData, token) => {
  return await fetchData(`/api/cwm/v1/log/work/${workId}/activity/${activityId}`,'POST', formData, token);
};

export const createWorkLog = async (workId, formData, token) => {
  return await fetchData(`/api/cwm/v1/log/work/${workId}`, 'POST', formData, token );
};


// EXTERNAL APIs
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

export const fetchLogbooks = async (token) => {
  return await fetchData('/api/elog/v1/logbooks', 'GET', null, token);
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

export const addAttachment = async (attachmentData, token) => {
  const response = await fetchData(`/api/cwm/v1/attachment`, 'POST', attachmentData, token);
};

export const previewAttachment = async (attachmentId, token) => {
  return await fetchData(`/api/cwm/v1/${attachmentId}/preview.jpg`, 'GET', null, token);
};

export const downloadAttachment = async (attachmentId, token) => {
  return await fetchData(`/api/cwm/v1/${attachmentId}/download`, 'GET', null, token);
};

// export const fetchAllActivity = async (token) => {
//   return fetchData(`/api/cwm/v1/work/activity?limit=100`, 'GET', null, token);
// };

// export const fetchAActivity = async (workId, activityId, token) => {
//   return fetchData(`/api/cwm/v1/domain/66f5cb9de9c61524e1cec2e3/work/${workId}/activity/${activityId}`, 'GET', null, token);
// };

// export const fetchActivitiesOfWork = async (workId, token) => {
//   return fetchData(`/api/cwm/v1/domain/66f5cb9de9c61524e1cec2e3/work/${workId}/activity`, 'GET', null, token);
// };

// export const fetchActivities = async (token) => {
//   return fetchData(`/api/cwm/v1/domain/66f5cb9de9c61524e1cec2e3/work/activity`, 'GET', null, token);
// };

// export const createActivity = async (workId, activityData, token) => {
//   return fetchData(`/api/cwm/v1/work/${workId}/activity`, 'POST', activityData, token);
// };

// export const updateActivity = async (workId, activityId, activityData, token) => {
//   return fetchData(`/api/cwm/v1/work/${workId}/activity/${activityId}`, 'PUT', activityData, token);
// };

// export const fetchActivityType = async (token) => {
//   return await fetchData('/api/cwm/v1/work/activity-type', 'GET', null, token);
// };

// export const fetchActivitySubtype = async (token) => {
//   return await fetchData('/api/cwm/v1/work/activity-type-subtype', 'GET', null, token);
// };

export default {};
