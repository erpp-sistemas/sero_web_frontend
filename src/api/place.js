import instance from './axios';
import axios from './axios'

export const placeById = (place_id) => axios.get(`/PlaceById/${place_id}`)
export const placeByUserIdRequest = (user_id) => axios.get(`/PlaceByUserId/${user_id}`)
/**
   * Function to update a place by its ID.
   *
   * @param {number} placeId - ID of the place to update.
   * @param {object} updatedPlaceData - Updated data for the place.
   * @returns {Promise} Promise resolved with the data of the updated place.
   * @throws {Error} Error indicating the reason for the failure in updating the place.
   */
export const getPlaceServiceByUserId = async (userId,placeId) => {
    try {
      const response = await instance.get(`/PlaceServiceByUserId/${userId}/${placeId}`);
      // Additional operations after updating the place can be done here
      return response.data;
    } catch (error) {
      console.error("Error updating place by ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

export const getProcessesByUserPlaceAndServiceId = async(userId,placeId,serviceId)=>{
    try {
        const response = await axios.get(`/getProcessesByUserPlaceAndServiceId/${userId}/${placeId}/${serviceId}`);
        // Additional operations after updating the place can be done here
        return response.data;
      } catch (error) {
        console.error("Error updating place by ID:", error.response?.data || error.message);
        throw error.response?.data || error;
      }

}

/**
 * Function to create a new place.
 *
 * @param {object} placeData - Data for creating a new place.
 * @returns {Promise} Promise resolved with the data of the newly created place.
 * @throws {Error} Error indicating the reason for the failure in creating the place.
 */
export const createPlace = async (placeData) => {
    try {
      const response = await instance.post('/places', placeData);
      // Additional operations after place creation can be done here
      return response.data;
    } catch (error) {
      console.error("Error creating a new place:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Function to delete a place by its ID.
   *
   * @param {number} placeId - ID of the place to delete.
   * @returns {Promise} Promise resolved with the data of the deleted place.
   * @throws {Error} Error indicating the reason for the failure in deleting the place.
   */
  export const deletePlaceById = async (placeId) => {
    try {
      const response = await axios.delete(`/places/${placeId}`);
      // Additional operations after deleting the place can be done here
      return response.data;
    } catch (error) {
      console.error("Error deleting place by ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Function to get all places.
   *
   * @returns {Promise} Promise resolved with the data of all places.
   * @throws {Error} Error indicating the reason for the failure in getting all places.
   */
  export const getAllPlaces = async () => {
    try {
      const response = await instance.get('/places');
      console.log(response);
      // Additional operations before returning the data can be done here
      return response.data;
    } catch (error) {
      console.error("Error getting all places:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };


   /**
   * Function to get all places.
   *
   * @returns {Promise} Promise resolved with the data of all places.
   * @throws {Error} Error indicating the reason for the failure in getting all places.
   */
   export const getPlaceAndServiceAndProcess = async (idPlaza) => {
    try {
      const response = await instance.get(`/plazas/${idPlaza}`);
      // Additional operations before returning the data can be done here
      return response.data;
    } catch (error) {
      console.error("Error getting all places:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };
  
  /**
   * Function to update a place by its ID.
   *
   * @param {number} placeId - ID of the place to update.
   * @param {object} updatedPlaceData - Updated data for the place.
   * @returns {Promise} Promise resolved with the data of the updated place.
   * @throws {Error} Error indicating the reason for the failure in updating the place.
   */
  export const updatePlaceById = async (placeId, updatedPlaceData) => {
    try {
      const response = await axios.put(`/places/${placeId}`, updatedPlaceData);
      // Additional operations after updating the place can be done here
      return response.data;
    } catch (error) {
      console.error("Error updating place by ID:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };


  export const getAllPlaceAndServiceAndProcess = async (req,res)=>{
    try {
      const response = await instance.get('/placesAndServiceAndProcess')
      return response.data
      
    } catch (error) {
      console.error("Error updating place by ID:", error.response?.data || error.message);
      throw error.response?.data || error;
      
    }
  }


/* /placesAndServiceAndProcess */

export const createPlazaServiceProcess = async (PlazaServiceProcessData) => {
  try {
    const response = await instance.post('/placesAndServiceAndProcess', PlazaServiceProcessData);
    // Additional operations after user plaza service process data creation can be done here
    return response.data;
  } catch (error) {
    console.error("Error creating user plaza service process data:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

  export const createUserPlazaServiceProcess = async (userPlazaServiceProcessData) => {
    try {
      const response = await axios.post('/userPlazaServiceProcess', userPlazaServiceProcessData);
      // Additional operations after user plaza service process data creation can be done here
      return response.data;
    } catch (error) {
      console.error("Error creating user plaza service process data:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  /* router.post('/insertPlaceAndServiceAndProcess',  placeController.insertPlaceAndServiceAndProcess); */
export const createPlaceAndServiceAndProcess = async(data)=>{
try {
  const response = await instance.post('/insertPlaceAndServiceAndProcess',data)
  return response.data;
 
  
} catch (error) {
  console.error("Error creating user plaza service process data:", error.response?.data || error.message);
  throw error.response?.data || error;
  
}}







