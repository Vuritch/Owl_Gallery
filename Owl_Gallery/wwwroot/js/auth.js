document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const authTabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const switchFormLinks = document.querySelectorAll(".switch-form")
  const passwordToggles = document.querySelectorAll(".password-toggle")
  const registerPassword = document.getElementById("registerPassword")
  const confirmPassword = document.getElementById("confirmPassword")
  const passwordStrength = document.getElementById("passwordStrength")
  const strengthText = document.getElementById("strengthText")
  const strengthSegments = document.querySelectorAll(".strength-segment")
  const lengthCheck = document.getElementById("length-check")
  const uppercaseCheck = document.getElementById("uppercase-check")
  const lowercaseCheck = document.getElementById("lowercase-check")
  const numberCheck = document.getElementById("number-check")
  const loginFormElement = loginForm ? loginForm.querySelector("form") : null
  const registerFormElement = registerForm ? registerForm.querySelector("form") : null

  // Tab switching
  authTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Update active tab
      authTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding form
      if (tabName === "login") {
        if (loginForm) loginForm.classList.remove("d-none")
        if (registerForm) registerForm.classList.add("d-none")
      } else {
        if (loginForm) loginForm.classList.add("d-none")
        if (registerForm) registerForm.classList.remove("d-none")
      }
    })
  })

  // Switch form links
  switchFormLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const formName = this.getAttribute("data-form")

      // Click the corresponding tab
      document.querySelector(`.auth-tab[data-tab="${formName}"]`).click()
    })
  })

  // Password toggle
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordField = this.closest(".password-field").querySelector("input")
      const icon = this.querySelector("i")

      if (passwordField.type === "password") {
        passwordField.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        passwordField.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Password strength checker
  if (registerPassword) {
    registerPassword.addEventListener("focus", () => {
      if (passwordStrength) passwordStrength.classList.remove("d-none")
    })

    registerPassword.addEventListener("input", function () {
      const password = this.value

      // Check requirements
      const hasLength = password.length >= 8
      const hasUppercase = /[A-Z]/.test(password)
      const hasLowercase = /[a-z]/.test(password)
      const hasNumber = /[0-9]/.test(password)

      // Update requirement checks
      updateRequirementCheck(lengthCheck, hasLength)
      updateRequirementCheck(uppercaseCheck, hasUppercase)
      updateRequirementCheck(lowercaseCheck, hasLowercase)
      updateRequirementCheck(numberCheck, hasNumber)

      // Calculate strength
      let strength = 0
      if (hasLength) strength++
      if (hasUppercase) strength++
      if (hasLowercase) strength++
      if (hasNumber) strength++

      // Update strength meter
      updateStrengthMeter(strength)

      // Validate confirm password if it has a value
      if (confirmPassword && confirmPassword.value) {
        validateConfirmPassword()
      }
    })
  }

  // Confirm password validation
  if (confirmPassword) {
    confirmPassword.addEventListener("input", validateConfirmPassword)
  }

  // Form validation
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("loginEmail")
      const password = document.getElementById("loginPassword")
      let isValid = true

      // Validate email
      if (!validateEmail(email.value)) {
        email.classList.add("is-invalid")
        isValid = false
      } else {
        email.classList.remove("is-invalid")
        email.classList.add("is-valid")
      }

      // Validate password
      if (!password.value) {
        password.classList.add("is-invalid")
        isValid = false
      } else {
        password.classList.remove("is-invalid")
        password.classList.add("is-valid")
      }

      if (isValid) {
        // In a real app, you would submit the form or make an API call here
        showToast("Login successful!")

        // Simulate redirect
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1500)
      }
    })
  }

  if (registerFormElement) {
    registerFormElement.addEventListener("submit", (e) => {
      e.preventDefault()

      const firstName = document.getElementById("firstName")
      const lastName = document.getElementById("lastName")
      const email = document.getElementById("registerEmail")
      const password = document.getElementById("registerPassword")
      const confirmPass = document.getElementById("confirmPassword")
      const agreeTerms = document.getElementById("agreeTerms")
      let isValid = true

      // Validate first name
      if (!firstName.value.trim()) {
        firstName.classList.add("is-invalid")
        isValid = false
      } else {
        firstName.classList.remove("is-invalid")
        firstName.classList.add("is-valid")
      }

      // Validate last name
      if (!lastName.value.trim()) {
        lastName.classList.add("is-invalid")
        isValid = false
      } else {
        lastName.classList.remove("is-invalid")
        lastName.classList.add("is-valid")
      }

      // Validate email
      if (!validateEmail(email.value)) {
        email.classList.add("is-invalid")
        isValid = false
      } else {
        email.classList.remove("is-invalid")
        email.classList.add("is-valid")
      }

      // Validate password
      if (password.value.length < 8) {
        password.classList.add("is-invalid")
        isValid = false
      } else {
        password.classList.remove("is-invalid")
        password.classList.add("is-valid")
      }

      // Validate confirm password
      if (password.value !== confirmPass.value) {
        confirmPass.classList.add("is-invalid")
        isValid = false
      } else {
        confirmPass.classList.remove("is-invalid")
        confirmPass.classList.add("is-valid")
      }

      // Validate terms agreement
      if (!agreeTerms.checked) {
        agreeTerms.classList.add("is-invalid")
        isValid = false
      } else {
        agreeTerms.classList.remove("is-invalid")
        agreeTerms.classList.add("is-valid")
      }

      if (isValid) {
        // In a real app, you would submit the form or make an API call here
        showToast("Registration successful!")

        // Simulate redirect
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1500)
      }
    })
  }

  // Helper functions
  function updateRequirementCheck(element, isValid) {
    if (!element) return

    const icon = element.querySelector("i")

    if (isValid) {
      icon.classList.remove("fa-times-circle")
      icon.classList.add("fa-check-circle")
    } else {
      icon.classList.remove("fa-check-circle")
      icon.classList.add("fa-times-circle")
    }
  }

  function updateStrengthMeter(strength) {
    if (!strengthText || !strengthSegments.length) return

    // Update text
    strengthText.className = ""
    switch (strength) {
      case 0:
      case 1:
        strengthText.textContent = "Weak"
        strengthText.classList.add("weak")
        break
      case 2:
        strengthText.textContent = "Fair"
        strengthText.classList.add("fair")
        break
      case 3:
        strengthText.textContent = "Good"
        strengthText.classList.add("good")
        break
      case 4:
        strengthText.textContent = "Strong"
        strengthText.classList.add("strong")
        break
    }

    // Update segments
    strengthSegments.forEach((segment, index) => {
      if (index < strength) {
        segment.classList.add("active")
      } else {
        segment.classList.remove("active")
      }
    })
  }

  function validateConfirmPassword() {
    if (!registerPassword || !confirmPassword) return

    if (registerPassword.value === confirmPassword.value) {
      confirmPassword.classList.remove("is-invalid")
      if (confirmPassword.value) {
        confirmPassword.classList.add("is-valid")
      }
    } else {
      confirmPassword.classList.add("is-invalid")
      confirmPassword.classList.remove("is-valid")
    }
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function showToast(message) {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector(".toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
      document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toastId = "toast-" + Date.now()
    const toastHTML = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Owl Gallery</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `

    toastContainer.innerHTML += toastHTML

    // Initialize and show toast
    const toastElement = document.getElementById(toastId)
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 })
    toast.show()

    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove()
    })
  }

  // Initialize bootstrap
  const bootstrap = window.bootstrap
})

