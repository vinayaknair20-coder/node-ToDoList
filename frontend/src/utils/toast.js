// Simple toast notification using browser alert (for now)
export const showToast = {
  success: (message) => {
    console.log('✅', message);
    // You can replace this with a custom notification component
  },
  error: (message) => {
    console.log('❌', message);
  },
  loading: (message) => {
    console.log('⏳', message);
  }
};
