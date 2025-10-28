<template>
  <div class="upload">
    <header class="upload-header">
      <h1>Upload Document</h1>
      <button @click="navigateBack" class="back-btn">Back</button>
    </header>

    <div class="upload-content">
      <div class="upload-card">
        <form @submit.prevent="handleUpload" class="upload-form">
          <div
            class="drop-zone"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="drop-text">Drag and drop your file here</p>
            <p class="drop-or">or</p>
            <label for="file-input" class="file-label">Browse Files</label>
            <input
              id="file-input"
              ref="fileInput"
              type="file"
              accept=".md,.txt,.pdf,.doc,.docx"
              @change="handleFileSelect"
              style="display: none;"
            />
          </div>

          <div v-if="selectedFile" class="file-info">
            <p class="file-name">{{ selectedFile.name }}</p>
            <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
            <button type="button" @click="clearFile" class="clear-btn">Remove</button>
          </div>

          <div class="form-group">
            <label for="folder">Folder (Optional)</label>
            <select id="folder" v-model="formData.folderId" class="form-select">
              <option value="">No Folder</option>
              <!-- TODO: Populate with actual folders -->
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.isPublic" />
              <span>Make this document public</span>
            </label>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            <span class="progress-text">{{ uploadProgress }}%</span>
          </div>

          <button
            type="submit"
            :disabled="!selectedFile || loading"
            class="submit-btn"
          >
            {{ loading ? 'Uploading...' : 'Upload Document' }}
          </button>
        </form>
      </div>

      <div class="upload-info">
        <h2>Supported Formats</h2>
        <ul>
          <li>Markdown (.md)</li>
          <li>Text Files (.txt)</li>
          <li>PDF Documents (.pdf)</li>
          <li>Word Documents (.doc, .docx)</li>
        </ul>
        <p class="info-note">Maximum file size: 10MB</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { uploadAPI } from '@/api';
import { formatFileSize } from '@/utils';

const router = useRouter();

const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const loading = ref(false);
const error = ref('');
const uploadProgress = ref(0);

const formData = ref({
  folderId: '',
  isPublic: false,
});

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0 && files[0]) {
    selectedFile.value = files[0];
    error.value = '';
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    selectedFile.value = target.files[0];
    error.value = '';
  }
};

const clearFile = () => {
  selectedFile.value = null;
  error.value = '';
  uploadProgress.value = 0;
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a file to upload';
    return;
  }

  // Validate file size (10MB)
  if (selectedFile.value.size > 10 * 1024 * 1024) {
    error.value = 'File size exceeds 10MB limit';
    return;
  }

  loading.value = true;
  error.value = '';
  uploadProgress.value = 0;

  try {
    // Simulate progress (in real app, use axios onUploadProgress)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);

    await uploadAPI.uploadDocument(
      selectedFile.value,
      formData.value.folderId || undefined,
      formData.value.isPublic
    );

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Success - navigate to documents
    setTimeout(() => {
      router.push('/documents');
    }, 500);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to upload document';
    console.error('Upload error:', err);
    uploadProgress.value = 0;
  } finally {
    loading.value = false;
  }
};

const navigateBack = () => {
  router.back();
};
</script>

<style scoped>
.upload {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
}

.upload-header h1 {
  font-size: 2rem;
  margin: 0;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.upload-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drop-zone {
  border: 3px dashed #cbd5e0;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.drop-zone:hover, .drop-zone.drag-over {
  border-color: #667eea;
  background: #f7fafc;
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #667eea;
}

.drop-text {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.drop-or {
  color: #6c757d;
  margin: 1rem 0;
}

.file-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.file-label:hover {
  transform: translateY(-2px);
}

.file-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
}

.file-size {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-btn:hover {
  background: #c82333;
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

.form-select {
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.error-message {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.progress-bar {
  position: relative;
  height: 40px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.submit-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-info h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.upload-info ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.upload-info li {
  padding: 0.5rem 0;
  color: #6c757d;
}

.info-note {
  color: #667eea;
  font-weight: 500;
  margin: 0;
}
</style>
