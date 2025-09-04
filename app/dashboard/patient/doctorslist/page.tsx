"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Doctor } from "@/types/auth.type";
import { api } from "@/helpers/client.helper";
import DoctorCard from "../../components/doctor.card";
import { useSearchStore } from "@/stores/search.store";

export default function DoctorsListPage() {
  const { query, specialization } = useSearchStore(); // subscribe to search store
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Responsive limit
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setLimit(12);
      else setLimit(6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDoctors = async (
    page: number,
    limit: number,
    query?: string,
    specialization?: string
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (query) params.set("search", query);
    if (specialization) params.set("specialization", specialization);

    const { data } = await api.get(`/doctors?${params.toString()}`);
    return data; // { data: Doctor[], total: number }
  };

  const { data, isLoading, error, isFetching } = useQuery<{
    data: Doctor[];
    total: number;
  }>({
    queryKey: ["doctors", page, limit, query, specialization], // depends on store
    queryFn: () => fetchDoctors(page, limit!, query, specialization),
    enabled: limit !== null,
    staleTime: 2000,
  });

  if (!mounted || limit === null) return <p className="text-blue-600">Loading...</p>;
  if (isLoading) return <p className="text-blue-600 text-center">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load doctors</p>;

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="p-4">
      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.data?.map((doctor: Doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
          />
        ))}
      </div>

      {isFetching && <p className="text-center mt-2">Loading...</p>}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded ${
              page === p ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
