export default function Footer() {
  return (
    <footer className="bg-[#A47864] text-gray-100 p-6 text-center">
      <p>© 2025 Pickly. All rights reserved.</p>
      <div className="mt-2 flex flex-col md:flex-row justify-center gap-4">
        <a href="#" className="hover:text-[#4caf50]">About</a>
        <a href="#" className="hover:text-[#4caf50]">Privacy</a>
        <a href="#" className="hover:text-[#4caf50]">Contact</a>
      </div>
    </footer>
  );
}