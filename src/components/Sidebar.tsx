"use client";
import Link from "next/link";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-0 md:w-64"
      } bg-gray-800 text-white h-screen overflow-hidden transition-all duration-300 md:overflow-visible`}
    >
      <button
        className="p-4 md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Dashboard"
              >
                <span className="ml-2">Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/indexes">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Index Management"
              >
                <span className="ml-2">Index Management</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Settings"
              >
                <span className="ml-2">Settings</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/mappings">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Mappings"
              >
                <span className="ml-2">Mappings</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/aggregations">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Aggregations"
              >
                <span className="ml-2">Aggregations</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/stopwords">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Stopwords"
              >
                <span className="ml-2">Stopwords</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/synonyms">
              <div
                className="flex items-center p-4 hover:bg-gray-700"
                aria-label="Synonyms"
              >
                <span className="ml-2">Synonyms</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
