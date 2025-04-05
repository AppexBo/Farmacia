odoo.define(
    '@pos_loyalty/overrides/components/partner_list_screen/partner_list_screen', 
    [
        '@point_of_sale/app/screens/partner_list/partner_list',
        '@web/core/utils/patch'
    ], 
    function(require) {
        "use strict";

        const { PartnerListScreen } = require("@point_of_sale/app/screens/partner_list/partner_list");
        const { patch } = require("@web/core/utils/patch");

        patch(PartnerListScreen.prototype, {
            get partners() {
                console.log("[DEBUG] partners - query:", this.state.query || "(vacía)"); // Log añadido
                
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
                    const indexOfSelectedPartner = res.findIndex(
                        (partner) => partner.id === this.state.selectedPartner.id
                    );
                    if (indexOfSelectedPartner !== -1) {
                        res.splice(indexOfSelectedPartner, 1);
                    }
                    res.unshift(this.state.selectedPartner);
                }

                return res;
            }
        });

        return {};
    }
);