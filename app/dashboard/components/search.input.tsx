"use client";

import { FiSearch, FiFilter } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { api } from "@/helpers/client.helper";
import { useSearchStore } from "@/stores/search.store";

export const Searching = () => {
  const { query, setQuery, specialization, setSpecialization } =
    useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/specializations");
        if (Array.isArray(res.data.data)) setSpecializations(res.data.data);
      } catch (err) {
        console.error("Failed to fetch specializations", err);
      }
    };
    fetchSpecializations();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setQuery(localQuery), 300);
    return () => clearTimeout(timeout);
  }, [localQuery, setQuery]);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex items-center rounded-lg bg-white px-3 py-2 w-52 md:w-72 shadow-sm">
        <FiSearch className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search doctor..."
          className="w-full bg-white outline-none text-gray-700 text-sm"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setFilterOpen((prev) => !prev)}
        className="bg-white rounded-lg p-2 hover:bg-gray-100 transition cursor-pointer"
      >
        <FiFilter size={18} />
      </button>

      {/* Specialization Filter */}
      {filterOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-60 z-50 p-3">
          <label className="text-sm font-medium mb-1 block">
            Filter by Specialization
          </label>
          <select
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
              setFilterOpen(false);
            }}
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
