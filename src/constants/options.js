import { FilterMatchMode } from 'primereact/api';
import {
    UsedChip,
    amountBody,
    ValuationType,
    InputTextEditor,
    InputAmountEditor,
    InputQuantityEditor,
} from '@components/templates';

export const valuation = [{ label: 'Promedio Ponderado', value: 'AVERAGE' }];
export const receptionTypes = [
    { label: 'Ingreso', value: 'INPUT' },
    { label: 'Devolucion por venta', value: 'SALE_RETURN' },
];

export const toolbar = [
    {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: null,
    },
    {
        label: 'Guardar',
        icon: 'pi pi-fw pi-save',
    },
    {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
    },
    {
        label: 'Acciones',
        items: [],
    },
];

export const detailsToolbar = [
    {
        label: 'Agregar',
        icon: 'pi pi-fw pi-plus',
        command: null,
    },
    {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: null,
    },
];

export const detailTableFields = [
    {
        field: 'description',
        header: 'Descripcion',
        editor: (options, updateField) => {
            const { field, rowData } = { ...options };
            return <InputTextEditor row={rowData} field={field} updateField={updateField} />;
        },
    },
    {
        field: 'quantity',
        header: 'Cantidad',
        editor: (options, updateField) => {
            const { field, rowData } = { ...options };
            return <InputQuantityEditor row={rowData} field={field} updateField={updateField} />;
        },
    },
    {
        field: 'unitPrice',
        header: 'Precio Unitario',
        editor: (options, updateField) => {
            const { field, rowData } = { ...options };
            return <InputAmountEditor row={rowData} field={field} updateField={updateField} />;
        },
        body: (row, field) => {
            return amountBody(row, field);
        },
    },
    { field: 'totalPrice', header: 'Precio Total' },
];

export const itemSearchFields = [
    {
        field: 'itemName',
        header: 'Articulo',
        filter: true,
    },
    {
        field: 'description',
        header: 'Descripcion',
        filter: false,
    },
    {
        field: 'valuationType',
        header: 'Metodo de Valuacion',
        template: (row) => <ValuationType value={row['valuationType']} />,
    },
];

export const itemFilters = {
    itemName: { value: '', matchMode: FilterMatchMode.CONTAINS },
};

export const warehouseSearchFields = [
    {
        field: 'warehouseName',
        header: 'Almacen',
        filter: true,
    },
    {
        field: 'used',
        header: 'Estado',
        template: (row) => <UsedChip value={row['used']} />,
    },
];

export const warehouseFilters = {
    warehouseName: { value: '', matchMode: FilterMatchMode.CONTAINS },
};

export const dropdownLabelOptions = {
    warehouse: 'warehouseName',
};
