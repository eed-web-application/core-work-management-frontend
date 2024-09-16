import { useState, useEffect } from "react";
import { fetchAWork, fetchActivitiesOfWork, fetchShopGroups, fetchLocations, fetchShopGroup, fetchLovValuesForField } from "../services/api";

const useWorkDetails = (workId) => {
  const [workDetails, setWorkDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [shopGroupUsers, setShopGroupUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shopgroups, setShopgroups] = useState([]);
  const [lovValues, setLovValues] = useState([]);
  const [initialAssignedTo, setInitialAssignedTo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse, activityResponse] = await Promise.all([
          fetchAWork(workId),
          fetchActivitiesOfWork(workId),
        ]);
        setWorkDetails(workResponse.payload);
        setInitialAssignedTo(workResponse.payload.assignedTo);
        setActivities(activityResponse.payload);

        const shopGroupResponse = await fetchShopGroup(workResponse.payload.shopGroup.id);
        setShopGroupUsers(shopGroupResponse.payload.users.map(user => user.user));

        const locationsResponse = await fetchLocations();
        setLocations(locationsResponse.payload);

        const shopgroupsResponse = await fetchShopGroups();
        setShopgroups(shopgroupsResponse.payload);

        const subsystemValues = await fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "subsystem");
        setLovValues(subsystemValues.payload);
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
    setWorkDetails,
  };
};

export default useWorkDetails;
