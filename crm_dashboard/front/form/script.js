document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const fields = ['nombre', 'email', 'mensaje'];

  // Validación simple y accesible
  function validateField(field) {
    const input = form[field];
    const errorMsg = input.nextElementSibling;
    let valid = true;

    if (!input.value.trim()) {
      errorMsg.textContent = 'Este campo es obligatorio';
      input.classList.add('error');
      valid = false;
    } else {
      if (field === 'email') {
        // Validación básica email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(input.value.trim())) {
          errorMsg.textContent = 'Correo no válido';
          input.classList.add('error');
          valid = false;
        } else {
          errorMsg.textContent = '';
          input.classList.remove('error');
        }
      } else if (field === 'mensaje' && input.value.trim().length < 10) {
        errorMsg.textContent = 'Mensaje muy corto (mínimo 10 caracteres)';
        input.classList.add('error');
        valid = false;
      } else if (field === 'nombre' && input.value.trim().length < 2) {
        errorMsg.textContent = 'Nombre muy corto (mínimo 2 caracteres)';
        input.classList.add('error');
        valid = false;
      } else {
        errorMsg.textContent = '';
        input.classList.remove('error');
      }
    }
    return valid;
  }

  fields.forEach(field => {
    form[field].addEventListener('input', () => validateField(field));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formValid = true;
    fields.forEach(field => {
      if (!validateField(field)) formValid = false;
    });

    if (!formValid) {
      formStatus.textContent = 'Por favor corrige los errores antes de enviar.';
      formStatus.style.color = '#dc2626'; // rojo
      return;
    }

    const payload = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      mensaje: form.mensaje.value.trim()
    };

    try {
      const response = await fetch('http://localhost:5678/webhook-test/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      formStatus.textContent = '✅ Mensaje enviado con éxito. Gracias por contactarnos.';
      formStatus.style.color = '#16a34a'; // verde
      form.reset();
    } catch (error) {
      console.error(error);
      formStatus.textContent = '❌ No se pudo enviar el mensaje. Intenta más tarde.';
      formStatus.style.color = '#dc2626'; // rojo
    }
  });
});