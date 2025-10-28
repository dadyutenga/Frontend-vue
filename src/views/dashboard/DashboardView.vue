<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Documents</h3>
          <p class="stat-value">{{ stats.totalDocuments }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Folders</h3>
          <p class="stat-value">{{ stats.totalFolders }}</p>
        </div>
        <div class="stat-card">
          <h3>Storage Used</h3>
          <p class="stat-value">{{ formatFileSize(stats.storageUsed) }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button @click="navigateToUpload" class="action-btn primary">
            Upload Document
          </button>
          <button @click="navigateToDocuments" class="action-btn">
            View Documents
          </button>
          <button @click="navigateToFolders" class="action-btn">
            Manage Folders
          </button>
        </div>
      </div>

      <div class="recent-documents" v-if="recentDocuments.length > 0">
        <h2>Recent Documents</h2>
        <div class="document-list">
          <div v-for="doc in recentDocuments" :key="doc.id" class="document-item">
            <span class="doc-name">{{ doc.title }}</span>
            <span class="doc-date">{{ formatDate(doc.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { documentAPI } from '@/api';
import { formatFileSize, formatDate } from '@/utils';
import type { Document } from '@/types';

const router = useRouter();

const stats = ref({
  totalDocuments: 0,
  totalFolders: 0,
  storageUsed: 0,
});

const recentDocuments = ref<Document[]>([]);
const loading = ref(false);
const error = ref('');

const loadDashboardData = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Load recent documents
    const allDocs: Document[] = await documentAPI.list();
    
    // Sort by upload date and take first 5
    recentDocuments.value = allDocs
      .sort((a: Document, b: Document) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Calculate stats
    stats.value.totalDocuments = allDocs.length;
    stats.value.storageUsed = allDocs.reduce((total: number, doc: Document) => total + (doc.file_size_bytes || 0), 0);
    
    // TODO: Load folder count when folders API is integrated
    stats.value.totalFolders = 0;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load dashboard data';
    console.error('Dashboard load error:', err);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const navigateToUpload = () => router.push('/upload');
const navigateToDocuments = () => router.push('/documents');
const navigateToFolders = () => router.push('/folders');

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin: 0;
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

.quick-actions, .recent-documents {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.quick-actions h2, .recent-documents h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1rem 2rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.document-item:hover {
  background: #e9ecef;
}

.doc-name {
  font-weight: 500;
  color: #2c3e50;
}

.doc-date {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
