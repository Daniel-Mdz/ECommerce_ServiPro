document.addEventListener('DOMContentLoaded', () => {
    const registerFormStep1 = document.getElementById('registerFormStep1');
    const registerFormStep2 = document.getElementById('registerFormStep2');
    const nextStepButton = document.getElementById('nextStep');
    const loginForm = document.getElementById('loginForm');

    // Función para alternar la visibilidad de las contraseñas
    function togglePasswordVisibility(icon) {
        const targetInput = document.querySelector(icon.dataset.target);
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            targetInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Añadir eventos de clic a los iconos de mostrar/ocultar contraseñas
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => togglePasswordVisibility(icon));
    });

    if (nextStepButton) {
        nextStepButton.addEventListener('click', async function() {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const usernameRegex = /^[a-zA-Z0-9]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            let valid = true;

            // Validación de contraseñas coincidentes
            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden');
                valid = false;
            }

            // Validación del nombre de usuario y contraseña
            if (!usernameRegex.test(username)) {
                showNotification('El nombre de usuario solo puede contener letras y números');
                valid = false;
            }
            if (!passwordRegex.test(password)) {
                showNotification('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial');
                valid = false;
            }

            if (valid) {
                try {
                    const response = await fetch('/api/check_username', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username }) // Enviar el nombre de usuario dentro de un objeto JSON
                    });
                
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                
                        if (data.exists) {
                            showNotification('El nombre de usuario ya está en uso');
                        } else {
                            // Ocultar el primer formulario y mostrar el segundo
                            registerFormStep1.style.display = 'none';
                            registerFormStep2.style.display = 'block';
                
                            // Guardar los datos del primer formulario en el localStorage
                            localStorage.setItem('registerStep1Data', JSON.stringify({ username, email, password }));
                        }
                    } else {
                        console.error("Error en el registro", response.statusText);
                    }
                } catch (error) {
                    console.error('Error al verificar el nombre de usuario:', error);
                    showNotification('Error al verificar el nombre de usuario');
                }                
            }
        });
    }

    if (registerFormStep2) {
        registerFormStep2.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita el envío del formulario

            // Recuperar los datos del primer formulario del localStorage
            const step1Data = JSON.parse(localStorage.getItem('registerStep1Data'));

            // Obtener los datos del segundo formulario
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const dni = document.getElementById('dni').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const city = document.getElementById('city').value;
            const region = document.getElementById('region').value;
            const postalCode = document.getElementById('postalCode').value;
            const country = document.getElementById('country').value;
            const address = document.getElementById('address').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const gender = document.getElementById('gender').value;

            // Combinar todos los datos
            const combinedData = {
                ...step1Data,
                firstName,
                lastName,
                dni,
                phoneNumber,
                city,
                region,
                postalCode,
                country,
                address,
                dateOfBirth,
                gender
            };

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(combinedData)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    // Limpia el localStorage y redirige o muestra un mensaje de éxito
                    localStorage.removeItem('registerStep1Data');
                    showNotification('Registro exitoso');
                    window.location.href = '/login'; // Cambia '/login' por la ruta deseada
                } else {
                    console.error("Error en el registro", response.statusText);
                }
            } catch (error) {
                console.error('Error en el registro:', error);
                showNotification('Error en el registro');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita el envío del formulario
    
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
    
            if (username === '' || password === '') {
                showNotification('Por favor, complete todos los campos');
                return;
            }
    
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
            
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data); 
                    if (data.success) {
                        // window.location.href = '/'; // Redirige al dashboard o a la página deseada
                        showNotification('Inicio sesión con éxito', username);
                        // const user = {
                        //     name: "Juan Pérez", // Ejemplo de nombre
                        //     profilePictureUrl: null // Ejemplo de foto de perfil, null si no tiene
                        // };
                    
                        // const userNameElement = document.getElementById('user-name');
                        // const userAvatarElement = document.getElementById('user-avatar');
                    
                        // // Actualiza el nombre del usuario
                        // userNameElement.textContent = user.name || "Anónimo";
                    
                        // // Si no hay foto de perfil, usa la imagen predeterminada
                        // userAvatarElement.src = user.profilePictureUrl || '/img/user.png';
                        // userAvatarElement.alt = user.name ? `${user.name}'s Avatar` : "User Avatar";
                    } else {
                        showNotification('Credenciales incorrectas. Por favor, intente nuevamente.');
                    }
                } else {
                    console.error("Error en la autenticación", response.statusText);
                }
            } catch (error) {
                console.error('Error en la autenticación:', error);
                showNotification('Hubo un problema con el inicio de sesión. Por favor, intente nuevamente.');
            }
        });
    }
});
