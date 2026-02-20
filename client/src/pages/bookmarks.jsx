import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import API from "../utils/api";

const Bookmarks = () => {
  const user = JSON.parse(localStorage.getItem("campusUser"));

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get(`/bookmarks/${user.id}`);
      setBookmarks(res.data);
    } catch (err) {
      toast.error("❌ Error fetching bookmarks");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const removeBookmark = async (noteId) => {
    try {
      await API.post("/bookmarks/toggle", {
        userId: user.id,
        noteId,
      });

      // UI update without reload
      setBookmarks((prev) => prev.filter((item) => item.note_id !== noteId));
    } catch (err) {
      toast.error("❌ Remove bookmark failed");
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">My Bookmarks</h2>

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p>No bookmarks found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookmarks.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>

              <p className="text-sm text-gray-600">Subject: {note.subject}</p>
              <p className="text-sm text-gray-600">Semester: {note.semester}</p>
              <p className="text-sm text-gray-500 mb-3">
                Uploaded by: {note.uploaded_by}
              </p>
              <div className="flex items-center justify-between">
                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium"
                >
                  View / Download
                </a>
                <button
                  onClick={() => removeBookmark(note.note_id)}
                  className="text-red-500 text-sm font-semibold cursor-pointer"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Bookmarks;
