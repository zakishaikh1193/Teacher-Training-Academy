import axios from 'axios';
import { apiService } from './api';

const API_BASE_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const API_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 150000,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    wstoken: API_TOKEN,
    moodlewsrestformat: 'json',
  };
  return config;
});

export interface AssignmentSubmission {
  id: string;
  assignmentid: string;
  userid: string;
  timecreated: number;
  timemodified: number;
  status: 'draft' | 'submitted' | 'graded';
  files?: any[];
  text?: string;
}

export interface QuizAttempt {
  id: string;
  quizid: string;
  userid: string;
  attempt: number;
  state: 'inprogress' | 'finished' | 'abandoned';
  timecreated: number;
  timefinish?: number;
  questions?: any[];
}

export interface ForumPost {
  id: string;
  discussionid: string;
  userid: string;
  subject: string;
  message: string;
  timecreated: number;
  timemodified: number;
  author: {
    id: string;
    fullname: string;
    profileimageurl: string;
  };
}

export interface BookChapter {
  id: string;
  bookid: string;
  title: string;
  content: string;
  chapter: number;
  subchapter: number;
  hidden: boolean;
  timecreated: number;
  timemodified: number;
}

export interface WorkshopSubmission {
  id: string;
  workshopid: string;
  userid: string;
  title: string;
  content: string;
  timecreated: number;
  timemodified: number;
  status: 'draft' | 'submitted' | 'assessed';
}

export const activityService = {
  // Activity Icon Functions
  async getActivityIcon(activityType: string): Promise<string | null> {
    try {
      console.log(`=== Starting icon fetch for ${activityType} ===`);
      
      // Real IOMAD/Moodle activity icon paths - these match the actual Moodle activity icons
      const activityIconPaths = {
        'assign': '/theme/image.php/boost/assign/1/icon', // Assignment - Pink icon with upward arrow on document
        'attendance': '/theme/image.php/boost/attendance/1/icon', // Attendance - Purple icon with two figures
        'book': '/theme/image.php/boost/book/1/icon', // Book - Teal icon of open book
        'choice': '/theme/image.php/boost/choice/1/icon', // Choice - Orange icon with branching arrow
        'data': '/theme/image.php/boost/data/1/icon', // Database - Green cylindrical database icon
        'facetoface': '/theme/image.php/boost/facetoface/1/icon', // Face-to-Face - Orange icon with two figures
        'feedback': '/theme/image.php/boost/feedback/1/icon', // Feedback - Orange icon with megaphone
        'file': '/theme/image.php/boost/resource/1/icon', // File - Teal document with plus sign
        'folder': '/theme/image.php/boost/folder/1/icon', // Folder - Teal folder icon
        'forum': '/theme/image.php/boost/forum/1/icon', // Forum - Green speech bubble with lines
        'glossary': '/theme/image.php/boost/glossary/1/icon', // Glossary - Purple icon with "AZ" on document
        'h5p': '/theme/image.php/boost/h5p/1/icon', // H5P - Blue icon with "H-P" in box
        'imscp': '/theme/image.php/boost/imscp/1/icon', // IMS content package - Brown stacked cubes
        'iomadcertificate': '/theme/image.php/boost/iomadcertificate/1/icon', // IOMAD Certificate - Orange certificate scroll
        'lesson': '/theme/image.php/boost/lesson/1/icon', // Lesson - Brown connected squares
        'page': '/theme/image.php/boost/page/1/icon', // Page - Teal document icon
        'quiz': '/theme/image.php/boost/quiz/1/icon', // Quiz - Pink checklist on document
        'scorm': '/theme/image.php/boost/scorm/1/icon', // SCORM package - Brown cardboard box
        'label': '/theme/image.php/boost/label/1/icon', // Text and media area - Teal "T" with bracket
        'trainingevent': '/theme/image.php/boost/trainingevent/1/icon', // Training event - Pink speech bubble
        'url': '/theme/image.php/boost/url/1/icon', // URL - Teal chain link
        'wiki': '/theme/image.php/boost/wiki/1/icon', // Wiki - Green network of dots
        'workshop': '/theme/image.php/boost/workshop/1/icon', // Workshop - Pink figures with gears
        'zoom': '/theme/image.php/boost/zoom/1/icon', // Zoom meeting - Orange video camera
        'resource': '/theme/image.php/boost/resource/1/icon', // Resource - Generic resource icon
        'default': '/theme/image.php/boost/core/1/icon' // Default icon
      };

      // Activity-specific fallback icon URLs (using different icons for each activity type)
      const fallbackIcons = {
        'assign': 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png', // Assignment - document with checkmark
        'attendance': 'https://cdn-icons-png.flaticon.com/512/1828/1828925.png', // Attendance - calendar with checkmark
        'book': 'https://cdn-icons-png.flaticon.com/512/1828/1828930.png', // Book - open book icon
        'choice': 'https://cdn-icons-png.flaticon.com/512/1828/1828921.png', // Choice - multiple choice icon
        'data': 'https://cdn-icons-png.flaticon.com/512/1828/1828917.png', // Database - database icon
        'facetoface': 'https://cdn-icons-png.flaticon.com/512/1828/1828922.png', // Face-to-Face - people icon
        'feedback': 'https://cdn-icons-png.flaticon.com/512/1828/1828923.png', // Feedback - megaphone icon
        'file': 'https://cdn-icons-png.flaticon.com/512/1828/1828916.png', // File - document icon
        'folder': 'https://cdn-icons-png.flaticon.com/512/1828/1828924.png', // Folder - folder icon
        'forum': 'https://cdn-icons-png.flaticon.com/512/1828/1828926.png', // Forum - chat bubble icon
        'glossary': 'https://cdn-icons-png.flaticon.com/512/1828/1828927.png', // Glossary - dictionary icon
        'h5p': 'https://cdn-icons-png.flaticon.com/512/1828/1828928.png', // H5P - interactive content icon
        'imscp': 'https://cdn-icons-png.flaticon.com/512/1828/1828929.png', // IMS content package - package icon
        'iomadcertificate': 'https://cdn-icons-png.flaticon.com/512/1828/1828931.png', // IOMAD Certificate - certificate icon
        'lesson': 'https://cdn-icons-png.flaticon.com/512/1828/1828932.png', // Lesson - lesson icon
        'page': 'https://cdn-icons-png.flaticon.com/512/1828/1828933.png', // Page - page icon
        'quiz': 'https://cdn-icons-png.flaticon.com/512/1828/1828934.png', // Quiz - quiz icon
        'scorm': 'https://cdn-icons-png.flaticon.com/512/1828/1828935.png', // SCORM package - package icon
        'label': 'https://cdn-icons-png.flaticon.com/512/1828/1828936.png', // Text and media area - text icon
        'trainingevent': 'https://cdn-icons-png.flaticon.com/512/1828/1828937.png', // Training event - event icon
        'url': 'https://cdn-icons-png.flaticon.com/512/1828/1828938.png', // URL - link icon
        'wiki': 'https://cdn-icons-png.flaticon.com/512/1828/1828939.png', // Wiki - wiki icon
        'workshop': 'https://cdn-icons-png.flaticon.com/512/1828/1828940.png', // Workshop - workshop icon
        'zoom': 'https://cdn-icons-png.flaticon.com/512/1828/1828941.png', // Zoom meeting - video icon
        'resource': 'https://cdn-icons-png.flaticon.com/512/1828/1828942.png', // Resource - resource icon
        'default': 'https://cdn-icons-png.flaticon.com/512/2991/2991110.png' // Default icon
      };

      const iconPath = activityIconPaths[activityType as keyof typeof activityIconPaths] || activityIconPaths.default;
      const baseUrl = API_BASE_URL.replace('/webservice/rest/server.php', '');
      const fullUrl = `${baseUrl}${iconPath}`;
      
      console.log(`Activity type: ${activityType}`);
      console.log(`Icon path: ${iconPath}`);
      console.log(`Base URL: ${baseUrl}`);
      console.log(`Full URL: ${fullUrl}`);
      console.log(`API Token: ${API_TOKEN ? 'Present' : 'Missing'}`);
      
      try {
        // Method 1: Try direct icon URL with token
        console.log('Method 1: Attempting direct icon URL with token...');
        const directResponse = await axios.get(fullUrl, {
          responseType: 'blob',
          params: { 
            token: API_TOKEN,
            wstoken: API_TOKEN 
          },
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Referer': baseUrl
          },
          timeout: 10000
        });

        if (directResponse.data && directResponse.data.size > 0) {
          console.log(`✅ Successfully fetched icon for ${activityType} via direct URL, size: ${directResponse.data.size} bytes`);
          const blob = new Blob([directResponse.data]);
          return URL.createObjectURL(blob);
        }

        // Method 2: Try without token (public access)
        console.log('Method 2: Attempting direct icon URL without token...');
        const publicResponse = await axios.get(fullUrl, {
          responseType: 'blob',
          timeout: 10000
        });

        if (publicResponse.data && publicResponse.data.size > 0) {
          console.log(`✅ Successfully fetched icon for ${activityType} via public URL, size: ${publicResponse.data.size} bytes`);
          const blob = new Blob([publicResponse.data]);
          return URL.createObjectURL(blob);
        }

        // Method 3: Try web service approach
        console.log('Method 3: Attempting web service approach...');
        const wsResponse = await axios.get(API_BASE_URL, {
          params: {
            wstoken: API_TOKEN,
            wsfunction: 'core_files_get_files',
            moodlewsrestformat: 'json',
            contextid: '1',
            component: 'theme',
            filearea: 'image',
            itemid: '0',
            filepath: iconPath.replace('/theme/image.php/boost/', ''),
            filename: 'icon'
          },
          timeout: 10000
        });

        console.log('Web service response:', wsResponse.data);

        if (wsResponse.data && wsResponse.data.files && wsResponse.data.files.length > 0) {
          const iconFile = wsResponse.data.files[0];
          console.log('Found icon file:', iconFile);
          
          const iconResponse = await axios.get(iconFile.url, {
            responseType: 'blob',
            params: { token: API_TOKEN },
            timeout: 10000
          });

          if (iconResponse.data && iconResponse.data.size > 0) {
            console.log(`✅ Successfully fetched icon for ${activityType} via web service, size: ${iconResponse.data.size} bytes`);
            const blob = new Blob([iconResponse.data]);
            return URL.createObjectURL(blob);
          }
        }

        console.log(`❌ All methods failed for ${activityType}, using fallback icon`);
      } catch (apiError: any) {
        console.error(`❌ API fetch failed for ${activityType}:`, apiError);
        if (apiError.response) {
          console.error(`Response status: ${apiError.response.status}`);
          console.error(`Response data:`, apiError.response.data);
        }
      }
      
      // If API fails, return fallback icon
      console.log(`🔄 Using fallback icon for ${activityType}`);
      const fallbackUrl = fallbackIcons[activityType as keyof typeof fallbackIcons] || fallbackIcons.default;
      console.log(`Fallback URL: ${fallbackUrl}`);
      return fallbackUrl;
    } catch (error) {
      console.error('❌ Error fetching activity icon:', error);
      return 'https://cdn-icons-png.flaticon.com/512/2991/2991110.png';
    }
  },

  async getAllActivityIcons(): Promise<Record<string, string>> {
    try {
      const activityTypes = [
        'assign', 'attendance', 'book', 'choice', 'data', 'facetoface', 
        'feedback', 'file', 'folder', 'forum', 'glossary', 'h5p', 
        'imscp', 'iomadcertificate', 'lesson', 'page', 'quiz', 'scorm', 
        'label', 'trainingevent', 'url', 'wiki', 'workshop', 'zoom'
      ];

      const icons: Record<string, string> = {};
      
      for (const activityType of activityTypes) {
        const iconUrl = await this.getActivityIcon(activityType);
        if (iconUrl) {
          icons[activityType] = iconUrl;
        }
      }

      return icons;
    } catch (error) {
      console.error('Error fetching all activity icons:', error);
      return {};
    }
  },

  // Assignment Functions
  async getAssignmentDetails(assignmentId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_assign_get_assignments',
          courseids: [assignmentId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.courses && response.data.courses.length > 0) {
        const course = response.data.courses[0];
        const assignment = course.assignments?.find((a: any) => a.id.toString() === assignmentId.split('_')[1]);
        return assignment || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      return null;
    }
  },

  async getAssignmentSubmissions(assignmentId: string, userId: string): Promise<AssignmentSubmission[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_assign_get_submissions',
          assignids: [assignmentId],
        },
      });

      if (response.data && response.data.assignments && response.data.assignments.length > 0) {
        const assignment = response.data.assignments[0];
        return assignment.submissions?.filter((s: any) => s.userid.toString() === userId) || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
      return [];
    }
  },

  async submitAssignment(assignmentId: string, userId: string, data: { text?: string; files?: File[] }): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'mod_assign_save_submission');
      params.append('moodlewsrestformat', 'json');
      params.append('assignmentid', assignmentId);
      params.append('plugindata[assignsubmission_text_editor][text]', data.text || '');
      params.append('plugindata[assignsubmission_text_editor][format]', '1');

      if (data.files && data.files.length > 0) {
        // Handle file uploads
        for (let i = 0; i < data.files.length; i++) {
          const file = data.files[i];
          params.append(`plugindata[assignsubmission_file][files][${i}][filename]`, file.name);
          params.append(`plugindata[assignsubmission_file][files][${i}][filepath]`, '/');
          // Note: File content would need to be base64 encoded in a real implementation
        }
      }

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      return false;
    }
  },

  // Quiz Functions
  async getQuizDetails(quizId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_quiz_get_quizzes_by_courses',
          courseids: [quizId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.quizzes && response.data.quizzes.length > 0) {
        const quiz = response.data.quizzes.find((q: any) => q.id.toString() === quizId.split('_')[1]);
        return quiz || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      return null;
    }
  },

  async getQuizQuestions(quizId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_quiz_get_questions',
          quizid: quizId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  },

  async startQuizAttempt(quizId: string, userId: string): Promise<QuizAttempt | null> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'mod_quiz_start_attempt');
      params.append('moodlewsrestformat', 'json');
      params.append('quizid', quizId);

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data && response.data.attempt) {
        return {
          id: response.data.attempt.id.toString(),
          quizid: quizId,
          userid: userId,
          attempt: response.data.attempt.attempt,
          state: response.data.attempt.state,
          timecreated: response.data.attempt.timecreated,
        };
      }
      return null;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      return null;
    }
  },

  async submitQuizAttempt(attemptId: string, answers: any[]): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'mod_quiz_process_attempt');
      params.append('moodlewsrestformat', 'json');
      params.append('attemptid', attemptId);
      params.append('finishattempt', '1');

      // Add answers
      answers.forEach((answer, index) => {
        params.append(`data[${index}][name]`, answer.name);
        params.append(`data[${index}][value]`, answer.value);
      });

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      return false;
    }
  },

  // Resource/File Functions
  async getResourceDetails(resourceId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_resource_get_resources_by_courses',
          courseids: [resourceId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.resources && response.data.resources.length > 0) {
        const resource = response.data.resources.find((r: any) => r.id.toString() === resourceId.split('_')[1]);
        return resource || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching resource details:', error);
      return null;
    }
  },

  async downloadResource(resourceId: string): Promise<Blob | null> {
    try {
      const resource = await this.getResourceDetails(resourceId);
      if (!resource || !resource.contentfiles || resource.contentfiles.length === 0) {
        return null;
      }

      const fileUrl = resource.contentfiles[0].fileurl;
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        params: { token: API_TOKEN }
      });

      return response.data;
    } catch (error) {
      console.error('Error downloading resource:', error);
      return null;
    }
  },

  // Forum Functions
  async getForumDetails(forumId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_forum_get_forums_by_courses',
          courseids: [forumId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.forums && response.data.forums.length > 0) {
        const forum = response.data.forums.find((f: any) => f.id.toString() === forumId.split('_')[1]);
        return forum || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching forum details:', error);
      return null;
    }
  },

  async getForumDiscussions(forumId: string): Promise<any[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_forum_get_forum_discussions',
          forumid: forumId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching forum discussions:', error);
      return [];
    }
  },

  async getForumPosts(discussionId: string): Promise<ForumPost[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_forum_get_forum_discussion_posts',
          discussionid: discussionId,
        },
      });

      if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        return response.data.posts.map((post: any) => ({
          id: post.id.toString(),
          discussionid: discussionId,
          userid: post.userid.toString(),
          subject: post.subject,
          message: post.message,
          timecreated: post.timecreated,
          timemodified: post.timemodified,
          author: {
            id: post.userid.toString(),
            fullname: post.userfullname,
            profileimageurl: post.userpictureurl,
          },
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      return [];
    }
  },

  async createForumPost(discussionId: string, userId: string, subject: string, message: string): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'mod_forum_add_discussion_post');
      params.append('moodlewsrestformat', 'json');
      params.append('postid', discussionId);
      params.append('subject', subject);
      params.append('message', message);

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error creating forum post:', error);
      return false;
    }
  },

  // URL/Link Functions
  async getUrlDetails(urlId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_url_get_urls_by_courses',
          courseids: [urlId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.urls && response.data.urls.length > 0) {
        const url = response.data.urls.find((u: any) => u.id.toString() === urlId.split('_')[1]);
        return url || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching URL details:', error);
      return null;
    }
  },

  // Book Functions
  async getBookDetails(bookId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_book_get_books_by_courses',
          courseids: [bookId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.books && response.data.books.length > 0) {
        const book = response.data.books.find((b: any) => b.id.toString() === bookId.split('_')[1]);
        return book || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  },

  async getBookChapters(bookId: string): Promise<BookChapter[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_book_get_book_chapters',
          bookid: bookId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((chapter: any) => ({
          id: chapter.id.toString(),
          bookid: bookId,
          title: chapter.title,
          content: chapter.content,
          chapter: chapter.pagenum,
          subchapter: chapter.subchapter,
          hidden: chapter.hidden,
          timecreated: chapter.timecreated,
          timemodified: chapter.timemodified,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching book chapters:', error);
      return [];
    }
  },

  async getBookChapterContent(chapterId: string): Promise<string | null> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_book_get_book_chapter',
          chapterid: chapterId,
        },
      });

      if (response.data && response.data.content) {
        return response.data.content;
      }
      return null;
    } catch (error) {
      console.error('Error fetching book chapter content:', error);
      return null;
    }
  },

  // Workshop Functions
  async getWorkshopDetails(workshopId: string): Promise<any> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_workshop_get_workshops_by_courses',
          courseids: [workshopId.split('_')[0]], // Extract course ID
        },
      });

      if (response.data && response.data.workshops && response.data.workshops.length > 0) {
        const workshop = response.data.workshops.find((w: any) => w.id.toString() === workshopId.split('_')[1]);
        return workshop || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching workshop details:', error);
      return null;
    }
  },

  async registerForWorkshop(workshopId: string, userId: string): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'mod_workshop_add_submission');
      params.append('moodlewsrestformat', 'json');
      params.append('workshopid', workshopId);
      params.append('title', 'Workshop Registration');
      params.append('content', 'Registered for workshop');

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error registering for workshop:', error);
      return false;
    }
  },

  async getWorkshopSubmissions(workshopId: string): Promise<WorkshopSubmission[]> {
    try {
      const response = await api.get('', {
        params: {
          wsfunction: 'mod_workshop_get_submissions',
          workshopid: workshopId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((submission: any) => ({
          id: submission.id.toString(),
          workshopid: workshopId,
          userid: submission.authorid.toString(),
          title: submission.title,
          content: submission.content,
          timecreated: submission.timecreated,
          timemodified: submission.timemodified,
          status: submission.status,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching workshop submissions:', error);
      return [];
    }
  },

  // Generic Activity Functions
  async getActivityDetails(activityId: string, activityType: string): Promise<any> {
    switch (activityType) {
      case 'assign':
        return this.getAssignmentDetails(activityId);
      case 'quiz':
        return this.getQuizDetails(activityId);
      case 'resource':
        return this.getResourceDetails(activityId);
      case 'forum':
        return this.getForumDetails(activityId);
      case 'url':
        return this.getUrlDetails(activityId);
      case 'book':
        return this.getBookDetails(activityId);
      case 'workshop':
        return this.getWorkshopDetails(activityId);
      default:
        return null;
    }
  },

  async getActivityContent(activityId: string, activityType: string): Promise<any> {
    switch (activityType) {
      case 'assign':
        return this.getAssignmentSubmissions(activityId, 'current_user_id'); // TODO: Get actual user ID
      case 'quiz':
        return this.getQuizQuestions(activityId);
      case 'resource':
        return this.getResourceDetails(activityId);
      case 'forum':
        return this.getForumDiscussions(activityId);
      case 'url':
        return this.getUrlDetails(activityId);
      case 'book':
        return this.getBookChapters(activityId);
      case 'workshop':
        return this.getWorkshopSubmissions(activityId);
      default:
        return null;
    }
  },

  // File Upload Helper
  async uploadFile(file: File, contextId: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('wstoken', API_TOKEN);
      formData.append('wsfunction', 'core_files_upload');
      formData.append('moodlewsrestformat', 'json');
      formData.append('contextid', contextId);
      formData.append('component', 'user');
      formData.append('filearea', 'draft');
      formData.append('itemid', '0');
      formData.append('filepath', '/');
      formData.append('filename', file.name);
      formData.append('filecontent', file);

      const response = await axios.post(API_BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.files && response.data.files.length > 0) {
        return response.data.files[0].url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },

  // Progress Tracking
  async updateActivityProgress(activityId: string, userId: string, progress: number): Promise<boolean> {
    try {
      const params = new URLSearchParams();
      params.append('wstoken', API_TOKEN);
      params.append('wsfunction', 'core_completion_update_activity_completion_status_manually');
      params.append('moodlewsrestformat', 'json');
      params.append('cmid', activityId);
      params.append('completed', progress === 100 ? '1' : '0');

      const response = await axios.post(API_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data && !response.data.exception;
    } catch (error) {
      console.error('Error updating activity progress:', error);
      return false;
    }
  },
}; 