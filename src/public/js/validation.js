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
                    const response = await fetch(`/check-username?username=${encodeURIComponent(username)}`);
                    const data = await response.json();

                    if (data.exists) {
                        showNotification('El nombre de usuario ya está en uso');
                    } else {
                        registerFormStep1.style.display = 'none';
                        registerFormStep2.style.display = 'block';
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
    
            const formDataStep1 = new FormData(registerFormStep1);
            const formDataStep2 = new FormData(registerFormStep2);
    
            // Combina los datos de ambos formularios
            formDataStep2.forEach((value, key) => formDataStep1.append(key, value));
    
            // Log para verificar los datos que se están enviando
            for (let [key, value] of formDataStep1.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formDataStep1
                });
    
                const result = await response.json();
                if (response.ok) {
                    showNotification(result.message);
                    // Redirigir o mostrar mensaje de éxito
                } else {
                    showNotification(result.message);
                }
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
                showNotification('Error al registrar el usuario');
            }
        });
    }
    

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = document.getElementById('loginUsername').value; // Cambia a 'loginUsername' si ese es el ID en el HTML
            const password = document.getElementById('loginPassword').value; // Cambia a 'loginPassword' si ese es el ID en el HTML

            if (username === '' || password === '') {
                showNotification('Por favor, complete todos los campos');
                event.preventDefault(); // Previene el envío del formulario si algún campo está vacío
            }
        });
    }
});
