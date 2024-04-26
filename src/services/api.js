// src/services/api.js

// Set Auth TokenresponseJSON with mock user data and JWTs
const extractJWT = async () => {
  const responseJSON = await fetch("/api/cis/v1/mock/users-auth");
  const json = await responseJSON.json();
  const token = json.payload["Name1 Surname1"];
  return token;
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

/* ----------------------------------------- CONNECT ----------------------------------------- */

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
      console.log("ENTRY DATA API:", data);
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
  try {
    const token = await extractJWT();

    const response = await fetch(`http://localhost:3000/api/cwm/v1/log/work/${workId}/activity/${activityId}`,
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
      throw new Error("Failed to create activity log entry");
    }
  } catch (error) {
    throw new Error("Error creating activity log entry: " + error.message);
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


/* ----------------------------------------- CORE WORK ----------------------------------------- */

export const fetchLovValuesForField = async (domainType, subtypeId, fieldName) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/lov/${domainType}/${subtypeId}/${fieldName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch LOV values for field");
    }
  } catch (error) {
    throw new Error("Error fetching LOV values for field:", error.message);
  }
};


export const fetchLovValues = async (domainType, subtypeId) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/lov/${domainType}/${subtypeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("api lov values data", data)
      return data;
    } else {
      throw new Error("Failed to fetch LOV values");
    }
  } catch (error) {
    throw new Error("Error fetching LOV values:", error.message);
  }
};


export const fetchAllActivity = async () => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/activity?limit=100`, // Adjust query parameters as needed
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch domain");
    }
  } catch (error) {
    throw new Error("Error fetching domain:", error.message);
  }
};

export const fetchAActivity = async (workId, activityId) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}/activity/${activityId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch work");
    }
  } catch (error) {
    throw new Error("Error fetching work:", error.message);
  }
};

export const fetchActivity = async (workId) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}/activity`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch work");
    }
  } catch (error) {
    throw new Error("Error fetching work:", error.message);
  }
};

export const createActivity = async (workId, activityData) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}/activity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(activityData)
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
    console.error("Error creating work:", error, errorData);
    return { errorCode: -1, payload: [] }; // Return a default error response
  }
};

export const updateActivity = async (workId, activityId, activityData) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}/activity/${activityId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(activityData)
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log("Updated work - api.js");
      return data;
    } else {
      throw new Error("Failed to update work");
    }
  } catch (error) {
    throw new Error("Error updating work:", error.message);
  }
};

export const updateWork = async (workId, workData) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(workData)
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log("Updated work - api.js");
      return data;
    } else {
      throw new Error("Failed to update work");
    }
  } catch (error) {
    throw new Error("Error updating work:", error.message);
  }
};


export const fetchWork = async () => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work?limit=100`, // Adjust query parameters as needed
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch domain");
    }
  } catch (error) {
    throw new Error("Error fetching domain:", error.message);
  }
};

export const fetchAWork = async (workId) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/work/${workId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch work");
    }
  } catch (error) {
    throw new Error("Error fetching work:", error.message);
  }
};

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
  try {
    const token = await extractJWT();

    const response = await fetch(
      '/api/cwm/v1/work/work-type',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.payload;
    } else {
      const errorData = await response.json();
      console.error('Error fetching work type:', errorData);
      throw new Error('Error fetching work type. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching work type:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

export const fetchActivityType = async () => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      '/api/cwm/v1/work/activity-type',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data.payload;
    } else {
      const errorData = await response.json();
      console.error('Error fetching activity type:', errorData);
      throw new Error('Error fetching activity type. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching activity type:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

export const fetchActivitySubtype = async () => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      '/api/cwm/v1/work/activity-type-subtype',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      return responseData.payload;
    } else {
      const errorData = await response.json();
      console.error('Error fetching activity subtype:', errorData);
      throw new Error('Error fetching activity subtype. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching activity subtype:', error);
    throw new Error('Network error. Please check your connection.', response.errorMessage);
  }
};

/* ----------------------------------------- LOCATION ----------------------------------------- */

export const fetchProfile = async () => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      '/api/cis/v1/auth/me',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log('User profile fetched successfully:', data);
      return data.payload;
    } else {
      const errorData = await response.json();
      console.error('Error fetching profile:', errorData);
      throw new Error('Error fetching profile. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

// Function to fetch users based on search prefix
export const fetchUsers = async (search) => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      `/api/cwm/v1/auth/users${search ? `?search=${search}` : ''}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      console.error("Error fetching users:", errorData);
      throw new Error("Error fetching users. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return { errorCode: -1, payload: [] }; // Return a default error response
  }
};


export const fetchShopGroups = async () => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      '/api/cwm/v1/shop-group',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "x-vouch-idp-accesstoken": token,
        }
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // console.log('Shop groups fetched successfully:', data);
      return data.payload;
    } else {
      const errorData = await response.json();
      console.error('Error fetching shop groups:', errorData);
      throw new Error('Error fetching shop groups. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching shop groups:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

export const createShopGroup = async (shopGroupData) => {
  try {
    const token = await extractJWT();

    const response = await fetch('/api/cwm/v1/shop-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "x-vouch-idp-accesstoken": token,
      },
      body: JSON.stringify(shopGroupData)
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log('Shop group created successfully:', data);
      return data.payload;
    } else {
      const errorData = await response.json();
      console.error('Error creating shop group:', errorData);
      throw new Error('Error creating shop group. Please try again.');
    }
  } catch (error) {
    console.error('Error creating shop group:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

export const fetchLocations = async () => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      "/api/cwm/v1/location",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch domain");
    }
  } catch (error) {
    throw new Error("Error fetching domain:", error.message);
  }
};

// Function to create a new location
export const createLocation = async (locationData) => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      `/api/cwm/v1/location`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(locationData),
      }
    );

    console.log("api.js data: " + JSON.stringify(locationData));

    if (response.status === 201) {
      const data = await response.json();
      console.log("Location created successfully:", data);
    } else {
      const errorData = await response.json();
      console.error("Error creating location:", errorData);
      alert("Error creating location. Please try again.");
    }
  } catch (error) {
    console.error("Error creating location:", error);
    alert("Network error. Please check your connection.");
  }
};

// Function to retrieve a location by ID
export const getLocationById = async (locationId) => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      `/api/cwm/v1/location/${locationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log("Location retrieved successfully:", data);
      return data.payload; // Returning the location data
    } else {
      const errorData = await response.json();
      console.error("Error retrieving location:", errorData);
      alert("Error retrieving location. Please try again.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving location:", error);
    alert("Network error. Please check your connection.");
    return null;
  }
};

/* ----------------------------------------- ADVANCED ----------------------------------------- */


export const getRootElements = async () => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const response = await fetch(`/api/cis/v1/inventory/domain/${domain_id}/roots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'x-vouch-idp-accesstoken': token,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const data = await response.json();

    // Ensure data is defined and has a valid structure
    if (response.ok) {
      if (data.errorCode === 0) {
        // Handle successful JSON response
        setRootElements(data.payload);
      } else {
        // Handle error in the JSON response
        throw new Error(`Error fetching root elements: ${data.errorMessage}`);
      }
    } else {
      // Handle non-OK responses (e.g., 404, 500)
      throw new Error(`Failed to fetch root elements. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching root elements:", error);
    // Handle the error and return an error response if necessary
    return {
      errorCode: -1,
      errorMessage: "Error fetching root elements",
    };
  }
};

export const getChildElements = async (elementId) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    const response = await fetch(`/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}/children`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'x-vouch-idp-accesstoken': token,
      },
    });

    const data = await response.json();

    if (data.errorCode === 0) {
      // Handle success, data.payload contains an array of child elements
      console.log("Child elements:", data.payload);
    } else {
      console.error("Error fetching child elements:", data.errorMessage);
    }
  } catch (error) {
    console.error("Error fetching child elements:", error);
  }
};


export const submitEdits = async () => {
  const token = await extractJWT();
  const domain_id = await setDomainId();
  try {
    const response = await fetch(`/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'x-vouch-idp-accesstoken': token,
      },
      body: JSON.stringify({
        id: editedId,
        // Include other edited attributes
      }),
    });

    const data = await response.json();

    // Handle success or show error message
    if (data.payload) {
      // Data was successfully updated
      console.log("Data updated successfully");
    } else {
      console.error("Error updating data:", data.errorMessage);
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};


export const fetchElementNicknames = async () => {
  try {
    const data = await fetchAllElements(); // Ensure this function fetches elements
    const filteredNames = data.payload
      .filter(element => element.classDTO.id === '65a022f8a11a67235b702edc')
      .map(element => element.name);
    return filteredNames;
  } catch (error) {
    throw new Error('Error fetching element nicknames:', error.message);
  }
};


export const searchInventory = async (anchorId, options) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    const queryParams = new URLSearchParams(options).toString();

    const response = await fetch(`/api/cis/v1/inventory/domain/${domain_id}/element?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-vouch-idp-accesstoken': token,
        },
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // Re-throw the error for additional handling if needed
  }
};


export const fetchElementChildren = async () => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    // const token = await retrieveToken();
    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/659833aa40949c037977ec08/children`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch element children");
    }
  } catch (error) {
    throw new Error("Error fetching element children:", error.message);
  }
};


export const fetchPath = async (elementId, pathType) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const queryParams = new URLSearchParams({
      pathType: pathType
    });

    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}/path?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API: Error fetching path:", errorData);

      let errorMessage = "Unknown error";
      if (response.status === 400) {
        errorMessage = errorData.errorMessage || "Bad Request";
      } else if (response.status === 401) {
        errorMessage = "Unauthorized - Please check your credentials";
      } else if (response.status === 403) {
        errorMessage = "Forbidden - Access denied";
      } else if (response.status === 404) {
        errorMessage = "Not Found - Endpoint or resource not found";
      } else {
        errorMessage = `Server Error - ${response.status}`;
      }

      throw new Error(`API: Error fetching path: ${errorMessage}`);
    }

    const responseData = await response.json();
    // Handle responseData for further actions if needed

    return responseData;
  } catch (error) {
    console.error("API: Error fetching path:", error.message);
    alert("API: Network error. Please check your connection.");
    throw new Error(`API: Error fetching path: ${error.message}`);
  }
};


export const createImplementation = async (elementId, implementationData) => {
  try {
    const token = await extractJWT(); // Retrieve your token here
    const domain_id = await setDomainId();

    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}/implementation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(implementationData),
      }
    );
    console.log(JSON.stringify(implementationData));

    if (response.status === 201) {
      const data = await response.json();
      console.log("API.js Class created successfully:", data);
      alert("Class created successfully!");

      // if (response.ok) {
      //   const data = await response.json();
      //   return data;
    } else {
      const errorData = await response.json(); // Retrieve error details
      const errorMessage = errorData.message || 'Failed to create element implementation';
      const error = new Error(errorMessage);
      error.response = errorData; // Attach the response details to the error object
      throw error;
    }
  } catch (error) {
    // Log the error details for better visibility
    console.error('Error creating element implementation:', error.message);
    if (error.response) {
      console.error('Response details:', error.response);
    }
    throw error; // Rethrow the error for further handling if needed
  }
};


export const fetchImplementation = async (elementId) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}/implementation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch element implementation: ${errorData.message}`
      );
    }
  } catch (error) {
    throw new Error(`Error fetching element implementation: ${error.message}`);
  }
};


export const fetchInventoryData = async () => {
  try {
    // Simulating an API call with a JWT in headers (replace with actual API endpoint)
    const token = await extractJWT();
    const domain_id = await setDomainId();
    // const token = await retrieveToken();
    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your credentials");
        // Handle unauthorized access, e.g., redirect to login page
      } else {
        throw new Error("Network response was not ok");
      }
    }

    const inventoryData = await response.json();
    return inventoryData;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    throw error;
  }
};


/* ----------------------------------------- CREATION ----------------------------------------- */

export const createInventoryClass = async (classData) => {
  try {
    const token = await extractJWT();

    const response = await fetch(
      `/api/cis/v1/inventory/class`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token, // Include the authorization token header
        },
        body: JSON.stringify(classData),
      }
    );

    console.log("api.js data: " + JSON.stringify(classData));

    if (response.status === 201) {
      const data = await response.json();
      console.log("API.js Class created successfully:", data);
      alert("Class created successfully!"); // Handle success: show a success message or perform any necessary action
      // You can also reset the form or close the modal here
    } else {
      const errorData = await response.json();
      console.error("Error creating class:", errorData);
      alert("Error creating class. Please try again.");
    }
  } catch (error) {
    console.error("Error creating class:", error.message);
    alert("Network error. Please check your connection.");
  }
};

export const createInventoryElement = async (elementData) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(elementData),
      }
    );

    if (response.status === 201) {
      const data = await response.json();
      console.log("API.js Element created successfully:", data);
      alert("Element created successfully!"); // Handle success: show a success message or perform any necessary action
      // You can also reset the form or close the modal here
    } else {
      console.error(
        `Failed to create inventory element. Status: ${response.status}, StatusText: ${response.statusText}`
      );

      if (response.headers.get("content-type")?.includes("application/json")) {
        // If the response contains JSON, log and handle the error
        const errorData = await response.json();
        console.error("Error creating element:", errorData);
        alert("Error creating element. Please try again.");
      } else {
        // If the response is not JSON, log and handle the error accordingly
        const errorText = await response.text();
        console.error("Error creating element:", errorText);
        alert("Error creating element. Please try again.");
      }
    }
  } catch (error) {
    console.error("Error creating element:", error);
    alert("Network error. Please check your connection.");
  }
};


/* ----------------------------------------- UPDATE ----------------------------------------- */

// Function to update an inventory element
export const updateElement = async (
  elementId,
  updatedElementData
) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    // const token = await retrieveToken();
    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
        body: JSON.stringify(updatedElementData), // Pass updated data in the request body
      }
    );

    if (!response.ok) {
      // Handle non-successful status codes
      const errorData = await response.json();
      throw new Error(
        `Failed to update element: ${errorData.errorMessage || "Unknown error"}`
      );
    }

    // Successful request
    const responseData = await response.json();
    alert("Updated Element successfully!");
    console.log(response);
    return responseData;
  } catch (error) {
    throw new Error(`Error updating element: ${error.message}`);
  }
};

export const updateInventoryDomain = async (domainId, requestBody) => {
  const domain_id = await setDomainId();
  const url = `/api/cis/v1/inventory/domain/${domain_id}`;

  try {
    const token = await extractJWT();
    // const token = await retrieveToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-vouch-idp-accesstoken": token,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your credentials");
        // Handle unauthorized access, e.g., redirect to login page
      } else {
        throw new Error("Network response was not ok");
      }
    }

    const inventoryData = await response.json();
    return inventoryData;
  } catch (error) {
    // Handle errors or log them
    console.error("Error fetching inventory data:", error);
    throw error;
  }
};

/* ----------------------------------------- SINGLES ----------------------------------------- */

export const fetchDomain = async () => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch class types");
    }
  } catch (error) {
    throw new Error("Error fetching class types:", error.message);
  }
};

// Updated fetchClass function
export const fetchClass = async (classId) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();

    const response = await fetch(
      `/api/cis/v1/inventory/class/${classId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to fetch class details: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching class details:", error.message);
    throw error;
  }
};


export const fetchElement = async (elementId) => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    // const token = await retrieveToken();
    const response = await fetch(
      `/api/cis/v1/inventory/domain/${domain_id}/element/${elementId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch class types");
    }
  } catch (error) {
    throw new Error("Error fetching class types:", error.message);
  }
};

/* ----------------------------------------- STARTERS ----------------------------------------- */


export const fetchAllDomain = async () => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      "/api/cis/v1/inventory/domain",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch domain");
    }
  } catch (error) {
    throw new Error("Error fetching domain:", error.message);
  }
};

export const fetchAllClass = async () => {
  try {
    const token = await extractJWT();
    // const token = await retrieveToken();
    const response = await fetch(
      "/api/cis/v1/inventory/class",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch class types");
    }
  } catch (error) {
    throw new Error("Error fetching class types:", error.message);
  }
};

export const fetchLogbooks = async () => {
  try {
    const token = await extractJWT();
    const response = await fetch(
      "/api/elog/v1/logbooks",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-vouch-idp-accesstoken": token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch logbooks");
    }
  } catch (error) {
    throw new Error("Error fetching logbooks:", error.message);
  }
};

export const searchElements = async (searchQuery = "") => {
  try {
    const token = await extractJWT();
    const domain_id = await setDomainId();
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const url = `/api/cis/v1/inventory/domain/${domain_id}/element?${searchParam}`;

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
