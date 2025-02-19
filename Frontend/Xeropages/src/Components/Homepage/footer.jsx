import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">About Us</h3>
          <p className="text-gray-400">
            We are dedicated to creating a transparent, efficient, and student-friendly college system. Our platform ensures fairness, accountability, and accessibility for all.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/elections" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                Student Elections
              </a>
            </li>
            <li>
              <a href="/health-notifications" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                Health Notifications
              </a>
            </li>
            <li>
              <a href="/facility-booking" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                Facility Booking
              </a>
            </li>
            <li>
              <a href="/complaints" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                Anonymous Complaints
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Contact Us</h3>
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>info@collegesystem.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Automated College System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;