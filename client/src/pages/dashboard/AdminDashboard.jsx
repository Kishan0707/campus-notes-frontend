import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import API from "../../utils/api";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [bookmarksCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("campusUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchBookmarkCount();
      fetchNotes();
      if (user.role === "admin") {
        fetchUsers();
      }
    }
  }, [user]);

  const fetchBookmarkCount = async () => {
    try {
      const res = await API.get(`/bookmarks/count/${user.id}`);
      setBookmarkCount(res.data.count);
    } catch (err) {
      toast.error("❌ Error fetching bookmark count");
      console.log(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      toast.error("❌ Error fetching notes");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error(" Error fetching users");
      console.log(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Error updating role", err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-2">
        Welcome {user?.name || "User"}
      </h2>
      <p className="capitalize mb-6">Role: {user?.role}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">Total Notes</h2>
          <p className="text-3xl mt-2">{notes.length}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">My Bookmarks</h2>
          {loading ? (
            <p className="mt-2">Loading...</p>
          ) : (
            <p className="mt-2 text-3xl text-green-600 font-bold">
              {bookmarksCount}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg">Recent Uploads</h2>
          <p className="text-3xl mt-2">{notes.slice(0, 3).length}</p>
        </div>
      </div>

      {user?.role === "teacher" && (
        <div className="bg-blue-100 p-4 rounded mt-6">
          <p className="font-semibold">
            Teacher Panel: Upload notes from sidebar
          </p>
        </div>
      )}

      {user?.role === "admin" && (
        <div className="bg-red-100 p-6 rounded mt-6">
          <h3 className="font-semibold text-lg mb-4">
            Admin Panel: Manage Users
          </h3>

          {usersLoading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Current Role</th>
                    <th className="p-3 text-left">Update Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Notes</h3>

        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No notes available</p>
        ) : (
          <div className="space-y-4">
            {notes.slice(0, 3).map((note) => (
              <div key={note.id} className="border p-4 rounded">
                <h4 className="font-semibold">{note.title}</h4>
                <p className="text-sm text-gray-500">
                  {note.subject} • {note.semester}
                </p>
                <p className="text-sm text-gray-400">
                  Uploaded by {note.uploaded_by}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
