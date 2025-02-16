// MainPage.js
import Navbar from './Navbar';

function MainPage() {
  return (
    <div className="h-full w-screen bg-gradient-to-b">
      <Navbar />
      <div className="flex flex-col container mx-auto px-4 py-8">
        <div className="flex flex-row items-center">
          <h2 className="text-3xl font-bold text-cyan-500 ml-2">
            MVZ El-Sharafi Team App
          </h2>
        </div>
        <h4>
          Liebes Team, ihr seid herzlich willkommen in der MVZ El-Sharafi Team
          App!
        </h4>
      </div>
      <img
        src="https://ik.imagekit.io/br3koz4p0/images/mvz-spandau.jpg"
        alt="Doctor Office Hero"
        className="object-cover w-screen h-[80vh]"
        loading="lazy"
      />
    </div>
  );
}
export default MainPage;
