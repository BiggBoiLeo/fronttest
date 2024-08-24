const backendDir = 'https://api.rothbardbitcoin.com';

//trezor manifest
TrezorConnect.manifest({
    email: 'rothbardhelp@gmail.com',
    appUrl: 'https://test.rothbardbitcoin.com'
});


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
            .then(data =>{
                console.log('Successfully logged in:', data),
                window.location.href = 'index.html'
            })
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
            <a href="#footer">Contact</a>
            <a href="vault.html">My Vault</a>
            <a href="settings.html">Settings</a>
            <a href="login.html" id="signOut">Sign Out</a>
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
            settings(data.loggedIn);
        })
        .catch(error => {
            console.error('Error fetching user status:', error);
            // Optionally handle errors or fallback
            loadNavbar(false);
            settings(false);
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

    function settings(loggedIn){
        const settingsPage = document.getElementById('settings');
        if (settingsPage) {
            const container = document.getElementById('setContainer');
            const email = document.getElementById('theirEmail');
            const firstName = document.getElementById('theirFirst');
            const lastName = document.getElementById('theirLast');
            const DOB = document.getElementById('theirDOB');

            if(loggedIn){
                let noSave=0;

                fetch(`${backendDir}/api/profile`, {
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(data =>{
                    email.innerText = data.email;
                    if(data.first){
                        firstName.innerText = data.first;
                        document.getElementById('enterFirst').style.display = 'none';
                        noSave++;
                    } else {
                        choseProfileAttribute(firstName, document.getElementById('enterFirst') );
                    }
                    if(data.last){
                        lastName.innerText = data.last;
                        document.getElementById('enterLast').style.display = 'none';
                        noSave++;
                    } else {
                        choseProfileAttribute(lastName, document.getElementById('enterLast') );
                    }
                    if(data.DOB){
                        DOB.innerText = data.DOB;
                        document.getElementById('enterDOB').style.display = 'none';
                        noSave++;
                    } else {
                        choseProfileAttribute(DOB, document.getElementById('enterDOB') );
                    }
                    if(noSave == 3){
                        document.getElementById('saveInfo').style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error);
                });
            } else {
                container.innerHTML = `
                <h3 style="color: white;">Can not load information when logged out</h3>
            `;
            }
        }
    }

    function choseProfileAttribute(theirInfo, inputBox){
        theirInfo.style.display = 'none';
        inputBox.style.display = 'inline';
    }

    const walletform = document.getElementById('wallet-form');

    if(walletform){
        const selectMethod1 = document.getElementById('selectMethod1');
        const xpubText1 = document.getElementById('xpub-text1');
        const xpubButton1 = document.getElementById('xpub-button1');
        const fingerprintElement1 = document.getElementById('fingerprint1');
        const xpubElement1 = document.getElementById('xpub1');
        const walletInfo1 = document.getElementById('wallet-info1');

        selectMethod1.addEventListener('change', function() {
            if (this.value === 'Trezor') {
                xpubText1.style.display = 'none';
                xpubButton1.textContent = 'Connect Trezor';
            } else {
                xpubText1.style.display = 'block';
                xpubButton1.textContent = 'Import xPub';
            }
        });

        xpubButton1.addEventListener('click', function(event) {
            event.preventDefault();
            getxPubandFinger(selectMethod1, xpubElement1, fingerprintElement1, walletInfo1, xpubText1);
        });

        function getxPubandFinger(selectMethod, xpubElement, fingerprintElement, walletInfo, xpubText){
            if (selectMethod.value === 'Trezor') {
                TrezorConnect.getPublicKey({
                    path: "m/48'/0'/0'/2'",
                    coin: "Bitcoin",
                }).then(function(result) {
                    if (result.success) {
                        const { xpub, fingerprint } = result.payload;
                        xpubElement.textContent = 'p2wsh xPub: ' + xpub;
                        fingerprintElement.textContent = 'Fingerprint' + fingerprint;
                        walletInfo.style.display = 'block';
                    } else {
                        alert('Failed to get specific xpub: ' + result.payload.error);
                    }
                }).catch(function(error) {
                    alert('Error connecting to Trezor: ' + error.message);
                });
            } else {
                // Handle the "From Text" method
                const xpub = xpubText.value;
                xpubElement.textContent = 'Imported xPub: ' + xpub;
                fetch(`${backendDir}/api/getFingerprint`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ xpub })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('got data');
                        const fingerprint = data.fingerprint;
                        fingerprintElement.textContent = 'Derived Fingerprint' + fingerprint;
                    } else {
                        alert('Derivation: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while trying to derive fingerprint');
                });
            
            }
        }
    }
});

function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }
}

function setProfileAttribute(){
    let enterFirst = document.getElementById('enterFirst').value;
    let enterLast = document.getElementById('enterLast').value;
    let enterDOB = document.getElementById('enterDOB').value;
    
    console.log('sending to server');
    fetch(`${backendDir}/api/updateProfile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ enterFirst, enterLast, enterDOB })
    })
    .then(response => response.json())
    .then(data =>{
        console.log('Successfully updated Profile:', data);
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });

    
}


