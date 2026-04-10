// ---------------------------------------------
// DEKK GOLD MINER – REGISTRATION FORM SCRIPT
// Includes validation, password toggle, and payment step
// ---------------------------------------------

(function() {
  'use strict';

  // Get DOM elements
  const form = document.getElementById('registrationForm');
  const paymentContainer = document.getElementById('payment-container');
  const globalMsg = document.getElementById('global-message');

  // Input fields
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const userName = document.getElementById('userName');
  const countryCode = document.getElementById('countryCode');
  const mobile = document.getElementById('mobile');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const country = document.getElementById('country');
  const terms = document.getElementById('terms');

  // Error spans
  const firstNameErr = document.getElementById('firstNameError');
  const lastNameErr = document.getElementById('lastNameError');
  const userNameErr = document.getElementById('userNameError');
  const mobileErr = document.getElementById('mobileError');
  const emailErr = document.getElementById('emailError');
  const passwordErr = document.getElementById('passwordError');
  const confirmErr = document.getElementById('confirmPasswordError');
  const countryErr = document.getElementById('countryError');
  const termsErr = document.getElementById('termsError');

  // ---------- PASSWORD TOGGLE (show/hide) ----------
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
      }
    });
  });

  // ---------- HELPER: Show error ----------
  function setError(element, message) {
    if (element) element.textContent = message;
  }

  // Clear all errors
  function clearErrors() {
    setError(firstNameErr, '');
    setError(lastNameErr, '');
    setError(userNameErr, '');
    setError(mobileErr, '');
    setError(emailErr, '');
    setError(passwordErr, '');
    setError(confirmErr, '');
    setError(countryErr, '');
    setError(termsErr, '');
    globalMsg.style.display = 'none';
    globalMsg.textContent = '';
  }

  // ---------- VALIDATION RULES ----------
  function validateForm() {
    let isValid = true;
    clearErrors();

    // First Name
    const fname = firstName.value.trim();
    if (!fname) {
      setError(firstNameErr, 'First name is required');
      isValid = false;
    } else if (fname.length < 2) {
      setError(firstNameErr, 'At least 2 characters');
      isValid = false;
    }

    // Last Name
    const lname = lastName.value.trim();
    if (!lname) {
      setError(lastNameErr, 'Last name is required');
      isValid = false;
    } else if (lname.length < 2) {
      setError(lastNameErr, 'At least 2 characters');
      isValid = false;
    }

    // Username
    const uname = userName.value.trim();
    if (!uname) {
      setError(userNameErr, 'Username is required');
      isValid = false;
    } else if (uname.length < 4) {
      setError(userNameErr, 'At least 4 characters');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(uname)) {
      setError(userNameErr, 'Only letters, numbers, underscore');
      isValid = false;
    }

    // Mobile number
    const mobileRaw = mobile.value.trim();
    const mobileDigits = mobileRaw.replace(/\D/g, '');
    if (!mobileRaw) {
      setError(mobileErr, 'Mobile number is required');
      isValid = false;
    } else if (mobileDigits.length < 9 || mobileDigits.length > 12) {
      setError(mobileErr, 'Enter a valid mobile number (9-12 digits)');
      isValid = false;
    }

    // Email
    const emailVal = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setError(emailErr, 'Email is required');
      isValid = false;
    } else if (!emailPattern.test(emailVal)) {
      setError(emailErr, 'Enter a valid email address');
      isValid = false;
    }

    // Password strength
    const pwd = password.value;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pwd) {
      setError(passwordErr, 'Password is required');
      isValid = false;
    } else if (!strongRegex.test(pwd)) {
      setError(passwordErr, 'Must be 8+ chars, include uppercase, number & special');
      isValid = false;
    }

    // Confirm password
    const confirmPwd = confirmPassword.value;
    if (pwd && confirmPwd !== pwd) {
      setError(confirmErr, 'Passwords do not match');
      isValid = false;
    } else if (!confirmPwd && pwd) {
      setError(confirmErr, 'Please confirm your password');
      isValid = false;
    }

    // Country
    if (!country.value) {
      setError(countryErr, 'Please select a country');
      isValid = false;
    }

    // Terms
    if (!terms.checked) {
      setError(termsErr, 'You must agree to the Terms and Conditions');
      isValid = false;
    }

    return isValid;
  }

  // ---------- SUBMIT HANDLER ----------
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
      globalMsg.textContent = 'Please fix the errors above.';
      globalMsg.style.display = 'block';
      return;
    }

    // If validation passes, show success & hide form, show payment container
    globalMsg.style.display = 'none';
    
    // Hide the form
    form.style.display = 'none';
    // Show payment container
    paymentContainer.style.display = 'block';
    
    // Optional: you could scroll to the payment container
    paymentContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // In a real app you'd also send data to server; here we just simulate registration.
    console.log('Registration data ready for submission:', {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      username: userName.value.trim(),
      mobile: `${countryCode.value} ${mobile.value.trim()}`,
      email: email.value.trim(),
      country: country.value,
    });
  });

  // Live validation on blur for better UX (optional but clean)
  firstName.addEventListener('blur', () => {
    const val = firstName.value.trim();
    if (!val) setError(firstNameErr, 'First name required');
    else if (val.length < 2) setError(firstNameErr, 'Min 2 characters');
    else setError(firstNameErr, '');
  });
  lastName.addEventListener('blur', () => {
    const val = lastName.value.trim();
    if (!val) setError(lastNameErr, 'Last name required');
    else if (val.length < 2) setError(lastNameErr, 'Min 2 characters');
    else setError(lastNameErr, '');
  });
  userName.addEventListener('blur', () => {
    const val = userName.value.trim();
    if (!val) setError(userNameErr, 'Username required');
    else if (val.length < 4) setError(userNameErr, 'At least 4 chars');
    else if (!/^[a-zA-Z0-9_]+$/.test(val)) setError(userNameErr, 'Only letters, numbers, _');
    else setError(userNameErr, '');
  });
  email.addEventListener('blur', () => {
    const val = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) setError(emailErr, 'Email required');
    else if (!emailPattern.test(val)) setError(emailErr, 'Invalid email');
    else setError(emailErr, '');
  });
  password.addEventListener('input', () => {
    const pwd = password.value;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(pwd) && pwd.length > 0) {
      setError(passwordErr, 'Weak password (see hint)');
    } else {
      setError(passwordErr, '');
    }
    // Also revalidate confirm if not empty
    if (confirmPassword.value) {
      if (confirmPassword.value !== pwd) setError(confirmErr, 'Passwords do not match');
      else setError(confirmErr, '');
    }
  });
  confirmPassword.addEventListener('input', () => {
    if (confirmPassword.value !== password.value) {
      setError(confirmErr, 'Passwords do not match');
    } else {
      setError(confirmErr, '');
    }
  });

  // Clear global message on input
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      if (globalMsg.style.display === 'block') {
        globalMsg.style.display = 'none';
      }
    });
  });
  terms.addEventListener('change', () => {
    if (terms.checked) setError(termsErr, '');
  });

})();
