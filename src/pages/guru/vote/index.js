import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2"; // Import SweetAlert2

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [nik, setNik] = useState(null); // State to hold nik
  const [expandedVisiMisi, setExpandedVisiMisi] = useState({}); // For handling "Visi Misi" expand
  const router = useRouter();

  useEffect(() => {
    const storedNik = localStorage.getItem("nik");

    if (!storedNik) {
      router.push("/guru/verify"); // Redirect to verify if nik is not found
    } else {
      setNik(storedNik); // Set nik in state
    }

    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://192.168.137.1:5001/api/users/candidates"
        );
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setMessage("Terjadi kesalahan saat mengambil daftar kandidat.");
      }
    };

    fetchCandidates();
  }, [router]);

  const handleVote = async (candidateId) => {
    try {
      // Tampilkan konfirmasi sebelum melakukan voting
      const result = await Swal.fire({
        title: "Konfirmasi Voting",
        text: "Apakah Anda yakin ingin memilih kandidat ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Pilih!",
        cancelButtonText: "Batal",
      });

      // Jika pengguna mengonfirmasi, lanjutkan dengan voting
      if (result.isConfirmed) {
        const response = await axios.post(
          "http://192.168.137.1:5001/api/teachers/vote",
          {
            nik, // Menggunakan nik yang ada di state
            candidateId,
          }
        );

        // SweetAlert ketika voting berhasil
        Swal.fire({
          title: "Terima Kasih Telah Memilih!",
          text: response.data.message || "Voting Pilketos Anda telah berhasil.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Menghapus nik dari local storage
          localStorage.removeItem("nik");

          // Redirect ke halaman utama setelah voting
          router.push("/");
        });
      }
    } catch (error) {
      console.error(error);

      // SweetAlert ketika terjadi kesalahan
      Swal.fire({
        title: "Kesalahan",
        text: "Terjadi kesalahan saat memberikan suara.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const toggleVisiMisi = (candidateId) => {
    setExpandedVisiMisi((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header with logos */}
      <div className="container mx-auto px-4 py-2 bg-[#F2EFEF] rounded-lg">
        <div className="flex justify-between items-center">
          <img
            src="/image 2.png"
            alt="Logo Left"
            className="h-auto w-[90px] px-2 mx-8"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#8B1D1D]">
              PILIH KANDIDAT YANG ANDA INGINKAN
            </h1>
            <p className="text-[#8B1D1D] font-semibold">
              Pilihanmu sekarang menentukan masa depan sekolahmu
            </p>
          </div>
          <img
            src="/Osis-removebg-preview 3.png"
            alt="Logo Right"
            className="h-auto w-[150px] px-2"
          />
        </div>

        {/* Candidate Grid */}
        <div className="gap-[90px] mt-8 flex items-center justify-center">
          {candidates.map((candidate, index) => (
            <div
              key={candidate.id}
              className="relative w-[350px] border border-[#8B1D1D] rounded-lg"
            >
              {/* Number Badge */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-10 w-[100px] text-center">
                <div className="bg-white rounded-lg px-4 py-2 shadow-md border border-[#8B1D1D]">
                  <span className="text-2xl font-bold text-[#8B1D1D]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Candidate Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                <div className="relative">
                  {/* Candidate Image */}
                  <div className="h-[365px] bg-gray-200">
                    <Image
                      src={`http://localhost:5001/getImage/${candidate.photo}`}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      width={500}
                      height={100}
                    />
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="p-4">
                  <div className="bg-[#8B1D1D] text-white p-2 rounded-t-lg mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="font-extrabold">
                          {candidate.name_ketua}
                        </div>
                        <div className="text-bold">{candidate.vision}</div>
                      </div>
                      <div>
                        <div className="font-extrabold">
                          {candidate.name_wakil}
                        </div>
                        <div className="text-bold">{candidate.mission}</div>
                      </div>
                    </div>
                  </div>

                  {/* Visi Misi Button */}

                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(candidate.id)}
                    className="w-full bg-[#8B1D1D] text-white py-2 rounded-lg font-bold hover:bg-[#7A1919] transition duration-300"
                  >
                    Vote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-4 text-center text-red-600">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Vote;
