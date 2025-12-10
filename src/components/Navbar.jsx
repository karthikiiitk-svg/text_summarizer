import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { logout } from '../redux/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TextSummarizer</Link>
        
        {user && (
          <div className="flex items-center gap-6">
            <Link to="/summary" className="hover:opacity-80 transition">Summary</Link>
            <Link to="/history" className="hover:opacity-80 transition">History</Link>
            <span className="text-sm opacity-90">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
