import { useState, useEffect } from "react";
import { fetchWork, fetchAllShopGroup, fetchAllLocation, fetchShopGroup } from "../services/api";

const useWorkDetails = (workId) => {
  const [workDetails, setWorkDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [shopGroupUsers, setShopGroupUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shopgroups, setShopgroups] = useState([]);
  const [lovValues, setLovValues] = useState([]);
  const [initialAssignedTo, setInitialAssignedTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customFields, setCustomFields] = useState([]); // New state for custom fields

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse] = await Promise.all([
          fetchWork(workId),
          // fetchActivitiesOfWork(workId),
        ]);
        
        // Set work details
        setWorkDetails(workResponse.payload);
        setInitialAssignedTo(workResponse.payload.assignedTo);

        // Extract custom fields from workType
        const customFieldsData = workResponse.payload.workType.customFields || [];
        setCustomFields(customFieldsData);

        // Fetch other necessary data
        const shopGroupResponse = await fetchShopGroup(workResponse.payload.shopGroup.id, "66f5cb9de9c61524e1cec2e3");
        setShopGroupUsers(shopGroupResponse.payload.users.map(user => user.user));

        const locationsResponse = await fetchAllLocation("66f5cb9de9c61524e1cec2e3");
        setLocations(locationsResponse.payload);

        const shopgroupsResponse = await fetchAllShopGroup("66f5cb9de9c61524e1cec2e3");
        setShopgroups(shopgroupsResponse.payload);
        
        // Optional: Fetch lov values if needed
        // const subsystemValues = await fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "subsystem");
        // setLovValues(subsystemValues.payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workId]);

  return {
    workDetails,
    activities,
    shopGroupUsers,
    locations,
    shopgroups,
    lovValues,
    initialAssignedTo,
    loading,
    customFields, // Return custom fields
    setWorkDetails,
  };
};

export default useWorkDetails;
