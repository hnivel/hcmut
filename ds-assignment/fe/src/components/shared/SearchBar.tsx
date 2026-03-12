import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'
        size={20}
      />
      <input
        type='text'
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className='w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-md focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none'
      />
      {query && (
        <button
          onClick={handleClear}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
