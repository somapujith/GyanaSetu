import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== USER MANAGEMENT ====================

/**
 * Fetch all users from Firestore
 */
export const fetchAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Update user role (promote/demote)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Ban/Suspend a user
 */
export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status,
      statusUpdatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ==================== ANALYTICS ====================

/**
 * Get resource analytics
 */
export const getResourceAnalytics = (resources) => {
  const analytics = {
    totalResources: resources.length,
    approvedResources: resources.filter(r => r.status === 'available').length,
    pendingResources: resources.filter(r => r.status === 'pending').length,
    totalViews: resources.reduce((sum, r) => sum + (r.views || 0), 0),
    totalDownloads: resources.reduce((sum, r) => sum + (r.downloads || 0), 0),
    
    // By category
    byCategory: {},
    
    // By college
    byCollege: {},
    
    // Top resources
    topViewed: [...resources].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    topDownloaded: [...resources].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5),
    
    // Recent resources
    recentResources: [...resources].sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    }).slice(0, 5),
  };

  // Calculate by category
  resources.forEach(r => {
    const cat = r.category || 'other';
    if (!analytics.byCategory[cat]) {
      analytics.byCategory[cat] = { count: 0, views: 0, downloads: 0 };
    }
    analytics.byCategory[cat].count++;
    analytics.byCategory[cat].views += r.views || 0;
    analytics.byCategory[cat].downloads += r.downloads || 0;
  });

  // Calculate by college
  resources.forEach(r => {
    const college = r.college || 'Unknown';
    if (!analytics.byCollege[college]) {
      analytics.byCollege[college] = { count: 0, views: 0, downloads: 0 };
    }
    analytics.byCollege[college].count++;
    analytics.byCollege[college].views += r.views || 0;
    analytics.byCollege[college].downloads += r.downloads || 0;
  });

  return analytics;
};

/**
 * Get user analytics
 */
export const getUserAnalytics = (users) => {
  const analytics = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    activeUsers: users.filter(u => u.status !== 'banned' && u.status !== 'suspended').length,
    bannedUsers: users.filter(u => u.status === 'banned').length,
    
    // By college
    byCollege: {},
    
    // Recent registrations
    recentUsers: [...users].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    }).slice(0, 5),
  };

  // Calculate by college
  users.forEach(u => {
    const college = u.college || 'Unknown';
    if (!analytics.byCollege[college]) {
      analytics.byCollege[college] = 0;
    }
    analytics.byCollege[college]++;
  });

  return analytics;
};

// ==================== BULK ACTIONS ====================

/**
 * Bulk approve resources
 */
export const bulkApproveResources = async (resourceIds) => {
  try {
    const batch = writeBatch(db);
    resourceIds.forEach(id => {
      const resourceRef = doc(db, 'resources', id);
      batch.update(resourceRef, { status: 'available' });
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk approving:', error);
    throw error;
  }
};

/**
 * Bulk delete resources
 */
export const bulkDeleteResources = async (resourceIds) => {
  try {
    const batch = writeBatch(db);
    resourceIds.forEach(id => {
      const resourceRef = doc(db, 'resources', id);
      batch.delete(resourceRef);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error bulk deleting:', error);
    throw error;
  }
};

/**
 * Feature/Unfeature a resource
 */
export const toggleFeatureResource = async (resourceId, featured) => {
  try {
    const resourceRef = doc(db, 'resources', resourceId);
    await updateDoc(resourceRef, { featured });
    return true;
  } catch (error) {
    console.error('Error toggling feature:', error);
    throw error;
  }
};

// ==================== ANNOUNCEMENTS ====================

/**
 * Create announcement
 */
export const createAnnouncement = async (announcement) => {
  try {
    const announcementRef = collection(db, 'announcements');
    const docRef = await addDoc(announcementRef, {
      ...announcement,
      createdAt: serverTimestamp(),
      active: true,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

/**
 * Get all announcements
 */
export const fetchAnnouncements = async () => {
  try {
    const announcementsRef = collection(db, 'announcements');
    const q = query(announcementsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (announcementId) => {
  try {
    const announcementRef = doc(db, 'announcements', announcementId);
    await deleteDoc(announcementRef);
    return true;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// ==================== PLATFORM SETTINGS ====================

/**
 * Get platform settings
 */
export const getPlatformSettings = async () => {
  try {
    const settingsRef = doc(db, 'settings', 'platform');
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Return defaults
    return {
      allowRegistrations: true,
      allowResourcePosting: true,
      autoApproveResources: false,
      maxFileSize: 50,
      enableNotifications: true,
      maintenanceMode: false,
      platformName: 'GyanaSetu',
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Update platform settings
 */
export const updatePlatformSettings = async (settings) => {
  try {
    const settingsRef = doc(db, 'settings', 'platform');
    await setDoc(settingsRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// ==================== COLLEGES & DEPARTMENTS ====================

/**
 * Get dynamic colleges
 */
export const fetchColleges = async () => {
  try {
    const collegesRef = collection(db, 'colleges');
    const snapshot = await getDocs(collegesRef);
    if (snapshot.empty) {
      return null; // Use default constants
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};

/**
 * Add college
 */
export const addCollege = async (collegeName) => {
  try {
    const collegesRef = collection(db, 'colleges');
    const docRef = await addDoc(collegesRef, {
      name: collegeName,
      createdAt: serverTimestamp(),
      active: true,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding college:', error);
    throw error;
  }
};

/**
 * Delete college
 */
export const removeCollege = async (collegeId) => {
  try {
    const collegeRef = doc(db, 'colleges', collegeId);
    await deleteDoc(collegeRef);
    return true;
  } catch (error) {
    console.error('Error removing college:', error);
    throw error;
  }
};

/**
 * Get dynamic departments
 */
export const fetchDepartments = async () => {
  try {
    const departmentsRef = collection(db, 'departments');
    const snapshot = await getDocs(departmentsRef);
    if (snapshot.empty) {
      return null; // Use default constants
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Add department
 */
export const addDepartment = async (departmentName) => {
  try {
    const departmentsRef = collection(db, 'departments');
    const docRef = await addDoc(departmentsRef, {
      name: departmentName,
      createdAt: serverTimestamp(),
      active: true,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

/**
 * Delete department
 */
export const removeDepartment = async (departmentId) => {
  try {
    const departmentRef = doc(db, 'departments', departmentId);
    await deleteDoc(departmentRef);
    return true;
  } catch (error) {
    console.error('Error removing department:', error);
    throw error;
  }
};

// ==================== REPORTS ====================

/**
 * Report a resource
 */
export const reportResource = async (resourceId, reportData) => {
  try {
    const reportsRef = collection(db, 'reports');
    const docRef = await addDoc(reportsRef, {
      resourceId,
      ...reportData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error reporting resource:', error);
    throw error;
  }
};

/**
 * Get all reports
 */
export const fetchReports = async () => {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

/**
 * Update report status
 */
export const updateReportStatus = async (reportId, status) => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { 
      status,
      resolvedAt: status === 'resolved' ? serverTimestamp() : null,
    });
    return true;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// ==================== EXPORT ====================

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) {
          value = '';
        }
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        // Escape quotes and wrap in quotes if contains comma
        value = String(value).replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

/**
 * Prepare users data for export
 */
export const prepareUsersExport = (users) => {
  return users.map(u => ({
    Name: u.fullName || '',
    Email: u.email || '',
    College: u.college || '',
    Role: u.role || '',
    Status: u.status || 'active',
    'Registered On': u.createdAt || '',
  }));
};

/**
 * Prepare resources data for export
 */
export const prepareResourcesExport = (resources) => {
  return resources.map(r => ({
    Title: r.title || '',
    Category: r.category || '',
    College: r.college || '',
    Department: r.department || '',
    Status: r.status || '',
    Views: r.views || 0,
    Downloads: r.downloads || 0,
    'Posted By': r.userName || '',
    'Created On': r.createdAt?.toDate?.().toLocaleDateString() || '',
  }));
};
