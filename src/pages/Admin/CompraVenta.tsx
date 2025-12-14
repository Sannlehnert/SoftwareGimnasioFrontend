import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productosService } from '../../api/services/productos';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

const CompraVenta: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isCompraModalOpen, setIsCompraModalOpen] = useState(false);
  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [compraData, setCompraData] = useState({
    nombre: '',
    precioCompra: '',
    precioVenta: '',
    stock: '',
  });
  const [ventaData, setVentaData] = useState({
    cantidad: '1',
    alumnoId: '',
  });

  const { data: productos, isLoading } = useQuery(['productos'], () => productosService.getProductos());
  const { data: alumnos } = useQuery(['alumnos-for-ventas'], () => productosService.getAlumnosForVenta());

  const createProductoMutation = useMutation({
    mutationFn: productosService.createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsCompraModalOpen(false);
      setCompraData({ nombre: '', precioCompra: '', precioVenta: '', stock: '' });
      addToast({
        type: 'success',
        title: 'Producto comprado',
        message: 'El producto se ha agregado al inventario correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al comprar el producto',
      });
    },
  });

  const venderProductoMutation = useMutation({
    mutationFn: (data: { productoId: number; alumnoId: number; cantidad: number }) =>
      productosService.venderProducto(data.productoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsVentaModalOpen(false);
      setVentaData({ cantidad: '1', alumnoId: '' });
      setSelectedProduct(null);
      addToast({
        type: 'success',
        title: 'Venta registrada',
        message: 'La venta se ha registrado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al registrar la venta',
      });
    },
  });

  const columns = [
    { key: 'nombre', label: 'Producto' },
    { key: 'stock', label: 'Stock', render: (value: number, row: any) => (
      <span className={value <= 5 ? 'text-error font-semibold' : value <= 10 ? 'text-warning' : ''}>
        {value} {value <= 5 && '⚠️'}
      </span>
    )},
    { key: 'precioCompra', label: 'P. Compra', render: (value: number) => `$${value.toLocaleString('es-AR')}` },
    { key: 'precioVenta', label: 'P. Venta', render: (value: number) => `$${value.toLocaleString('es-AR')}` },
    { key: 'activo', label: 'Estado', render: (value: boolean) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
      }`}>
        {value ? 'Activo' : 'Inactivo'}
      </span>
    )},
  ];

  const handleCompraProducto = () => {
    if (!compraData.nombre || !compraData.precioCompra || !compraData.precioVenta) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Completa todos los campos obligatorios',
      });
      return;
    }

    createProductoMutation.mutate({
      nombre: compraData.nombre,
      precioCompra: parseFloat(compraData.precioCompra),
      precioVenta: parseFloat(compraData.precioVenta),
      stock: parseInt(compraData.stock) || 0,
    });
  };

  const handleVenderProducto = () => {
    if (!selectedProduct || !ventaData.alumnoId || !ventaData.cantidad) return;

    venderProductoMutation.mutate({
      productoId: selectedProduct.id,
      alumnoId: parseInt(ventaData.alumnoId),
      cantidad: parseInt(ventaData.cantidad),
    });
  };

  const gananciaPorUnidad = (producto: any) => {
    return producto.precioVenta - producto.precioCompra;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Compra y Venta de Productos</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCompraModalOpen(true)}>
            Nueva Compra
          </Button>
          <Button variant="secondary" onClick={() => setIsVentaModalOpen(true)}>
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Productos</p>
          <p className="text-2xl font-bold">{productos?.data?.length || 0}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
          <p className="text-2xl font-bold text-warning">
            {productos?.data?.filter((p: any) => p.stock <= 5).length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Sin Stock</p>
          <p className="text-2xl font-bold text-error">
            {productos?.data?.filter((p: any) => p.stock === 0).length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Productos Activos</p>
          <p className="text-2xl font-bold text-success">
            {productos?.data?.filter((p: any) => p.activo).length || 0}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={productos?.data || []}
        loading={isLoading}
        searchable={true}
        onSearch={(search) => console.log('Search:', search)}
        totalItems={productos?.total || 0}
        serverSidePagination={false}
        actions={(row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedProduct(row);
                setIsVentaModalOpen(true);
              }}
              disabled={row.stock === 0}
            >
              Vender
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/productos/${row.id}/editar`)}
            >
              Editar
            </Button>
          </div>
        )}
      />

      {/* Modal Nueva Compra */}
      <Modal
        isOpen={isCompraModalOpen}
        onClose={() => setIsCompraModalOpen(false)}
        title="Nueva Compra de Producto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={compraData.nombre}
              onChange={(e) => setCompraData(prev => ({ ...prev, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Proteína Whey 1kg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Compra *
              </label>
              <input
                type="number"
                value={compraData.precioCompra}
                onChange={(e) => setCompraData(prev => ({ ...prev, precioCompra: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta *
              </label>
              <input
                type="number"
                value={compraData.precioVenta}
                onChange={(e) => setCompraData(prev => ({ ...prev, precioVenta: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {compraData.precioCompra && compraData.precioVenta && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Ganancia por unidad: <span className="font-semibold text-success">
                  ${gananciaPorUnidad({
                    precioCompra: parseFloat(compraData.precioCompra),
                    precioVenta: parseFloat(compraData.precioVenta)
                  }).toLocaleString('es-AR')}
                </span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Inicial
            </label>
            <input
              type="number"
              value={compraData.stock}
              onChange={(e) => setCompraData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsCompraModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCompraProducto}
              isLoading={createProductoMutation.isPending}
              disabled={!compraData.nombre || !compraData.precioCompra || !compraData.precioVenta}
              className="flex-1"
            >
              Registrar Compra
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Nueva Venta */}
      <Modal
        isOpen={isVentaModalOpen}
        onClose={() => setIsVentaModalOpen(false)}
        title="Nueva Venta"
      >
        {selectedProduct ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">{selectedProduct.nombre}</h4>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-gray-600">Stock disponible:</span>
                  <p className="font-semibold">{selectedProduct.stock} unidades</p>
                </div>
                <div>
                  <span className="text-gray-600">Precio de venta:</span>
                  <p className="font-semibold">${selectedProduct.precioVenta.toLocaleString('es-AR')}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alumno *
              </label>
              <select
                value={ventaData.alumnoId}
                onChange={(e) => setVentaData(prev => ({ ...prev, alumnoId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccionar alumno</option>
                {alumnos?.map((alumno: any) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} - {alumno.dni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                value={ventaData.cantidad}
                onChange={(e) => setVentaData(prev => ({ ...prev, cantidad: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                max={selectedProduct.stock}
              />
              <p className="text-xs text-gray-500 mt-1">
                Máximo: {selectedProduct.stock} unidades
              </p>
            </div>

            {ventaData.cantidad && (
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-primary-800">
                  Total: ${(selectedProduct.precioVenta * parseInt(ventaData.cantidad)).toLocaleString('es-AR')}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsVentaModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleVenderProducto}
                isLoading={venderProductoMutation.isPending}
                disabled={!ventaData.alumnoId || !ventaData.cantidad || parseInt(ventaData.cantidad) > selectedProduct.stock}
                className="flex-1"
              >
                Registrar Venta
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Selecciona un producto de la tabla para vender</p>
            <Button onClick={() => setIsVentaModalOpen(false)}>
              Cerrar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompraVenta;
