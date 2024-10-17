import { useState } from "react";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";
import Image from "next/image";

const decorativeImages = [
  {
    src: "/Group 4.png",
    position: "absolute top-0 left-[50px]",
    width: 230,
    height: 230,
  },
  {
    src: "/Group 65.png",
    position: "absolute top-[50px] left-[450px]",
    width: 100,
    height: 100,
  },
  {
    src: "/Group 57.png",
    position: "absolute top-[20px] right-[350px]",
    width: 180,
    height: 180,
  },
  {
    src: "/Group 41.png",
    position: "absolute right-0 top-[40%]",
    width: 50,
    height: 50,
  },
  {
    src: "/Group 2.png",
    position: "absolute top-[-5px] right-20",
    width: 200,
    height: 200,
  },
  {
    src: "/Group 2.png",
    position: "absolute bottom-0 left-20",
    width: 200,
    height: 200,
  },
  {
    src: "/Group 41.png",
    position: "absolute left-0 top-[60%]",
    width: 50,
    height: 50,
  },
  {
    src: "/Group 57.png",
    position: "absolute bottom-10 left-[350px]",
    width: 180,
    height: 180,
  },
  {
    src: "/Group 63.png",
    position: "absolute bottom-10 right-[350px]",
    width: 100,
    height: 100,
  },
  {
    src: "/Group 2.png",
    position: "absolute bottom-0 right-[50px]",
    width: 280,
    height: 280,
  },
];

export default function Verify() {
  const [nik, setNik] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://192.168.137.1:5001/api/teachers/verify", { nik });

      if (response.data.message === "NIK valid dan Anda dapat melakukan vote.") {
        Swal.fire({
          title: "Verifikasi Berhasil!",
          text: "NIK valid dan Anda dapat melakukan vote.",
          icon: "success",
          confirmButtonText: "Lanjutkan",
        }).then(() => {
          localStorage.setItem("nik", nik);
          Router.push("/guru/vote");
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Swal.fire({
            title: "NIK Tidak Ditemukan",
            text: "NIK tidak ditemukan. Silakan mendaftarkan NIK Anda terlebih dahulu.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            Router.push("/guru/register");
          });
        } else if (error.response.status === 400) {
          Swal.fire({
            title: "Sudah Melakukan Vote",
            text: "Anda sudah melakukan vote.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then(() => {
            Router.push("/guru/verify");
          });
        } else {
          Swal.fire({
            title: "Terjadi Kesalahan",
            text: error.response.data.message || "Terjadi kesalahan saat memverifikasi NIK.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: "Terjadi kesalahan saat memverifikasi NIK.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative shapes */}
      {decorativeImages.map((image, index) => (
        <div key={`decorative-${index}`} className={image.position}>
          <Image
            src={image.src}
            alt="Decorative shapes"
            width={image.width}
            height={image.height}
            className="object-contain"
          />
        </div>
      ))}

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Wrapper for cards with blurred background */}
        <div className="relative backdrop-blur-sm backdrop-brightness-[0.9] p-8 shadow-lg rounded-[30px] mx-auto max-w-2xl">
          <h1 className="text-[#8B2E2E] text-2xl font-extrabold text-center mb-4">
            VERIFIKASI NIK
          </h1>

          <div className="max-w-xl mx-auto bg-white rounded-[30px] shadow-lg px-6 py-2">
            <div className="mb-6">
              <h2 className="text-[#8B2E2E] text-lg font-semibold text-center relative top-5">
                Pemilihan Ketua dan Wakil Ketua Osis Periode 2024-2025
              </h2>

              <div className="flex items-center justify-between mb-4">
                {/* Left side - Illustration */}
                <div className="w-1/2 pr-4">
                  <img
                    src="/Desain tanpa judul 1.png"
                    alt="Teachers"
                    className="w-[280px] h-auto"
                  />
                </div>

                {/* Right side - Logos */}
                <div className="w-1/2 flex flex-col items-center justify-center relative">
                  <div className="flex items-center gap-3">
                    <img
                      src="/image 2.png"
                      alt="SMKN Logo"
                      className="object-contain w-[80px] h-auto px-2"
                    />
                    <span className="text-xl font-bold ml-5 text-gray-600">X</span>
                    <img
                      src="/Osis-removebg-preview 3.png"
                      alt="OSIS Logo"
                      className="object-contain w-[120px] h-auto px-2"
                    />
                  </div>
                  <p className="text-start text-[#8B2E2E] italic text-sm mb-6">
                    "Pilihan Cerdas untuk Ketua yang Berkualitas!"
                  </p>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerify} className="space-y-3">
                <input
                  type="text"
                  placeholder="Masukan NIK"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2E2E] transition duration-300"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-[#8B2E2E] text-white rounded-md font-semibold hover:bg-[#702525] transition duration-300"
                >
                  Verifikasi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
