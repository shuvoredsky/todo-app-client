// src/components/Footer.tsx
import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Branding */}
          <div>
            <h2 className="text-xl font-bold text-white">MyApp</h2>
            <p className="mt-2 text-sm">
              A simple demo app with user signup, tasks and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Todo Tasks
            </h3>
            <ul className="space-y-1 text-sm">
              <li>✔ Add new tasks</li>
              <li>✔ Mark as completed</li>
              <li>✔ Track progress</li>
              <li>✔ Manage daily goals</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/shuvoredsky"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Github size={22} />
              </a>
              <a
                href="https://linkedin.com/in/shuvoredsky"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://yourportfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Globe size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
