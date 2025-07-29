import axios from 'axios';

const MOODLE_API_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php'; // Change to your server
const TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633'; // Change to your token

export async function createSection(courseid: number, name: string, summary = '') {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_create_section');
  params.append('moodlewsrestformat', 'json');
  params.append('courseid', String(courseid));
  params.append('name', name);
  params.append('summary', summary);
  const { data } = await axios.post(MOODLE_API_URL, params);
  return data;
}

export async function addActivity(courseid: number, sectionnum: number, modname: string, name: string, options: {name: string, value: any}[] = []) {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_add_activity');
  params.append('moodlewsrestformat', 'json');
  params.append('courseid', String(courseid));
  params.append('sectionnum', String(sectionnum));
  params.append('modname', modname);
  params.append('name', name);
  options.forEach((opt, i) => {
    params.append(`options[${i}][name]`, opt.name);
    params.append(`options[${i}][value]`, opt.value);
  });
  const { data } = await axios.post(MOODLE_API_URL, params);
  return data;
}

export async function uploadFile(contextid: number, component: string, filearea: string, itemid: number, filepath: string, filename: string, filecontent: string) {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_upload_file');
  params.append('moodlewsrestformat', 'json');
  params.append('contextid', String(contextid));
  params.append('component', component);
  params.append('filearea', filearea);
  params.append('itemid', String(itemid));
  params.append('filepath', filepath);
  params.append('filename', filename);
  params.append('filecontent', filecontent);
  const { data } = await axios.post(MOODLE_API_URL, params);
  return data;
}

export async function batchImport(courseid: number, structure: any) {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_batch_import');
  params.append('moodlewsrestformat', 'json');
  params.append('courseid', String(courseid));
  params.append('structure', JSON.stringify(structure));
  const { data } = await axios.post(MOODLE_API_URL, params);
  return data;
}

export async function deleteActivity(cmid: number) {
    const params = new URLSearchParams();
    params.append('wstoken', TOKEN);
    params.append('wsfunction', 'local_contentbuilder_delete_activity');
    params.append('moodlewsrestformat', 'json');
    params.append('cmid', String(cmid));
    const { data } = await axios.post(MOODLE_API_URL, params);
    if (data.exception) {
        throw new Error(data.message);
    }
    return data;
}

export async function updateActivity(cmid: number, name: string) {
    const params = new URLSearchParams();
    params.append('wstoken', TOKEN);
    params.append('wsfunction', 'local_contentbuilder_update_activity');
    params.append('moodlewsrestformat', 'json');
    // Wrap parameters in the 'activitydata' object as required by the refactored PHP function
    params.append('activitydata[cmid]', String(cmid));
    params.append('activitydata[name]', name);

    const { data } = await axios.post(MOODLE_API_URL, params);
    if (data.exception) {
        throw new Error(data.message);
    }
    return data;
}

export async function deleteSection(sectionid: number) {
    const params = new URLSearchParams();
    params.append('wstoken', TOKEN);
    params.append('wsfunction', 'local_contentbuilder_delete_section');
    params.append('moodlewsrestformat', 'json');
    params.append('sectionid', String(sectionid));
    const { data } = await axios.post(MOODLE_API_URL, params);
    if (data.exception) {
        throw new Error(data.message);
    }
    return data;
}

export async function updateSection(sectionid: number, name: string, summary: string) {
    const params = new URLSearchParams();
    params.append('wstoken', TOKEN);
    params.append('wsfunction', 'local_contentbuilder_update_section');
    params.append('moodlewsrestformat', 'json');
    params.append('sectionid', String(sectionid));
    params.append('name', name);
    params.append('summary', summary);
    const { data } = await axios.post(MOODLE_API_URL, params);
    if (data.exception) {
        throw new Error(data.message);
    }
    return data;
}

/**
 * Sets access restrictions on a specific course module (activity) using the correct
 * Moodle web service function: core_course_update_modules.
 * @param cmid The course module ID of the activity to restrict.
 * @param roleIds An array of role IDs that are allowed to see this activity. If empty, restrictions are removed.
 * @returns {Promise<any>}
 */
export async function setActivityRoleRestrictions(cmid: number, roleIds: number[]) {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  // --- THE FUNCTION NAME FIX ---
  params.append('wsfunction', 'core_course_update_modules');
  params.append('moodlewsrestformat', 'json');
  
  let availabilityCondition = null;

  if (roleIds && roleIds.length > 0) {
    availabilityCondition = {
      'op': '|', 
      'c': roleIds.map(roleId => ({
        'type': 'role',
        'id': roleId
      })),
      'showc': roleIds.map(() => true)
    };
  }

  // --- THE PARAMETER STRUCTURE FIX ---
  // This function expects the data to be inside an 'updates' array.
  // We are only updating one module, so it's an array with one object.
  params.append('updates[0][id]', String(cmid));
  params.append('updates[0][availability]', JSON.stringify(availabilityCondition));

  const { data } = await axios.post(MOODLE_API_URL, params);
  
  // The response for this function might be slightly different. 
  // We check for an exception property, which is a reliable way to detect Moodle errors.
  if (data.exception) {
    console.error("Moodle API Error:", data);
    throw new Error(data.message || 'Failed to set activity restrictions.');
  }
  
  return data;
}


// --- NEW GROUP MANAGEMENT FUNCTIONS ---

/**
 * Fetches all groups for a specific course.
 * @param courseid The ID of the course.
 * @returns {Promise<any[]>} An array of group objects.
 */
export async function getCourseGroups(courseid: number): Promise<any[]> {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_get_course_groups');
  params.append('moodlewsrestformat', 'json');
  params.append('courseid', String(courseid));
  
  const { data } = await axios.post(MOODLE_API_URL, params);
  if (data.exception) {
    throw new Error(data.message || 'Failed to fetch course groups.');
  }
  return data;
}

/**
 * Creates a new group within a course.
 * @param courseid The ID of the course where the group will be created.
 * @param name The name of the new group.
 * @param description An optional description for the group.
 * @returns {Promise<any>} The response from the API, typically including the new groupid.
 */
export async function createCourseGroup(courseid: number, name: string, description: string = ''): Promise<any> {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_create_course_group');
  params.append('moodlewsrestformat', 'json');
  params.append('courseid', String(courseid));
  params.append('name', name);
  params.append('description', description);
  
  const { data } = await axios.post(MOODLE_API_URL, params);
  if (data.exception) {
    throw new Error(data.message || 'Failed to create course group.');
  }
  return data;
}

  /**
 * Adds a user as a member to a specific group.
 * @param groupid The ID of the group.
 * @param userid The ID of the user to add.
 * @returns {Promise<any>} The response from the API.
 */
export async function addGroupMember(groupid: number, userid: number): Promise<any> {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', 'local_contentbuilder_add_group_member');
  params.append('moodlewsrestformat', 'json');
  params.append('groupid', String(groupid));
  params.append('userid', String(userid));
  
  const { data } = await axios.post(MOODLE_API_URL, params);
  if (data.exception) {
    throw new Error(data.message || 'Failed to add user to group.');
  }
  return data;
}