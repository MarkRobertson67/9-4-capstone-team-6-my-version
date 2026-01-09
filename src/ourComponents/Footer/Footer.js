
import { Link } from 'react-router-dom';


function Footer() {
  return (
  <footer className="bg-white dark:bg-gray-900">
    <div className="mx-auto w-full">
      {/* Top links section (3 columns, no Download) */}
      <div className="grid grid-cols-1 gap-8 px-4 py-6 shadow-2xl sm:grid-cols-2 md:grid-cols-3 lg:gap-16 lg:px-24">
        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
            Company
          </h2>
          <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/MarkRobertson67/9-4-capstone-team-6-my-version"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Front-end Repo
              </a>
            </li>
            <li>
              <a
                href="https://github.com/MarkRobertson67/9-4-capstone-team-6-backend"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Back-end Repo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
            Help Center
          </h2>
          <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
            <li>
              <Link to="#" className="hover:underline">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
            Legal
          </h2>
          <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
            <li>
              <Link to="#" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline">
                Licensing
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between shadow-inner lg:px-24">
      <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
        © 2023{" "}
        <a
          href="https://citywhisperer.netlify.app"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          City Whisperer™
        </a>
        . All Rights Reserved.
      </span>

      <div className="flex mt-4 space-x-5 sm:justify-center md:mt-0">
        <Link to="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
          {/* future icon */}
        </Link>
      </div>
    </div>
  </footer>
);

}

export default Footer;
