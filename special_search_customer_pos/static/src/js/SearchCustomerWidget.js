import { PartnerListScreen } from "@point_of_sale/app/screens/partner_list/partner_list_screen";
const {PartnerLine} = require("@point_of_sale/app/screens/partner_list/partner_line/partner_line");
import { patch } from "@web/core/utils/patch";
import { Component, onMounted, useRef } from "@odoo/owl";

patch(PartnerListScreen.prototype, {
    get partners() {
        console.log("[Erick] partners - query:", this.state.query || "(vacía)"); // Único console.log añadido
        let res;
        if (this.state.query && this.state.query.trim() !== "") {
            res = this.pos.db.search_partner(this.state.query.trim());
        } else {
            res = this.pos.db.get_partners_sorted(1000);
        }
        res.sort(function(a, b) {
            return (a.name || "").localeCompare(b.name || "");
        });
        if (this.state.selectedPartner) {
            const indexOfSelectedPartner = res.findIndex( (partner) => partner.id === this.state.selectedPartner.id);
            if (indexOfSelectedPartner !== -1) {
                res.splice(indexOfSelectedPartner, 1);
            }
            res.unshift(this.state.selectedPartner);
        }
        return res;
    },

    _clearSearch() {
        console.log("[Erick] _clearSearch ejecutado"); // Único console.log añadido
        this.searchWordInputRef.el.value = "";
        this.state.query = "";
    },

    async searchPartner() {
        console.log("[Erick] searchPartner - query:", this.state.query); // Único console.log añadido
        if (this.state.previousQuery != this.state.query) {
            this.state.currentOffset = 0;
        }
        const result = await this.getNewPartners();
        this.pos.addPartners(result);
        if (this.state.previousQuery == this.state.query) {
            this.state.currentOffset += result.length;
        } else {
            this.state.previousQuery = this.state.query;
            this.state.currentOffset = result.length;
        }
        return result;
    },

    async getNewPartners() {
        console.log("[Erick] getNewPartners - query:", this.state.query); // Único console.log añadido
        let domain = [];
        const limit = 30;
        if (this.state.query) {
            const search_fields = ["name", "parent_name", "phone", "mobile", "email", "barcode", "street", "zip", "city", "state_id", "country_id", "vat", ];
            domain = [...Array(search_fields.length - 1).fill('|'), ...search_fields.map(field => [field, "ilike", this.state.query + "%"])];
        }
        const result = await this.orm.silent.call("pos.session", "get_pos_ui_res_partner_by_params", 
            [odoo.pos_session_id], {
            domain,
            limit: limit,
            offset: this.state.currentOffset
        });
        return result;
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