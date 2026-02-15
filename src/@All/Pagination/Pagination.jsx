const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-10 h-10 rounded-xl cursor-pointer font-bold transition-all ${
            currentPage === i + 1 
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
            : 'bg-white text-slate-400 hover:bg-slate-100'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;