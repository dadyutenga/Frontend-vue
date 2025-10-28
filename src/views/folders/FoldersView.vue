<template>
  <div class="folders">
    <header class="folders-header">
      <h1>My Folders</h1>
      <div class="header-actions">
        <button @click="showCreateModal = true" class="create-btn">Create Folder</button>
        <button @click="navigateToDashboard" class="back-btn">Back to Dashboard</button>
      </div>
    </header>

    <div class="folders-content">
      <div v-if="loading" class="loading">Loading folders...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="folders.length === 0" class="empty">
        <p>No folders yet</p>
        <button @click="showCreateModal = true" class="create-btn">Create Your First Folder</button>
      </div>
      <div v-else class="folders-grid">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="folder-card"
        >
          <div class="folder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 class="folder-name">{{ folder.name }}</h3>
          <p class="folder-description">{{ folder.description || 'No description' }}</p>
          <div class="folder-stats">
            <span>Folder</span>
          </div>
          <div class="card-actions">
            <button @click="handleEdit(folder)" class="action-btn">Edit</button>
            <button @click="handleDelete(folder)" class="action-btn danger">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <h2>{{ showEditModal ? 'Edit Folder' : 'Create New Folder' }}</h2>
        <form @submit.prevent="handleSubmit" class="folder-form">
          <div class="form-group">
            <label for="name">Folder Name *</label>
            <input
              id="name"
              v-model="modalForm.name"
              type="text"
              placeholder="Enter folder name"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="modalForm.description"
              placeholder="Enter folder description (optional)"
              rows="4"
              class="form-input"
            ></textarea>
          </div>

          <div v-if="modalError" class="error-message">{{ modalError }}</div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Cancel</button>
            <button type="submit" :disabled="modalLoading" class="submit-btn">
              {{ modalLoading ? 'Saving...' : showEditModal ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { folderAPI } from '@/api';
import type { Folder } from '@/types';

const router = useRouter();

const folders = ref<Folder[]>([]);
const loading = ref(false);
const error = ref('');

const showCreateModal = ref(false);
const showEditModal = ref(false);
const modalLoading = ref(false);
const modalError = ref('');
const editingFolder = ref<Folder | null>(null);

const modalForm = ref({
  name: '',
  description: '',
});

const loadFolders = async () => {
  loading.value = true;
  error.value = '';

  try {
    folders.value = await folderAPI.list();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load folders';
    console.error('Load folders error:', err);
  } finally {
    loading.value = false;
  }
};

const handleEdit = (folder: Folder) => {
  editingFolder.value = folder;
  modalForm.value = {
    name: folder.name,
    description: folder.description || '',
  };
  showEditModal.value = true;
};

const handleDelete = async (folder: Folder) => {
  if (!confirm(`Are you sure you want to delete the folder "${folder.name}"? This will not delete the documents inside.`)) {
    return;
  }

  try {
    await folderAPI.delete(folder.id);
    folders.value = folders.value.filter(f => f.id !== folder.id);
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete folder');
  }
};

const handleSubmit = async () => {
  if (!modalForm.value.name.trim()) {
    modalError.value = 'Folder name is required';
    return;
  }

  modalLoading.value = true;
  modalError.value = '';

  try {
    if (showEditModal.value && editingFolder.value) {
      // Update existing folder
      await folderAPI.update(editingFolder.value.id, {
        name: modalForm.value.name,
        description: modalForm.value.description || undefined,
      });
    } else {
      // Create new folder
      await folderAPI.create({
        name: modalForm.value.name,
        description: modalForm.value.description,
        isPublic: false,
      });
    }

    // Reload folders
    await loadFolders();
    closeModals();
  } catch (err: any) {
    modalError.value = err.response?.data?.message || 'Failed to save folder';
    console.error('Save folder error:', err);
  } finally {
    modalLoading.value = false;
  }
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingFolder.value = null;
  modalForm.value = { name: '', description: '' };
  modalError.value = '';
};

const navigateToDashboard = () => router.push('/dashboard');

onMounted(() => {
  loadFolders();
});
</script>

<style scoped>
.folders {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.folders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
}

.folders-header h1 {
  font-size: 2rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.create-btn, .back-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-btn {
  background: white;
  color: #667eea;
}

.create-btn:hover {
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

.folders-content {
  max-width: 1200px;
  margin: 0 auto;
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

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.folder-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
}

.folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.folder-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  color: #667eea;
}

.folder-icon svg {
  width: 100%;
  height: 100%;
}

.folder-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.folder-description {
  color: #6c757d;
  margin: 0 0 1rem 0;
  min-height: 2.5rem;
}

.folder-stats {
  margin: 1rem 0;
  color: #667eea;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.folder-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #e9ecef;
  color: #2c3e50;
}

.cancel-btn:hover {
  background: #dee2e6;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
