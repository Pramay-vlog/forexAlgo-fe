import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddTradeDialog from './components/AddTradeDialog';
import Trades from './components/Trades';
import { Trade } from './types';
import { axiosInstance } from './api/base';
import toast, { Toaster } from 'react-hot-toast';

function App () {
  const [ isDialogOpen, setIsDialogOpen ] = useState( false );
  const [ trades, setTrades ] = useState<Trade[]>( [] ); // Initialize with an empty array

  // Fetch trades from the server
  const fetchTrades = async () => {
    try {
      const response = await axiosInstance.get( '/trade' );
      setTrades( response.data.payload ); // Set new trade data
    } catch ( error ) {
      console.error( 'Error fetching trades:', error );
    }
  };

  useEffect( () => {
    fetchTrades(); // Initial fetch of trades on component mount
  }, [] );

  // Handle adding a new trade
  const handleAddTrade = () => {
    setIsDialogOpen( false ); // Close the dialog after submission
  };

  // This function will be called once a trade is added successfully
  const handleTradeTempor = () => {
    fetchTrades(); // Refetch trades after adding a new one
  };

  const handleShowNotification = ( message: string, type: 'success' | 'error' ) => {
    if ( type === 'success' ) {
      toast.success( message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      } );
    } else if ( type === 'error' ) {
      toast.error( message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#F44336',
          color: '#fff',
        },
      } );
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-3xl font-bold mb-1">FOREX TRADING TERMINAL v1.0</h1>
            <p className="text-green-300">©2025 Wilgax®</p>
          </div>
          <button
            className="retro-button"
            onClick={() => setIsDialogOpen( true )} // Open the dialog
          >
            <Plus className="inline-block mr-2" size={16} />
            NEW TRADE
          </button>
        </div>

        <Trades trades={trades} isExitTrade={handleTradeTempor} onShowNotification={handleShowNotification} /> {/* Pass the updated trades data */}

        <AddTradeDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen( false )}
          onSubmit={handleAddTrade}
          onTradeAdded={handleTradeTempor} // Pass onTradeAdded as a prop
          onShowNotification={handleShowNotification} // Pass onShowNotification as a prop
        />

        <Toaster />
      </div>
    </div>
  );
}

export default App;
