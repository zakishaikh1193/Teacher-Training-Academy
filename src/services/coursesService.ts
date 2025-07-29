import axios from 'axios';
import { Course } from '../types';

const IOMAD_BASE_URL = import.meta.env.VITE_IOMAD_URL || 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = import.meta.env.VITE_IOMAD_TOKEN || '4a2ba2d6742afc7d13ce4cf486ba7633';

const api = axios.create({
  baseURL: IOMAD_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    wstoken: IOMAD_TOKEN,
    moodlewsrestformat: 'json',
  };
  return config;
});

export const coursesService = {
  /**
   * Fetch all courses from IOMAD
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses_by_field',
          field: '',
          value: '',
        },
      });

      if (response.data && Array.isArray(response.data.courses)) {
        return response.data.courses
          .filter((course: any) => course.visible !== 0)
          .map((course: any) => ({
            id: course.id.toString(),
            fullname: course.fullname,
            shortname: course.shortname,
            summary: course.summary || '',
            categoryid: course.categoryid || course.category,
            courseimage: course.courseimage || course.overviewfiles?.[0]?.fileurl,
            categoryname: course.categoryname || 'General',
            format: course.format || 'topics',
            startdate: course.startdate,
            enddate: course.enddate,
            visible: course.visible,
            type: ['ILT', 'VILT', 'Self-paced'][Math.floor(Math.random() * 3)] as 'ILT' | 'VILT' | 'Self-paced',
            tags: ['Professional Development', 'Teaching Skills', 'Assessment'],
          }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses from IOMAD');
    }
  },

  /**
   * Fetch all course categories from IOMAD
   */
  async getAllCategories(): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_categories',
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.filter((category: any) => category.visible !== 0);
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories from IOMAD');
    }
  },

  /**
   * Create a new course category
   */
  async createCategory(categoryData: any): Promise<any> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_course_create_categories',
        categories: [categoryData]
      });

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  /**
   * Get course enrollments
   */
  async getCourseEnrollments(courseId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_enrol_get_enrolled_users',
          courseid: courseId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      return [];
    }
  },

/**
 * Fetches all available roles using the Intelliboard plugin function.
 * @returns {Promise<any[]>} An array of role objects.
 */
async getAvailableRoles(): Promise<any[]> {
  try {
    const response = await api.get('', {
      params: {
        wsfunction: 'local_intelliboard_get_roles_list',
      },
    });

    if (response.data && typeof response.data.data === 'string') {
      const parsedData = JSON.parse(response.data.data);

      // --- THE FIX IS HERE ---
      // The parsed data is an object of objects, e.g., { "1": { id: "1", name: "Manager", ... } }
      // We need to get the values of this object, which is an array of the inner objects.
      const rolesArray = Object.values(parsedData);
      
      // Now we can map over this array of objects correctly.
      return rolesArray.map((role: any) => ({
        id: parseInt(role.id, 10),
        name: role.name,
        shortname: role.shortname, // The shortname is already provided by the API!
      }));
    }
    return [];
  } catch (error)
 {
    console.error('Error fetching available roles via Intelliboard:', error);
    throw new Error('Failed to fetch roles from Intelliboard');
  }
},

  /**
   * Enroll user in course
   */
  async enrollUser(courseId: string, userId: string, roleId: number = 5): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'enrol_manual_enrol_users',
        enrolments: [{
          courseid: courseId,
          userid: userId,
          roleid: roleId
        }]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw new Error('Failed to enroll user');
    }
  },

  /**
   * Get course settings
   */
  async getCourseSettings(courseId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'core_course_get_courses',
          options: {
            ids: [courseId]
          }
        },
      });

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching course settings:', error);
      return null;
    }
  },

  /**
   * Update course settings
   */
  async updateCourseSettings(courseId: string, settings: any): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'core_course_update_courses',
        courses: [{
          id: courseId,
          ...settings
        }]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error updating course settings:', error);
      throw new Error('Failed to update course settings');
    }
  },

  /**
   * Get school courses (IOMAD specific)
   */
  async getSchoolCourses(schoolId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'block_iomad_company_admin_get_company_courses',
          companyid: schoolId,
        },
      });

      return response.data || [];
    } catch (error) {
      console.error('Error fetching school courses:', error);
      return [];
    }
  },

  /**
   * Assign course to school
   */
  async assignCourseToSchool(courseId: string, schoolId: string): Promise<boolean> {
    try {
      const response = await api.post('', {
        wsfunction: 'block_iomad_company_admin_assign_courses',
        companyid: schoolId,
        courseids: [courseId]
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error assigning course to school:', error);
      throw new Error('Failed to assign course to school');
    }
  },

  /**
   * Assign course(s) to a school
   */
  async assignCoursesToSchool(schoolId: number, courseIds: number[]): Promise<any> {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN);
    params.append('wsfunction', 'block_iomad_company_admin_assign_courses');
    params.append('moodlewsrestformat', 'json');
    courseIds.forEach((id, idx) => {
      params.append(`courses[${idx}][courseid]`, String(id));
      params.append(`courses[${idx}][companyid]`, String(schoolId));
      params.append(`courses[${idx}][departmentid]`, '0');
      params.append(`courses[${idx}][owned]`, '0');
      params.append(`courses[${idx}][licensed]`, '1');
    });
    const response = await axios.post(IOMAD_BASE_URL, params);
    return response.data;
  },

  /**
   * Create/set licenses for a course in a school
   */
  async createCourseLicense(schoolId: number, courseId: number, licenseCount: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN);
    params.append('wsfunction', 'block_iomad_company_admin_create_licenses');
    params.append('moodlewsrestformat', 'json');
    
    // Required fields
    params.append('licenses[0][name]', `License for course ${courseId} in school ${schoolId}`);
    params.append('licenses[0][allocation]', String(licenseCount));
    params.append('licenses[0][validlength]', '0'); // 0 = unlimited days
    params.append('licenses[0][startdate]', '0'); // 0 = no start date
    
    // THE FIX: Instead of '0', use a far-future timestamp for non-expiring licenses
    // Using 2147483647 which is January 19, 2038 (avoids Y2K38 issues on 32-bit systems)
    const neverExpireTimestamp = 2147483647;
    params.append('licenses[0][expirydate]', String(neverExpireTimestamp));
    
    params.append('licenses[0][used]', '0');
    params.append('licenses[0][companyid]', String(schoolId));
    params.append('licenses[0][parentid]', '0');
    params.append('licenses[0][type]', '0'); // 0 = standard
    params.append('licenses[0][program]', '0');
    params.append('licenses[0][reference]', '');
    params.append('licenses[0][instant]', '0');
    params.append('licenses[0][clearonexpire]', '0');
    params.append('licenses[0][cutoffdate]', '0');
    params.append('licenses[0][courses][0][courseid]', String(courseId));
    
    console.log('Creating license with expiry date:', neverExpireTimestamp, '(Jan 19, 2038)');
    const response = await axios.post(IOMAD_BASE_URL, params);
    return response.data;
  },

// Get license info for a company (all licenses)
async getCourseLicenseInfo(companyId: number, courseId: number): Promise<any> {
  const params = new URLSearchParams();
  params.append('wstoken', IOMAD_TOKEN);
  params.append('wsfunction', 'block_iomad_company_admin_get_license_info');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][key]', 'companyid');
  params.append('criteria[0][value]', String(companyId));
  // Note: courseid is not supported as a filter parameter, so we get all company licenses
  const response = await axios.post(IOMAD_BASE_URL, params);
  return response.data;
},

/**
 * Get license information by license ID
 */
async getLicenseInfoById(licenseId: number): Promise<any> {
  try {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN);
    params.append('wsfunction', 'block_iomad_company_admin_get_license_from_id');
    params.append('moodlewsrestformat', 'json');
    params.append('licenseid', String(licenseId));
    
    const response = await axios.post(IOMAD_BASE_URL, params);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching license info for ID ${licenseId}:`, error);
    return null;
  }
},

/**
 * Validate a license by getting its details from IOMAD
 */
async validateLicense(licenseId: number): Promise<boolean> {
  try {
    const licenseDetails = await this.getLicenseInfoById(licenseId);
    
    if (!licenseDetails || !licenseDetails.license) {
      return false;
    }
    
    const license = licenseDetails.license;
    const now = Math.floor(Date.now() / 1000);
    
    // Check if license is expired (IOMAD treats expirydate: 0 as expired)
    if (license.expirydate === 0 || (license.expirydate > 0 && license.expirydate < now)) {
      return false;
    }
    
    // Check if license has available slots
    if (license.used >= license.allocation) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error validating license ${licenseId}:`, error);
    return false;
  }
},


/**
 * Allocate licenses to users for courses
 */
async allocateLicenseToUser(licenseId: number, userId: number, courseId: number): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    // Remember to replace this with a dynamic user token in production
    params.append('wstoken', IOMAD_TOKEN); 
    params.append('wsfunction', 'block_iomad_company_admin_allocate_licenses');
    params.append('moodlewsrestformat', 'json');
    params.append('licenses[0][licenseid]', String(licenseId));
    params.append('licenses[0][userid]', String(userId));
    params.append('licenses[0][licensecourseid]', String(courseId));

    console.log('STEP 1: Allocating license seat...', { licenseId, userId, courseId });

    const response = await axios.post(IOMAD_BASE_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log('API Response for license allocation:', response.data);

    // --- THE FIX IS HERE ---
    // The API can return boolean `true` or the number `1`.
    // Using `!!` correctly converts any "truthy" value to `true`.
    const success = !!response.data;
    
    if (response.data && response.data.exception) {
        console.error('API returned an exception during license allocation:', response.data);
        return false;
    }

    console.log('Was license allocation successful?', success);
    return success;

  } catch (error) {
    console.error('Network or other error during license allocation:', error);
    return false;
  }
},

  /**
   * Get learning paths (mock implementation)
   */
  async getLearningPaths(): Promise<any[]> {
    try {
      // Mock implementation - IOMAD may have specific endpoints for learning paths
      return [
        {
          id: 1,
          name: 'Teacher Development Path',
          description: 'Complete teacher training program',
          courses: ['101', '102', '103'],
          duration: '12 weeks'
        },
        {
          id: 2,
          name: 'Leadership Training Path',
          description: 'Educational leadership development',
          courses: ['201', '202', '203'],
          duration: '8 weeks'
        }
      ];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  },

  /**
   * Create learning path
   */
  async createLearningPath(pathData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...pathData,
        created: true
      };
    } catch (error) {
      console.error('Error creating learning path:', error);
      throw new Error('Failed to create learning path');
    }
  },

  /**
   * Get teaching locations
   */
  async getTeachingLocations(): Promise<any[]> {
    try {
      // Mock implementation - IOMAD may have specific endpoints for locations
      return [
        {
          id: 1,
          name: 'Main Campus',
          address: '123 Education St',
          type: 'physical',
          capacity: 500
        },
        {
          id: 2,
          name: 'Virtual Classroom A',
          platform: 'Zoom',
          type: 'virtual',
          capacity: 100
        }
      ];
    } catch (error) {
      console.error('Error fetching teaching locations:', error);
      return [];
    }
  },

  /**
   * Create teaching location
   */
  async createTeachingLocation(locationData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...locationData,
        created: true
      };
    } catch (error) {
      console.error('Error creating teaching location:', error);
      throw new Error('Failed to create teaching location');
    }
  },

  // Get all courses assigned to a company (school)
async getCompanyCourses(companyId: number): Promise<any[]> {
  const params = new URLSearchParams();
  params.append('wstoken', IOMAD_TOKEN);
  params.append('wsfunction', 'block_iomad_company_admin_get_company_courses');
  params.append('moodlewsrestformat', 'json');
  params.append('criteria[0][companyid]', String(companyId));
  params.append('criteria[0][shared]', '0');
  const response = await axios.post(IOMAD_BASE_URL, params);
  if (response.data && Array.isArray(response.data.companies) && response.data.companies.length > 0) {
    return response.data.companies[0].courses || [];
  }
  if (response.data && Array.isArray(response.data.courses)) {
    return response.data.courses;
  }
  return [];
},

  // Enroll a user in a course
async enrollUserInCourse(courseId: string, userId: string, roleId: number = 5): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    params.append('wstoken', IOMAD_TOKEN); // Use the same token
    params.append('wsfunction', 'enrol_manual_enrol_users');
    params.append('moodlewsrestformat', 'json');
    params.append('enrolments[0][roleid]', String(roleId));
    params.append('enrolments[0][userid]', userId);
    params.append('enrolments[0][courseid]', courseId);

    const response = await axios.post(IOMAD_BASE_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // A successful response is null or an empty array. An error response contains an 'exception' key.
    if (response.data && response.data.exception) {
      console.error('Moodle enrollment failed:', response.data);
      return false;
    }
    
    return true;

  } catch (error) {
    console.error('Error during Moodle course enrollment:', error);
    return false;
  }
},
};