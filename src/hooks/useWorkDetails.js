import { useState, useEffect } from "react";
import { fetchWork, fetchAllShopGroup, fetchAllLocation, fetchShopGroup } from "../services/api";

const useWorkDetails = (selectedDomain, workId) => {
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
          fetchWork(selectedDomain, workId),
          // fetchActivitiesOfWork(workId),
        ]);
        
        // Set work details
        setWorkDetails(workResponse.payload);
        setInitialAssignedTo(workResponse.payload.assignedTo);

        // Extract custom fields from workType
        const customFieldsData = workResponse.payload.workType.customFields || [];
        setCustomFields(customFieldsData);

        // Fetch other necessary data
        const shopGroupResponse = await fetchShopGroup(selectedDomain, workResponse.payload.shopGroup.id);
        setShopGroupUsers(shopGroupResponse.payload.users.map(user => user.user));

        const locationsResponse = await fetchAllLocation(selectedDomain);
        setLocations(locationsResponse.payload);

        const shopgroupsResponse = await fetchAllShopGroup(selectedDomain);
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
