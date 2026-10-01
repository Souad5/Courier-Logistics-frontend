"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import { AppInput } from "./form";

/** Debounced search box; `value` is the URL's current search term, `onSearch` writes it back. */
export function SearchInput({
  value,
  onSearch,
  placeholder,
  label,
}: {
  value: string;
  onSearch: (search: string) => void;
  placeholder: string;
  label: string;
}) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text);

  useEffect(() => {
    if (debounced !== value) onSearch(debounced);
  }, [debounced, value, onSearch]);

  return (
    <AppInput
      type="search"
      value={text}
      onChange={(event) => setText(event.target.value)}
      placeholder={placeholder}
      aria-label={label}
      leftIcon={<Search />}
      containerClassName="w-full sm:w-72 lg:w-64 2xl:w-72"
    />
  );
}
