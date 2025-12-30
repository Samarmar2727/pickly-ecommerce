const CartItemSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 border rounded-xl animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
};

export default CartItemSkeleton;
