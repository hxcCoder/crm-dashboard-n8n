document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#crm-table tbody');

  fetch('http://localhost:5678/webhook-test/dashboard-data-get') // cambia si usas n8n cloud
    .then(response => {
      if (!response.ok) throw new Error('Respuesta no válida');
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Formato de datos inválido');

      tableBody.innerHTML = ''; // Limpia por si acaso

      data.forEach(entry => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${entry.nombre || '-'}</td>
          <td>${entry.email || '-'}</td>
          <td>${entry.mensaje || '-'}</td>
          <td>${new Date(entry.fecha).toLocaleString('es-CL')}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al cargar datos:', error);
      tableBody.innerHTML = `<tr><td colspan="4">Error al cargar los datos.</td></tr>`;
    });
});