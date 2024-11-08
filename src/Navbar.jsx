import { Link } from 'react-router-dom';
import { useLogout } from './hooks/useLogout';
import { useAuthContext } from './hooks/useAuthContext';

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="flex flex-row justify-between bg-cyan-600">
        <div className="flex justify-start max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <a className="block text-teal-600" href="#">
                <span className="sr-only">Home</span>
                <svg
                  className="h-8"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ></svg>
              </a>
            </div>

            <div className="md:flex md:items-start  md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-start gap-6 text-lg">
                  <li>
                    <Link
                      to="/"
                      className="mr-4 text-slate-100  transition hover:text-gray-600 font-bold"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/waiting-list"
                      className="mr-4 text-slate-100 font-bold  transition hover:text-gray-600"
                    >
                      Warteliste
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex items-center mr-8 text-gray-100  space-x-2">
          <div className="flex gap-4">
            {user && (
              <div className="flex gap-2 justify-centeritems-center font-bold ">
                <Link
                  className=" text-gray-100 transition hover:text-gray-600"
                  to={`/doctor/${user.roomNumber}`}
                >
                  Hallo
                  <span className="uppercase pl-2 pr-4">{user.email}</span>
                </Link>
                <span>| </span>
                <button
                  className="text-gray-100 transition hover:text-gray-600"
                  onClick={handleLogout}
                >
                  Abmelden
                </button>
              </div>
            )}
            {!user && (
              <div className="flex gap-4 justify-center items-center">
                <Link
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600"
                  to="/login"
                >
                  Anmeldung
                </Link>
                <Link
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600"
                  to="/signup"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>

          <div className="block md:hidden">
            <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
