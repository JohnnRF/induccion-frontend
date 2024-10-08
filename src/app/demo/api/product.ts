interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: InventoryStatus;
    category?: string;
    image?: string;
    rating?: number;
}

export interface ProductResponseApi {
    totalRecords?: number;
    totalPages?:   number;
    currentPage?:  number;
    pageSize?:     number;
    items?:     ProductApi[];
}

export interface ProductApi{
    productId?:    number,
    name?:         string,
    price?:        number,
    stock?:        number,
    active?:       boolean,
    fechaIngreso?: Date,
    bodegaId?:     number
    bodega?:       Bodega
}

export interface Bodega{
    bodegaId?:   number,
    name?:        string,
    description?: string
}