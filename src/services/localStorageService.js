/**
 * Local Storage Service for GentleGrove
 *
 * Provides an offline fallback implementation of the database service.
 * Uses localStorage to persist parent and child profiles locally.
 * Useful when Firebase is not configured or the app is offline.
 *
 * Data Structure:
 * localStorage["gentlegrove_data"] = {
 *   parents: {
 *     [parentId]: { contact, contactType, createdAt, updatedAt, children: {...} }
 *   }
 * }
 */

/**
 * Gets all data from localStorage
 * @returns {Object} All stored data
 */
const getAllData = () => {
  try {
    const data = localStorage.getItem('gentlegrove_data');
    return data ? JSON.parse(data) : { parents: {} };
  } catch (error) {
    console.error('Error reading from localStorage:', error.message);
    return { parents: {} };
  }
};

/**
 * Saves all data to localStorage
 * @param {Object} data - Data to save
 */
const saveAllData = (data) => {
  try {
    localStorage.setItem('gentlegrove_data', JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error.message);
  }
};

/**
 * Gets current timestamp in milliseconds
 * @returns {number} Current timestamp
 */
const getCurrentTimestamp = () => {
  return new Date().getTime();
};

/**
 * Saves or updates a parent profile in localStorage
 *
 * @param {string} parentId - ID of the parent
 * @param {Object} data - Parent profile data
 * @param {string} data.contact - Email or mobile number
 * @param {string} data.contactType - "email" or "mobile"
 * @returns {Promise<void>}
 */
export const saveParentProfile = async (parentId, data) => {
  try {
    const allData = getAllData();

    if (!allData.parents[parentId]) {
      allData.parents[parentId] = {
        ...data,
        createdAt: getCurrentTimestamp(),
        children: {},
      };
    } else {
      allData.parents[parentId] = {
        ...allData.parents[parentId],
        ...data,
      };
    }

    allData.parents[parentId].updatedAt = getCurrentTimestamp();

    saveAllData(allData);
  } catch (error) {
    console.error('Error saving parent profile to localStorage:', error.message);
    throw error;
  }
};

/**
 * Retrieves a parent profile from localStorage
 *
 * @param {string} parentId - ID of the parent
 * @returns {Promise<Object|null>} Parent profile data or null if not found
 */
export const getParentProfile = async (parentId) => {
  try {
    const allData = getAllData();

    if (allData.parents[parentId]) {
      return {
        id: parentId,
        ...allData.parents[parentId],
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting parent profile from localStorage:', error.message);
    throw error;
  }
};

/**
 * Saves or updates a child profile under a parent
 *
 * @param {string} parentId - ID of the parent
 * @param {string} childUsername - Unique username for the child
 * @param {Object} data - Child profile data
 * @returns {Promise<void>}
 */
export const saveChildProfile = async (parentId, childUsername, data) => {
  try {
    const allData = getAllData();

    if (!allData.parents[parentId]) {
      allData.parents[parentId] = { children: {} };
    }

    if (!allData.parents[parentId].children) {
      allData.parents[parentId].children = {};
    }

    if (!allData.parents[parentId].children[childUsername]) {
      allData.parents[parentId].children[childUsername] = {
        ...data,
        createdAt: getCurrentTimestamp(),
        sessions: {},
      };
    } else {
      allData.parents[parentId].children[childUsername] = {
        ...allData.parents[parentId].children[childUsername],
        ...data,
      };
    }

    allData.parents[parentId].children[childUsername].updatedAt = getCurrentTimestamp();

    saveAllData(allData);
  } catch (error) {
    console.error('Error saving child profile to localStorage:', error.message);
    throw error;
  }
};

/**
 * Retrieves a specific child profile
 *
 * @param {string} parentId - ID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<Object|null>} Child profile data or null if not found
 */
export const getChildProfile = async (parentId, childUsername) => {
  try {
    const allData = getAllData();

    if (
      allData.parents[parentId] &&
      allData.parents[parentId].children &&
      allData.parents[parentId].children[childUsername]
    ) {
      return {
        id: childUsername,
        ...allData.parents[parentId].children[childUsername],
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting child profile from localStorage:', error.message);
    throw error;
  }
};

/**
 * Retrieves all children under a parent
 *
 * @param {string} parentId - ID of the parent
 * @returns {Promise<Array<Object>>} Array of child profiles
 */
export const getChildrenProfiles = async (parentId) => {
  try {
    const allData = getAllData();

    if (!allData.parents[parentId] || !allData.parents[parentId].children) {
      return [];
    }

    const children = [];
    Object.keys(allData.parents[parentId].children).forEach((username) => {
      children.push({
        id: username,
        ...allData.parents[parentId].children[username],
      });
    });

    return children;
  } catch (error) {
    console.error('Error getting children profiles from localStorage:', error.message);
    throw error;
  }
};

/**
 * Deletes a child profile
 *
 * @param {string} parentId - ID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<void>}
 */
export const deleteChildProfile = async (parentId, childUsername) => {
  try {
    const allData = getAllData();

    if (
      allData.parents[parentId] &&
      allData.parents[parentId].children &&
      allData.parents[parentId].children[childUsername]
    ) {
      delete allData.parents[parentId].children[childUsername];
      saveAllData(allData);
    }
  } catch (error) {
    console.error('Error deleting child profile from localStorage:', error.message);
    throw error;
  }
};

/**
 * Logs a game session for a child
 *
 * @param {string} parentId - ID of the parent
 * @param {string} childUsername - Username of the child
 * @param {Object} sessionData - Session data to log
 * @returns {Promise<string>} Document ID of the logged session
 */
export const logSession = async (parentId, childUsername, sessionData) => {
  try {
    const allData = getAllData();

    if (!allData.parents[parentId] || !allData.parents[parentId].children) {
      throw new Error('Parent or child not found');
    }

    if (!allData.parents[parentId].children[childUsername]) {
      throw new Error('Child not found');
    }

    if (!allData.parents[parentId].children[childUsername].sessions) {
      allData.parents[parentId].children[childUsername].sessions = {};
    }

    // Generate unique session ID
    const sessionId = `session_${getCurrentTimestamp()}`;

    allData.parents[parentId].children[childUsername].sessions[sessionId] = {
      ...sessionData,
      startTime: getCurrentTimestamp(),
      endTime: getCurrentTimestamp(),
    };

    saveAllData(allData);

    return sessionId;
  } catch (error) {
    console.error('Error logging session to localStorage:', error.message);
    throw error;
  }
};

/**
 * Retrieves recent game sessions for a child
 *
 * @param {string} parentId - ID of the parent
 * @param {string} childUsername - Username of the child
 * @param {number} [limitCount=10] - Maximum number of sessions to retrieve
 * @returns {Promise<Array<Object>>} Array of session records, most recent first
 */
export const getRecentSessions = async (parentId, childUsername, limitCount = 10) => {
  try {
    const allData = getAllData();

    if (
      !allData.parents[parentId] ||
      !allData.parents[parentId].children ||
      !allData.parents[parentId].children[childUsername] ||
      !allData.parents[parentId].children[childUsername].sessions
    ) {
      return [];
    }

    const sessions = [];
    const sessionsObj = allData.parents[parentId].children[childUsername].sessions;

    Object.keys(sessionsObj).forEach((sessionId) => {
      sessions.push({
        id: sessionId,
        ...sessionsObj[sessionId],
      });
    });

    // Sort by startTime descending and limit
    sessions.sort((a, b) => (b.startTime || 0) - (a.startTime || 0));

    return sessions.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting recent sessions from localStorage:', error.message);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  saveParentProfile,
  getParentProfile,
  saveChildProfile,
  getChildProfile,
  getChildrenProfiles,
  deleteChildProfile,
  logSession,
  getRecentSessions,
};
