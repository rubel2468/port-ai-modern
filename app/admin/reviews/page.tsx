"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, CheckCircle, XCircle, Trash2, Loader2, Eye, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({});

  const filters = ["All", "Pending Approval", "Approved"];

  useEffect(() => {
    fetchReviews(1);
  }, [filter]);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reviews?status=${filter}&page=${page}&limit=${pagination.limit}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id, isApproved })
      });
      if (res.ok) {
        fetchReviews(pagination.page);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id })
      });
      if (res.ok) {
        fetchReviews(pagination.page);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedText(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-primary-600" />
            Review Moderation
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and moderate customer reviews across all hotels</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              filter === f ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
          <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No Reviews Found</h3>
          <p className="text-gray-500 text-sm">No reviews matching the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Hotel</th>
                  <th className="p-4 font-semibold">Rating & Review</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review: any) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-semibold text-sm text-gray-900">{review.user?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{review.user?.email || "No email"}</div>
                    </td>
                    <td className="p-4">
                      {review.hotel ? (
                        <Link href={`/hotels/${review.hotel.slug}`} className="text-sm font-medium text-primary-600 hover:underline">
                          {review.hotel.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">Deleted Hotel</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={star <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {expandedText[review._id] ? review.comment : review.comment?.substring(0, 50)}
                        {review.comment?.length > 50 && (
                          <button onClick={() => toggleExpand(review._id)} className="text-primary-600 text-xs ml-1 hover:underline">
                            {expandedText[review._id] ? "Show less" : "...more"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        review.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.isApproved ? (
                          <button onClick={() => handleStatusChange(review._id, false)} title="Reject" className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition">
                            <XCircle size={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(review._id, true)} title="Approve" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(review._id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchReviews(pagination.page - 1)}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchReviews(pagination.page + 1)}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
