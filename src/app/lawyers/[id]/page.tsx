"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lawyer } from "@/helpers/interfaces/lawyer";
import { useGSAP } from "@gsap/react";
import Aos from "aos";
import axios from "axios";
import gsap from "gsap";
import "aos/dist/aos.css";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import toast, { Toaster } from "react-hot-toast";
import { Reviews } from "@/helpers/interfaces/review";

const LawyerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [owner, setOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const gsapRef = useRef(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState("");

  const handleBookConsultationSubmit = async () => {
    if (!consultDate || !consultTime || !durationMinutes) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await axios.post("/api/consultation", {
        user_id: userId,
        lawyer_id: lawyer?._id,
        scheduledAt: consultDate,
        time: consultTime,
        durationMinutes,
        notes,
      });

      if (response.status !== 200) {
        toast.error("Failed to book consultation.");
        return;
      }
  
      toast.success("Consultations booked successfully!");
      setIsBookingModalOpen(false);
      setConsultDate("");
      setConsultTime("");
      setDurationMinutes(30);
      setNotes("");
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to book consultation.");
    }
  };
  

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchLawyerData();
    fetchReviews();
    fetchUserId();
  }, []);

  useEffect(() => {
    if (lawyer && userId && lawyer.user?._id === userId) {
      setOwner(true);
    }
  }, [lawyer, userId]);

  const fetchLawyerData = async () => {
    try {
      const { data } = await axios.get(`/api/lawyers/${id}`);
      setLawyer(data.data);
    } catch (err: any) {
      setError("Failed to fetch lawyer data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    try {
      const id = (await getDataFromToken()).id;
      setUserId(id);
    } catch (err: any) {
      setError("Failed to fetch user ID");
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/reviews");
      const lawyerReviews = res.data.filter(
        (r: Reviews) => r.lawyer_id && r.lawyer_id._id === id
      );
      setReviews(lawyerReviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };


  const handleSubmitReview = async () => {
    try {
      if (!userId) {
        toast.error("You must be logged in to submit a review.");
        return;
      }
      if (comment.trim() === "") {
        toast.error("Comment cannot be empty.");
        return;
      }
      if (rating < 1 || rating > 5) {
        toast.error("Rating must be between 1 and 5.");
        return;
      }

      const { data } = await axios.post("/api/reviews", {
        client_id: userId,
        lawyer_id: id,
        rating,
        comment,
      });
      setReviews((prev) => [data, ...prev]);
      setIsModalOpen(false);
      setComment("");
      setRating(5);
      toast.success("Reviews submitted successfully!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review.");
      setIsModalOpen(false);
    }
  };

  const handleBookConsultation = () => {
    if (id) {
      router.push(`/consultation/${lawyer?._id}`);
    }
  };

  useGSAP(() => {
    if (!loading) {
      gsap.from(gsapRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-4 pt-20 pb-10 animate-pulse">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-gray-700 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center bg-[#2C2C2C] rounded-xl p-6 w-full md:w-1/2">
            <div className="w-48 h-48 rounded-full bg-gray-700 mb-4" />
            <div className="h-6 bg-gray-700 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
            <div className="h-4 bg-gray-700 rounded w-20 mb-1" />
            <div className="h-4 bg-gray-700 rounded w-28 mb-4" />
            <div className="h-10 w-36 bg-gray-700 rounded" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div className="bg-[#2C2C2C] p-4 rounded-xl space-y-3">
              <div className="h-6 bg-gray-700 rounded w-40" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>

            <div className="bg-[#2C2C2C] p-4 rounded-xl space-y-4">
              <div className="h-6 bg-gray-700 rounded w-40" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-[#1A1A1A] p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-700 rounded" />
                      <div className="h-4 w-12 bg-gray-700 rounded" />
                    </div>
                    <div className="h-4 w-full bg-gray-700 rounded" />
                    <div className="h-3 w-1/2 bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (error || !lawyer) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-lg">{error || "Lawyer not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-20 pb-10">
      <Toaster position="top-center" />
      <div
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg "
        ref={gsapRef}
      >
        {/* Left Panel: Lawyer Info */}
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-800 via-black to-gray-800  rounded-xl p-6 w-full md:w-1/2">
          <img
            src={lawyer.user?.profile_image_url || "/lawyer_vector.jpeg"}
            alt={lawyer.user?.username}
            className="w-48 h-48 rounded-full object-cover border-4 border-gray-700 mb-4"
          />
          <h1 className="text-2xl font-bold mb-1">{lawyer.user?.username}</h1>
          <p className="text-gray-400">{lawyer?.specialization_id?.name}</p>
          <p className="text-gray-500">{lawyer.years_of_experience} years experience</p>
          <p className="text-yellow-400 mt-2 font-medium">
            ⭐ {typeof lawyer.rating === "number" ? lawyer.rating.toFixed(1) : "N/A"} / 5
          </p>

          {owner ? (
            <button
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              onClick={() => router.push(`/dashboard/${userId}`)}
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="mt-4 flex gap-2 flex-col">
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              onClick={() => setIsBookingModalOpen(true)}
            >
              Book Consultations
            </button>
            
             <button
               className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
               onClick={() => router.push(`/consultation/${lawyer?._id}`)}
             >
               View All Consultations
             </button>
           </div>
          )}
          {/* show all consulation booked by user with this lawyer */}
         
        </div>

        {/* Right Panel: Bio & Reviews */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="bg-gray-900 p-4 rounded-xl bg-gradient-to-br from-gray-800 via-black to-gray-800">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-300">{lawyer.bio}</p>
          </div>

          <div className="bg-gray-900p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Client Reviews</h2>
              {userId && (
                owner ? (
                  <button
                    onClick={() => router.push(`/dashboard/${userId}`)}
                    className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-800"
                  >
                    View All Reviews
                  </button>
                ) : (

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-800"
                  >
                    + Add Reviews
                  </button>)

              )}

            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review._id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{review.client_id.username}</h3>
                      <span className="text-yellow-400">⭐ {review.rating}</span>
                    </div>
                    <p className="text-gray-300 mt-1">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Reviews Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-200 text-black rounded-lg w-full max-w-md p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Reviews</h3>

            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center mb-4 space-x-1 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Write your feedback..."
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for Consultations Booking */}
      {owner === false && isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white text-black rounded-lg w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Book a Consultations</h3>

            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={consultDate}
              onChange={(e) => setConsultDate(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={consultTime}
              onChange={(e) => setConsultTime(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              placeholder="e.g., 30"
            />

            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Any specific topics or questions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleBookConsultationSubmit}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LawyerDetail;
