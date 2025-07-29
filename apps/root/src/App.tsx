import "./index.css";
import msyuImage from "./MSYU.png";

export function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center relative overflow-hidden">
      {/* Background Character Image */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-40 md:opacity-50"
        style={{
          backgroundImage: `url(${msyuImage})`,
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          maxWidth: '100%'
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 mt-[-20vh] sm:mt-[-25vh] md:mt-[-30vh]">
        <h1 className="pixel-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black select-none">
          suho.io
        </h1>
      </div>
    </div>
  );
}

export default App;
