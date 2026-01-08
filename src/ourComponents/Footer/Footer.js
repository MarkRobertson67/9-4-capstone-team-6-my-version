import React from 'react';
import { Link } from 'react-router-dom';
import appStore from '../../assets/footerPhotos/download-app-store.png'
import playStore from '../../assets/footerPhotos/download-google-playstore.png'

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-6 lg:pt-8 md:grid-cols-4 shadow-2xl">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link to="/about" className="hover:underline">About</Link>
              </li>
              <li className="mb-4">
                <Link to="https://github.com/MarkRobertson67/9-4-capstone-team-6-my-version" className="hover:underline">Front-end Repo</Link>
              </li>
              <li className="mb-4">
                <Link to="https://github.com/MarkRobertson67/9-4-capstone-team-6-backend" className="hover:underline">Back-end Repo</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link to="#" className="hover:underline">FAQs</Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link to="#" className="hover:underline">Privacy Policy</Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline">Licensing</Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            // style={{ marginRight: '175px' }}
            >
              Download</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-4">
                <Link to="#" className="hover:underline" style={{ display: 'inline-block' }}>
                  <img src={appStore} alt="appstore"
                    style={{ width: '100px', height: '30px' }}>
                  </img>
                </Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline" style={{ display: 'inline-block' }}>
                  <img src={playStore} alt="playStore"
                    style={{ width: '100px', height: '30px' }}>
                  </img>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between shadow-inner">
        <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">© 2023 <Link to="https://citywhisperer.netlify.app">City Whisperer™</Link>. All Rights Reserved.</span>
        <div className="flex mt-4 space-x-5 sm:justify-center md:mt-0">
          <Link to="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
