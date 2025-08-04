 'use client'
 
import { useRouter } from 'next/navigation';

 interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}
 export default function LogOutModal ({isOpen, onClose} :LogoutModalProps) {
    const router = useRouter();
     const handleLogout = () => {
    localStorage.removeItem('token');
    onClose(); 
    router.push('/'); 
  };

   if (!isOpen) return null;


    return(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">Are you sure you want to logout?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Yes, Logout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
        
    )




 }