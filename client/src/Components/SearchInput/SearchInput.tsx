import { useEffect, useState } from "react";

interface SearchInputProps {
  defaultValue: string | null;
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch, defaultValue }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="p-2 focus:outline-none active:ring-0 border rounded">
      <input
        type="text"
        value={value}
        placeholder="Search by product name..."
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
