import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHistory, setLoading, deleteItem } from '../redux/historySlice';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function History() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.history);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!auth.currentUser) return;
    
    dispatch(setLoading(true));
    try {
      const q = query(
        collection(db, 'summaries'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      dispatch(setHistory(data));
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'summaries', id));
      dispatch(deleteItem(id));
    } catch (err) {
      console.error('Error deleting summary:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Summary History</h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="text-center text-gray-500 py-12">No summaries yet. Generate your first summary!</p>
        )}

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Original Text</h3>
                  <p className="text-gray-600 text-sm line-clamp-4">{item.originalText}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
                  <p className="text-gray-600 text-sm line-clamp-4">{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
