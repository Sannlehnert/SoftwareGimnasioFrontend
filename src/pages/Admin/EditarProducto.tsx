import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { productosService } from '../../api/services/productos';

const EditarProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [productoData, setProductoData] = useState({
    nombre: '',
    precioCompra: '',
    precioVenta: '',
    stock: '',
    activo: true,
  });

  // Query para obtener el producto
  const { data: producto, isLoading } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => productosService.getProducto(parseInt(id || '0')),
    enabled: !!id,
  });

  useEffect(() => {
    if (producto) {
      setProductoData({
        nombre: producto.nombre || '',
        precioCompra: producto.precioCompra?.toString() || '',
        precioVenta: producto.precioVenta?.toString() || '',
        stock: producto.stock?.toString() || '',
        activo: producto.activo ?? true,
      });
    }
  }, [producto]);

  const updateProductoMutation = useMutation({
    mutationFn: (data: any) => productosService.updateProducto(parseInt(id || '0'), data),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Producto actualizado',
        message: 'Los cambios han sido guardados correctamente'
      });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      navigate('/productos');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar el producto'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoData.nombre || !productoData.precioCompra || !productoData.precioVenta) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Completa todos los campos obligatorios',
      });
      return;
    }

    updateProductoMutation.mutate({
      nombre: productoData.nombre,
      precioCompra: parseFloat(productoData.precioCompra),
      precioVenta: parseFloat(productoData.precioVenta),
      stock: parseInt(productoData.stock) || 0,
      activo: productoData.activo,
    });
  };

  const gananciaPorUnidad = () => {
    if (productoData.precioCompra && productoData.precioVenta) {
      return parseFloat(productoData.precioVenta) - parseFloat(productoData.precioCompra);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        <Button variant="secondary" onClick={() => navigate('/productos')}>
          Cancelar
        </Button>
      </div>

      {/* Información del producto */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Producto</label>
            <p className="mt-1 text-sm text-gray-900">#{producto.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado Actual</label>
            <p className="mt-1 text-sm text-gray-900">
              <span className={`px-2 py-1 text-xs rounded-full ${
                producto.activo ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
              }`}>
                {producto.activo ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Producto</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={productoData.nombre}
              onChange={(e) => setProductoData(prev => ({ ...prev, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Proteína Whey 1kg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Compra *
              </label>
              <input
                type="number"
                value={productoData.precioCompra}
                onChange={(e) => setProductoData(prev => ({ ...prev, precioCompra: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta *
              </label>
              <input
                type="number"
                value={productoData.precioVenta}
                onChange={(e) => setProductoData(prev => ({ ...prev, precioVenta: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {productoData.precioCompra && productoData.precioVenta && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Ganancia por unidad: <span className="font-semibold text-success">
                  ${gananciaPorUnidad().toLocaleString('es-AR')}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={productoData.stock}
                onChange={(e) => setProductoData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={productoData.activo.toString()}
                onChange={(e) => setProductoData(prev => ({ ...prev, activo: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/productos')}
              disabled={updateProductoMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateProductoMutation.isPending}
            >
              {updateProductoMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarProducto;
