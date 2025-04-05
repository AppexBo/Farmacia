/** @odoo-module **/  

import { PartnerListScreen } from "@point_of_sale/app/screens/partner_list/partner_list";
import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/store/pos_hook";

patch(PartnerListScreen.prototype, {
    setup() {
        super.setup(); // Importante para mantener el comportamiento original
        this.pos = usePos(); // Obtiene la instancia actual del POS
        console.log("[DEBUG] PartnerListScreen patched!");
    },

    get partners() {
        console.log("[DEBUG] partners() - query:", this.state.query || "(vacía)");
        const result = super.partners; // Llama al método original
        console.log("[DEBUG] partners result:", result);
        return result;
    },
});