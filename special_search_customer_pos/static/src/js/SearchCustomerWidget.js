import { PartnerListScreen } from "@point_of_sale/app/screens/partner_list/partner_list_screen";
import { patch } from "@web/core/utils/patch";

patch(PartnerListScreen.prototype, {
    /*
        * Sobreescribe la función de búsqueda por defecto
        * @param {String} query Término de búsqueda
        * @returns {Array} Lista de clientes filtrados
    */
    searchPartner(query) {
        console.log("aaaa");
        // Obtiene la lista completa de clientes
        const partners = this.env.services.pos.db.get_partners_sorted();
        
        if (!query || query.trim() === '') {
            return partners;
        }
        
        query = query.toLowerCase().trim();
        
        // Implementación personalizada de búsqueda
        return partners.filter(partner => {
            // Buscar en nombre, referencia, teléfono, email, etc.
            return (
                (partner.name && partner.name.toLowerCase().includes(query)) ||
                (partner.ref && partner.ref.toLowerCase().includes(query)) ||
                (partner.phone && partner.phone.toLowerCase().includes(query)) ||
                (partner.mobile && partner.mobile.toLowerCase().includes(query)) ||
                (partner.email && partner.email.toLowerCase().includes(query)) ||
                (partner.vat && partner.vat.toLowerCase().includes(query))
            );
        });
    },
    
    /**
     * Opcional: También puedes modificar cómo se muestra cada elemento
     */
    get partnerLineComponents() {
        // Implementación personalizada si necesitas cambiar cómo se muestran los clientes
        return super.partnerLineComponents;
    }
});


/*
const searchContainer = document.querySelector('.pos-search-bar');
const searchInput = searchContainer.querySelector('input');
const clearIcon = searchContainer.querySelector('.fa-times');

// Crear el contenedor de sugerencias
const suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'search-suggestions';
suggestionsContainer.style.cssText = `
position: absolute;
top: 100%;
left: 0;
width: 100%;
background: white;
border: 1px solid #ddd;
border-top: none;
border-radius: 0 0 4px 4px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
z-index: 1000;
display: none;
max-height: 200px;
overflow-y: auto;
`;

searchContainer.style.position = 'relative';
searchContainer.appendChild(suggestionsContainer);

// Función para mostrar sugerencias
function showSuggestions(text) {
if (!text.trim()) {
    suggestionsContainer.style.display = 'none';
    return;
}

suggestionsContainer.innerHTML = '';

// Crear las tres opciones de búsqueda
const searchOptions = [
    { label: 'Buscar por nombre', field: 'nombre' },
    { label: 'Buscar por RUC', field: 'ruc' },
    { label: 'Buscar en todos los campos', field: 'all' }
];

searchOptions.forEach(option => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.dataset.field = option.field;
    suggestionItem.textContent = `${option.label}: ${text}`;
    suggestionItem.style.cssText = `
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f0f0f0;
    `;
    
    // Efecto hover
    suggestionItem.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#f5f5f5';
    });
    
    suggestionItem.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
    });
    
    // Acción al hacer clic
    suggestionItem.addEventListener('click', function() {
    const searchType = this.dataset.field;
    let searchQuery = text;
    
    // Aquí puedes modificar la búsqueda según el tipo seleccionado
    // Por ejemplo, podrías añadir prefijos para la API de búsqueda
    if (searchType === 'nombre') {
        searchQuery = `nombre:${text}`;
    } else if (searchType === 'ruc') {
        searchQuery = `ruc:${text}`;
    }
    // Para 'all' no modificamos el query
    
    searchInput.value = searchQuery;
    suggestionsContainer.style.display = 'none';
    
    // Aquí puedes disparar la búsqueda real
    performSearch(searchType, text);
    });
    
    suggestionsContainer.appendChild(suggestionItem);
});

suggestionsContainer.style.display = 'block';
}

// Función para realizar la búsqueda (debes implementarla según tu backend)
function performSearch(type, term) {
console.log(`Realizando búsqueda por ${type} con término: ${term}`);
// Aquí implementarías la lógica de búsqueda real
// Puede ser una llamada AJAX, filtrar datos locales, etc.
}

// Event listeners
searchInput.addEventListener('input', function() {
showSuggestions(this.value);
});

// Ocultar sugerencias al hacer clic en el icono de limpiar
clearIcon.addEventListener('click', function() {
suggestionsContainer.style.display = 'none';
});

// Ocultar sugerencias al hacer clic fuera
document.addEventListener('click', function(e) {
if (!searchContainer.contains(e.target)) {
    suggestionsContainer.style.display = 'none';
}
});

*/