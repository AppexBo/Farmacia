from odoo import models, fields, api

import logging
_logger = logging.getLogger(__name__)

class PosOrderLine(models.Model):
    """Get details from pos order"""
    _inherit = 'pos.order.line'

    # Campos calculados que vamos a mostrar en la vista
    sucursal_rep = fields.Char(string='Sucursal', compute='_compute_order_values', store=False)
    order_rep = fields.Char(string='Ref de Order', compute='_compute_order_values', store=False)
    numero_de_orden_rep = fields.Char(string='Numero de orden', compute='_compute_order_values', store=False)
    numero_de_factura_rep = fields.Char(string='Numero de factura', compute='_compute_order_values', store=False)
    creado_en_rep = fields.Char(string='Creado en', compute='_compute_order_values', store=False)
    categoria_producto_rep = fields.Char(string='Categoria del Producto', compute='_compute_order_values', store=False)
    unidad_de_medida_rep = fields.Char(string='Unidad de Medida', compute='_compute_order_values', store=False)
    reference = fields.Char(string='Referencia interna', compute='_compute_order_values',store=False)
    producto_rep = fields.Char(string='Producto', compute='_compute_order_values', store=False)
    cantidad_rep = fields.Char(string='Cantidad', compute='_compute_order_values', store=False)
    precio_unitario_rep = fields.Float(string='Precio Unitario', compute='_compute_order_values', store=False)
     #Nuevo
    subtotal_sin_tax = fields.Float(string='Subtotal', compute='_compute_order_values', store=False)
    tax = fields.Float(string='Tax', compute='_compute_order_values', store=False)
    total = fields.Float(string='Total', compute='_compute_order_values', store=False)
    cajero = fields.Char(string='Cajero',compute='_compute_order_values', store=False)
    metodo_pago = fields.Char(string='Metodo de Pago',compute='_compute_order_values', store=False)
    status = fields.Selection( selection=[ 
            ('not_paid', 'Sin pagar'),
            ('in_payment', 'En proceso de pago'),
            ('paid', 'Pagado'),
            ('partial', 'Pagado parcialmente'),
            ('reversed', 'Revertido'),
            ('invoicing_legacy', 'Sistema anterior de facturación'),
            ('unknown', 'Desconocido')  # Valor por defecto
    ],
    string='Estado',
    compute='_compute_order_values',
    store=False
    )


    @api.depends('qty', 'product_id', 'price_unit', 'tax_ids')  # Dependencias para recalcular cuando cambian ciertos valores
    def _compute_order_values(self):
        for line in self:
            # Aquí calculamos los valores de los campos a, b, c y v
            line.sucursal_rep = line.order_id.config_id.name
            line.order_rep = line.order_id.name
            line.numero_de_orden_rep = line.order_id.tracking_number
            line.numero_de_factura_rep = line.order_id.account_move.name
            line.creado_en_rep = line.create_date
            line.categoria_producto_rep = line.product_id.categ_id.name
            line.unidad_de_medida_rep = line.product_id.uom_id.name
            line.producto_rep = line.product_id.name
            line.cantidad_rep = line.qty
            line.reference= line.product_id.code
            line.precio_unitario_rep = line.price_unit
            #Nuevo
            line.subtotal_sin_tax = line.price_subtotal
            line.tax = line.order_id.amount_tax
            line.total = line.price_subtotal_incl
            line.cajero = line.order_id.cashier
            line.metodo_pago = ', '.join(line.order_id.payment_ids.mapped('payment_method_id.name'))
            line.status = line.order_id.account_move.payment_state
            
    @api.model
    def _search(self, args, offset=0, limit=None, order=None, count=False, access_rights_uid=None):
        # Si hay un término de búsqueda en el contexto (buscador por defecto)
        search_term = self._context.get('search_default_search')
        if search_term:
            # Buscar en campos computados
            domain = []
            # Lista de campos computados donde quieres buscar
            computed_fields = [
                'sucursal_rep', 'order_rep', 'numero_de_orden_rep', 
                'numero_de_factura_rep', 'creado_en_rep', 'categoria_producto_rep',
                'unidad_de_medida_rep', 'reference', 'producto_rep', 'cantidad_rep',
                'precio_unitario_rep', 'subtotal_sin_tax', 'tax', 'total', 
                'cajero', 'metodo_pago', 'status'
            ]
            # Construir el dominio de búsqueda
            for field in computed_fields:
                domain.append((field, 'ilike', search_term))
            # Combinar con los filtros existentes (args)
            args = args + ['|'] * (len(computed_fields) - 1) + domain
        return super(PosOrderLine, self)._search(args, offset, limit, order, count, access_rights_uid)