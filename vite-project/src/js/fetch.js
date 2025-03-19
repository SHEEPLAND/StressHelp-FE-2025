/**
 * Fetches JSON data from APIs
 *
 * @param {string} url - api endpoint url
 * @param {Object} options - request options, metodit GET default, POST, DELTE
 *
 * @returns {Object} response json data
 */
const fetchData = async (url, options = {}) => {
  try {
      console.log("Requesting API:", url);
      console.log("Options:", options);

      const response = await fetch(url, options);

      if (!response.ok) {
          const errorData = await response.json();
          console.error("API Response Error:", errorData); // Log the error
          return { error: errorData.message || "An error occurred" };
      }

      return await response.json();
  } catch (error) {
      console.error("fetchData() error:", error.message);
      return { error: error.message };
  }
};

  export {fetchData};