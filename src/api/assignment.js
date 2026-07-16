import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Assignment
|--------------------------------------------------------------------------
*/

export const workAssignmentRequest = (
  place_id,
  service_id,
  excelData,
  user_id_session,
) =>
  axios.post("/WorkAssignment", {
    place_id,
    service_id,
    excelData,
    user_id_session,
  });

export const assignmentAllRequest = (place_id, service_id) =>
  axios.get(`/AssignmentAll/${place_id}/${service_id}`);

/*
|--------------------------------------------------------------------------
| Assignment Manager
|--------------------------------------------------------------------------
*/

export const assignmentManagerSummaryRequest = (place_id, service_id) =>
  axios.get(`/AssignmentManagerSummary/${place_id}/${service_id}`);

export const assignmentManagerDetailRequest = (place_id, service_id, user_id) =>
  axios.get(`/AssignmentManagerDetail/${place_id}/${service_id}/${user_id}`);

export const assignmentManagerUnassignRequest = (
  place_id,
  service_id,
  user_id_session,
  accounts,
) =>
  axios.post("/AssignmentManagerUnassign", {
    place_id,
    service_id,
    user_id_session,
    accounts,
  });
