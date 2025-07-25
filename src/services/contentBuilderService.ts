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