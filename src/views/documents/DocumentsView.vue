<template>
  <div class="documents">
    <header class="documents-header">
      <h1>My Documents</h1>
      <div class="header-actions">
        <button @click="navigateToUpload" class="upload-btn">Upload New</button>
        <button @click="navigateToDashboard" class="back-btn">Back to Dashboard</button>
      </div>
    </header>

    <div class="documents-content">
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search documents..."
          class="search-input"
          @input="handleSearch"
        />
        <select v-model="filterFolder" class="filter-select" @change="handleFilter">
          <option value="">All Folders</option>
          <!-- TODO: Populate with actual folders -->
        </select>
      </div>

      <div v-if="loading" class="loading">Loading documents...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredDocuments.length === 0" class="empty">
        <p>No documents found</p>
        <button @click="navigateToUpload" class="upload-btn">Upload Your First Document</button>
      </div>
      <div v-else class="documents-grid">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="document-card"
        >
          <div class="card-header">
            <h3 class="doc-title">{{ doc.title }}</h3>
            <span :class="['visibility-badge', !doc.is_private ? 'public' : 'private']">
              {{ !doc.is_private ? 'Public' : 'Private' }}
            </span>
          </div>
          <div class="card-body">
            <p class="doc-info">Size: {{ formatFileSize(doc.file_size_bytes) }}</p>
            <p class="doc-info">Uploaded: {{ formatDate(doc.created_at) }}</p>
            <p class="doc-info" v-if="doc.folder_id">Folder ID: {{ doc.folder_id }}</p>
          </div>
          <div class="card-actions">
            <button @click="handleDownload(doc)" class="action-btn">Download</button>
            <button @click="handleToggleVisibility(doc)" class="action-btn">
              {{ !doc.is_private ? 'Make Private' : 'Make Public' }}
            </button>
            <button @click="handleDelete(doc)" class="action-btn danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { documentAPI } from '@/api';
import { formatFileSize, formatDate } from '@/utils';
import type { Document } from '@/types';

const router = useRouter();

const documents = ref<Document[]>([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const filterFolder = ref('');

const filteredDocuments = computed(() => {
  let filtered = documents.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(query)
    );
  }

  // Filter by folder
  if (filterFolder.value) {
    filtered = filtered.filter(doc => doc.folder_id === filterFolder.value);
  }

  return filtered;
});

const loadDocuments = async () => {
  loading.value = true;
  error.value = '';

  try {
    documents.value = await documentAPI.list();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load documents';
    console.error('Load documents error:', err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // Filtering is reactive through computed property
};

const handleFilter = () => {
  // Filtering is reactive through computed property
};

const handleDownload = async (doc: Document) => {
  try {
    await documentAPI.download(doc.id);
    // Browser will handle the download
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to download document');
  }
};

const handleToggleVisibility = async (doc: Document) => {
  try {
    await documentAPI.changeVisibility(doc.id, !doc.is_private);
    // Reload documents to reflect changes
    await loadDocuments();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update visibility');
  }
};

const handleDelete = async (doc: Document) => {
  if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) {
    return;
  }

  try {
    await documentAPI.delete(doc.id);
    // Remove from local array
    documents.value = documents.value.filter(d => d.id !== doc.id);
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete document');
  }
};

const navigateToUpload = () => router.push('/upload');
const navigateToDashboard = () => router.push('/dashboard');

onMounted(() => {
  loadDocuments();
});
</script>

<style scoped>
.documents {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
}

.documents-header h1 {
  font-size: 2rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.upload-btn, .back-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-btn {
  background: white;
  color: #667eea;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.documents-content {
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input, .filter-select {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.search-input {
  flex: 1;
}

.filter-select {
  min-width: 200px;
}

.loading, .error, .empty {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  color: #2c3e50;
}

.error {
  color: #dc3545;
}

.empty p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.document-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.doc-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  word-break: break-word;
  flex: 1;
}

.visibility-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.visibility-badge.public {
  background: #d4edda;
  color: #155724;
}

.visibility-badge.private {
  background: #f8d7da;
  color: #721c24;
}

.card-body {
  margin-bottom: 1rem;
}

.doc-info {
  margin: 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #667eea;
  color: white;
}

.action-btn.danger {
  border-color: #dc3545;
  color: #dc3545;
}

.action-btn.danger:hover {
  background: #dc3545;
  color: white;
}
</style>
