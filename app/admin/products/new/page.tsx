import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='font-display text-4xl text-cream'>New Product</h1>
        <p className='text-mist text-sm mt-1'>Add a new item to the store catalogue.</p>
      </div>
      <ProductForm />
    </div>
  );
}
