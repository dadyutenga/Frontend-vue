<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authAPI } from '@/api';
import { isValidOTP } from '@/utils';

const router = useRouter();
const route = useRoute();
const email = ref('');
const otp = ref('');
const error = ref('');
const loading = ref(false);

onMounted(() => {
  email.value = (route.query.email as string) || sessionStorage.getItem('pendingEmail') || '';
  
  if (!email.value) {
    router.push({ name: 'login' });
  }
});

const handleVerify = async () => {
  error.value = '';
  
  if (!isValidOTP(otp.value)) {
    error.value = 'Please enter a valid 6-digit code';
    return;
  }
  
  try {
    loading.value = true;
    const response = await authAPI.verifyOTP({
      email: email.value,
      otp: otp.value,
    });
    
    // Store token and user
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    sessionStorage.removeItem('pendingEmail');
    
    // Navigate to dashboard
    router.push({ name: 'dashboard' });
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Invalid or expired code';
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  try {
    await authAPI.requestOTP(email.value);
    error.value = '';
    alert('New code sent to your email');
  } catch (err: any) {
    error.value = 'Failed to resend code';
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Verify Your Email</h1>
        <p class="subtitle">Enter the 6-digit code sent to {{ email }}</p>
        
        <form @submit.prevent="handleVerify">
          <div class="form-group">
            <label>Verification Code</label>
            <input
              v-model="otp"
              type="text"
              placeholder="000000"
              maxlength="6"
              pattern="\d{6}"
              required
              class="otp-input"
            />
            <p class="help-text">Code expires in 2 minutes</p>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Verifying...' : 'Verify' }}
          </button>
        </form>
        
        <p class="auth-footer">
          Didn't receive the code? 
          <a href="#" @click.prevent="handleResend">Resend</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: white;
  padding: 48px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #666;
  margin: 0 0 32px 0;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.otp-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 32px;
  text-align: center;
  letter-spacing: 12px;
  font-family: 'Courier New', monospace;
  transition: border-color 0.3s;
}

.otp-input:focus {
  outline: none;
  border-color: #2c3e50;
}

.help-text {
  margin-top: 8px;
  font-size: 14px;
  color: #999;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #34495e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.auth-footer a {
  color: #2c3e50;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
