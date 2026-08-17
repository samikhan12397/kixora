import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="font-display text-[120px] leading-none text-volt">404</div>
      <h1 className="font-display text-3xl mt-2">This pair walked off the shelf.</h1>
      <p className="text-steel mt-4 max-w-sm">
        The page you're looking for doesn't exist, or it's been moved. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-block">Back to Home</Link>
    </div>
  );
}
