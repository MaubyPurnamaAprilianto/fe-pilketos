import DashboardLayout from "@/components/DashboardLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Image from "next/image";

const Data = () => {
  const [candidates, setCandidates] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]); // Menyimpan data siswa
  const [editCandidate, setEditCandidate] = useState(null); // Menyimpan data kandidat untuk edit
  const [formData, setFormData] = useState({
    name: "",
    vision: "",
    mission: "",
    photo: "",
  });
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("candidates"); // State untuk mengelola tampilan saat ini
  const router = useRouter();

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Search
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch candidates
        const candidatesResponse = await axios.get(
          "http://192.168.137.1:5001/api/candidates",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setCandidates(candidatesResponse.data);

        // Fetch teachers
        const teachersResponse = await axios.get(
          "http://192.168.137.1:5001/api/teachers/",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setTeachers(teachersResponse.data);

        // Fetch students
        const studentsResponse = await axios.get(
          "http://192.168.137.1:5001/api/users/", // Endpoint untuk mengambil data siswa
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setStudents(studentsResponse.data); // Simpan data siswa
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };

    fetchData();
  }, [router]);

  // Fungsi untuk menangani perubahan form, termasuk upload gambar
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Simpan file jika input adalah file, simpan nilai jika input teks
    });
  };

  // Fungsi untuk menangani edit kandidat
  const handleEdit = (candidate) => {
    setEditCandidate(candidate);
    setFormData({
      name: candidate.name,
      vision: candidate.vision,
      mission: candidate.mission,
      photo: candidate.photo,
    });
  };

  // Fungsi untuk menangani update kandidat
  const handleUpdate = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("vision", formData.vision);
      formDataToSend.append("mission", formData.mission);

      // Tambahkan foto hanya jika ada file baru
      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.put(
        `http://192.168.137.1:5001/api/candidates/${editCandidate.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update state candidates setelah berhasil di-update
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === editCandidate.id ? response.data : candidate
        )
      );
      setEditCandidate(null);
      setFormData({
        name: "",
        vision: "",
        mission: "",
        photo: "",
      });
    } catch (err) {
      setError("Failed to update candidate");
      console.error(err);
    }
  };

  // Fungsi untuk menambah kandidat baru
  const handleAdd = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("vision", formData.vision);
      formDataToSend.append("mission", formData.mission);

      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await axios.post(
        "http://192.168.137.1:5001/api/candidates",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Tambahkan kandidat baru ke state
      setCandidates([...candidates, response.data]);

      // Reset form
      setFormData({
        name: "",
        vision: "",
        mission: "",
        photo: "",
      });
    } catch (err) {
      setError("Failed to add candidate");
      console.error(err);
    }
  };

  // Fungsi untuk menangani penghapusan kandidat
  const handleDelete = async (id) => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }

    try {
      await axios.delete(`http://192.168.137.1:5001/api/candidates/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setCandidates(candidates.filter((candidate) => candidate.id !== id));
    } catch (err) {
      setError("Failed to delete candidate");
      console.error(err);
    }
  };

  // Handler untuk perubahan dropdown
  const handleViewChange = (e) => {
    setCurrentView(e.target.value);
    setCurrentPage(1);
    setTeacherSearch("");
    setStudentSearch("");
  };

  // Fungsi untuk menangani perubahan pencarian guru
  const handleTeacherSearchChange = (e) => {
    setTeacherSearch(e.target.value);
    setCurrentPage(1);
  };

  // Fungsi untuk menangani perubahan pencarian siswa
  const handleStudentSearchChange = (e) => {
    setStudentSearch(e.target.value);
    setCurrentPage(1);
  };

  // Filtered data untuk teachers
  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.nik} ${teacher.name}`
      .toLowerCase()
      .includes(teacherSearch.toLowerCase())
  );

  // Filtered data untuk students
  const filteredStudents = students.filter((student) =>
    `${student.nis} ${student.name}`
      .toLowerCase()
      .includes(studentSearch.toLowerCase())
  );

  // Pagination logic untuk teachers
  const indexOfLastTeacher = currentPage * itemsPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalTeacherPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  // Pagination logic untuk students
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalStudentPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="bg-gray-100 w-full min-h-screen p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Data Management
        </h1>

        <div className="bg-white w-full shadow-md rounded-lg p-4 mb-6">
          <div className="">
            <select
              id="data-category"
              value={currentView}
              onChange={handleViewChange}
              className="px-4 py-2 rounded border border-gray-300 text-black"
            >
              <option value="candidates">Candidates</option>
              <option value="teachers">Teachers</option>
              <option value="students">Students</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Tabel Candidates */}
        {currentView === "candidates" && (
          <>
            <table className="min-w-full bg-white border border-gray-300 mb-6 text-gray-800">
              <thead>
                <tr>
                  <th className="border-b p-4 text-left">NO</th>
                  <th className="border-b p-4 text-left">Name</th>
                  <th className="border-b p-4 text-left">Vision</th>
                  <th className="border-b p-4 text-left">Mission</th>
                  <th className="border-b p-4 text-left">Photo</th>
                  <th className="border-b p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td className="border-b p-4">{index + 1}</td>
                    <td className="border-b p-4">{candidate.name}</td>
                    <td className="border-b p-4">{candidate.vision}</td>
                    <td className="border-b p-4">{candidate.mission}</td>
                    <td className="border-b p-4">
                      <Image
                        src={`http://localhost:5001/getImage/${candidate.photo}`}
                        alt={candidate.name}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td className="border-b p-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editCandidate && (
              <div className="bg-white p-4 border border-gray-300 text-gray-800 mb-6">
                <h2 className="text-lg font-semibold mb-4">Edit Candidate</h2>
                <div className="mb-4">
                  <label className="block text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm">Vision</label>
                  <input
                    type="text"
                    name="vision"
                    value={formData.vision}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm">Mission</label>
                  <input
                    type="text"
                    name="mission"
                    value={formData.mission}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Candidate
                </button>
              </div>
            )}
          </>
        )}

        {/* Tabel Teachers */}
        {currentView === "teachers" && (
          <>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Teacher List
              </h2>
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by NIK or Name"
                  value={teacherSearch}
                  onChange={handleTeacherSearchChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
              </div>

              {/* Scrollable Table Container */}
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white border border-gray-300 text-gray-800">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="border-b p-4 text-left">NO</th>
                      <th className="border-b p-4 text-left">NIK</th>
                      <th className="border-b p-4 text-left">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeachers.map((teacher, index) => (
                      <tr key={teacher.id}>
                        <td className="border-b p-4">{teacher.id}</td>
                        <td className="border-b p-4">{teacher.nik}</td>
                        <td className="border-b p-4">{teacher.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Teachers */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-800">
                  Page {currentPage} of {totalTeacherPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalTeacherPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tabel Students */}
        {currentView === "students" && (
          <>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Student List
              </h2>
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by NIS or Name"
                  value={studentSearch}
                  onChange={handleStudentSearchChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
              </div>

              {/* Scrollable Table Container */}
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white border border-gray-300 text-gray-800">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="border-b p-4 text-left">NO</th>
                      <th className="border-b p-4 text-left">NIS</th>
                      <th className="border-b p-4 text-left">Name</th>
                      <th className="border-b p-4 text-left">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student, index) => (
                      <tr key={student.id}>
                        <tdl className="border-b p-4">{student.id}</tdl>
                        <td className="border-b p-4">{student.nis}</td>
                        <td className="border-b p-4">{student.name}</td>
                        <td className="border-b p-4">{student.kelas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-800">
                  Page {currentPage} of {totalStudentPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalStudentPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Data;
