const backendDir = 'https://api.rothbardbitcoin.com';

document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded');
    
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Handle subscription form
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            fetch(`${backendDir}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                    alert('An error occurred. Please try again.');
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }

    // Handle sign-up form
    const signUpForm = document.getElementById('signupForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('newEmail').value.trim();
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

            if (!email || !password) {
                alert('Please fill out all fields.');
                return;
            }
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!passwordRegex.test(password)) {
                alert('Password must be at least 8 characters long and contain at least one special character.');
                return;
            }
            if (password !== confirmPassword) {
                alert('The passwords you entered do not match.');
                return;
            }

            fetch(`${backendDir}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Sign-up successful! Please check your email to verify your account.');
                    window.location.replace("email-verified.html");
                } else {
                    alert('Sign-up failed: ' + (data.message || 'Error occurred'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during sign-up.');
            });
        });
    }

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            fetch(`${backendDir}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(
                window.location.href = 'index.html'
            )
            .catch(error => {
                console.error('Error:', error);
                alert(error);
            });
        });
    }

    function signOut(event){

        event.preventDefault();

        fetch(`${backendDir}/api/logout`, {
            credentials: 'include',
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    }

    // Function to load the appropriate navbar
    function loadNavbar(loggedIn) {
        const navbar = document.getElementById('navbar');
        if (loggedIn) {
            navbar.innerHTML = `
            <a href="index.html">Home</a>
            <a href="#footer">Contact</a>
            <a href="login.html">Settings</a>
            <a href="index.html" id="signOut">Sign Out</a>
            `;
            

            const signOutLink = document.getElementById('signOut');
            if (signOutLink) {
                signOutLink.addEventListener('click', signOut);
            }
        } else {
            navbar.innerHTML = `
                <a href="index.html">Home</a>
                <a href="#footer">Contact</a>
                <a href="signup.html">Sign Up</a>
                <a href="login.html">Log In</a>
            `;
        }
    }

    // Check the user’s status
    fetch(`${backendDir}/api/user-status`, {
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            loadNavbar(data.loggedIn);

        })
        .catch(error => {
            console.error('Error fetching user status:', error);
            // Optionally handle errors or fallback
            loadNavbar(false);
        });


    
    const resendVerifySection = document.getElementById('resendVerify');
    if (resendVerifySection) {
        resendVerifySection.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }


            fetch(`${backendDir}/api/resend-verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'email-verified.html'
                } else {
                    alert('Resend failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while trying to resend the verification email.');
            });
        });
    }

});

function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }
}
