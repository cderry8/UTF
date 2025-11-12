'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "./components/static/Footer";
import Hero from "./components/static/Hero";
import Rules from "./components/static/Rules";
import Navbar from './components/static/Navbar';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';


export default function Home() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const getSocialIcon = (url) => {
    if (url.includes('facebook.com')) return <FaFacebook />;
    if (url.includes('twitter.com')) return <FaTwitter />;
    if (url.includes('instagram.com')) return <FaInstagram />;
    if (url.includes('linkedin.com')) return <FaLinkedin />;
    return <FaGlobe />; // Default for unknown links
  };


  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/utf/staff');
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <main className="text-black  font-inter px-4 bg-transparent">

        <Rules />

        <section className="pb-24">
          <h3 className="text-2xl font-semibold text-[rgb(0,155,207)] text-center mb-6">
            🧑‍💼 Staff Team
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              {staffList.map((staff) => (
                <div
                  key={staff._id}
                  className="bg-[rgb(0,155,207)] p-5 rounded-md shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-lg">{staff.role} - {staff.name}</h4>
                    <p className="text-sm mt-1">{staff.work}</p>
                  </div>
                  {staff.socialLinks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {staff.socialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-full hover:underline"
                        >
                          {getSocialIcon(link)}
                        </a>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
