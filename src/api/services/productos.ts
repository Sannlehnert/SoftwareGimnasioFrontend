import api from '../axios';

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  categoria?: string;
  createdAt: string;
}

export interface CreateProductoData {
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo?: number;
  categoria?: string;
}

export const productosService = {
  getProductos: async (params?: { search?: string; categoria?: string; activo?: boolean }) => {
    const { data } = await api.get('/productos', { params });
    return data;
  },

  getProducto: async (id: number) => {
    const { data } = await api.get(`/productos/${id}`);
    return data;
  },

  createProducto: async (productoData: CreateProductoData) => {
    const { data } = await api.post('/productos', productoData);
    return data;
  },

  updateProducto: async (id: number, productoData: Partial<CreateProductoData>) => {
    const { data } = await api.put(`/productos/${id}`, productoData);
    return data;
  },

  venderProducto: async (productoId: number, data: { alumnoId: number; cantidad: number }) => {
    const response = await api.post(`/productos/${productoId}/venta`, data);
    return response.data;
  },

  getAlumnosForVenta: async () => {
    const { data } = await api.get('/productos/alumnos-for-ventas');
    return data;
  },

  getCategorias: async () => {
    const { data } = await api.get('/productos/categorias');
    return data;
  },
};