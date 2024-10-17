import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import ChartPilketos from "@/components/Chart/ChartPilketos";
import ChartPiePilketos from "@/components/Chart/ChartPiePilketos";
import axios from "axios";
import { useRouter } from "next/router";

const App = () => {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    votedStudents: 0,
    votedTeachers: 0,
    notVotedStudents: 0,
    notVotedTeachers: 0,
  });

  useEffect(() => {
    // Cek token, jika tidak ada, redirect ke halaman login
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if token is not found
    } else {
      // Mengambil data statistik voting dari backend
      axios
        .get("http://192.168.137.1:5001/api/auth/statistics")
        .then((response) => {
          setStats(response.data); // Simpan data statistik di state
        })
        .catch((error) => {
          console.error("Error fetching vote statistics:", error);
        });
    }
  }, [router]);

  return (
    <DashboardLayout>
      <div className="bg-gray-100 w-full min-h-screen p-6">
        {/* Grid untuk card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Total Siswa dan Guru Terdaftar */}
          <div className="bg-gray-700 shadow-md rounded-lg px-8 py-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-white">
              Total Yang Terdaftar
            </h2>
            {/* <p className="text-gray-600">
              Siswa: {stats.totalStudents} <br />
              Guru: {stats.totalTeachers}
            </p> */}
            <div className="bg-gray-700 shadow-md rounded-md w-full h-full flex items-center justify-center">
              <p className="text-white font-semibold">
                {stats.totalStudents + stats.totalTeachers}
              </p>
            </div>
          </div>

          {/* Card 2: Total Siswa dan Guru yang Sudah Vote */}
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">Total Yang Sudah Vote</h2>
            {/* <p className="text-gray-600">
              Siswa: {stats.votedStudents} <br />
              Guru: {stats.votedTeachers}
            </p> */}
            <div className="bg-white shadow-md rounded-md w-full h-full flex items-center justify-center">
              <p className="text-gray-800 font-semibold p-6">
                {stats.votedStudents + stats.votedTeachers}
                <span className="text-sm"> Dari </span>
                {stats.totalStudents + stats.totalTeachers}
              </p>
            </div>
          </div>

          {/* Card 3: Total Siswa dan Guru yang Belum Vote */}
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">Total Yang Belum Vote</h2>
            {/* <p className="text-gray-600">
              Siswa: {stats.notVotedStudents} <br />
              Guru: {stats.notVotedTeachers}
            </p> */}
            <div className="bg-white shadow-md rounded-md w-full h-full flex items-center justify-center">
              <p className="text-gray-800 font-semibold ">
                {stats.notVotedStudents + stats.notVotedTeachers}
                <span className="text-sm"> Dari </span>
                {stats.totalStudents + stats.totalTeachers}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian chart */}
        <div className="bg-white shadow-md rounded-lg p-4 mt-6 flex">
          <div className="flex-1 min-w-0">
            <ChartPilketos />
          </div>
          <div>
            <ChartPiePilketos />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default App;
