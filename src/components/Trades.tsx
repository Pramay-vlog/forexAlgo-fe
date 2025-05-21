import { useState } from 'react';
import { Trade } from '../types';
import TradeHistory from './TradeHistory';
import Button from './Button';
import { axiosInstance } from '../api/base';

interface TradesProps {
  trades: Trade[];
  isExitTrade: () => void
  onShowNotification: ( message: string, type: 'success' | 'error' ) => void;
}

export default function Trades ( { trades, isExitTrade, onShowNotification }: TradesProps ) {
  const [ selectedTrade, setSelectedTrade ] = useState<Trade | null>( null );
  const [ exitTrade, setExitTrade ] = useState<Trade | null>( null );

  const handleRowClick = ( trade: Trade ) => {
    setSelectedTrade( trade );
  };

  const closePopup = () => {
    setSelectedTrade( null );
  };

  return (
    <div className="retro-panel">
      <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-600 pb-2">TRADE DETAILS</h2>
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr className="text-left border-b-2 border-gray-600">
              <th className="py-2">DATE</th>
              <th className="py-2">CURRENCY PAIR</th>
              <th className="py-2">STRATEGY</th>
              <th className="py-2">GAP</th>
              <th className="py-2">VOLUME</th>
              <th className="py-2">ECLIPSE BUFFER</th>
              <th className="py-2">STATE</th>
              <th className="py-2">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {trades?.map( ( trade ) => (
              <tr
                key={trade._id}
                className="hover:bg-gray-600 cursor-pointer"
                onClick={() => handleRowClick( trade )}
              >
                <td className="py-2">
                  {new Date( trade.createdAt ).getDate()}-{new Date( trade.createdAt ).getMonth() + 1}-{new Date( trade.createdAt ).getFullYear()}
                </td>
                <td className="py-2">{trade.symbol}</td>
                <td className="py-2">
                  {trade.strategy === 'TRAILING' ? (
                    <span className="text-blue-500 font-semibold">TRAILING - 1</span>
                  ) : (
                    <span className="text-yellow-500 font-semibold">STATIC - 2</span>
                  )}
                </td>
                <td className="py-2">{trade.gap}</td>
                <td className="py-2">{trade.volume}</td>
                <td className="py-2">{trade.eclipseBuffer}</td>
                <td className="py-2">
                  {trade.isActive ? (
                    <span className="text-green-500 font-semibold">ACTIVE</span>
                  ) : (
                    <span className="text-red-500 font-semibold">CLOSED</span>
                  )}
                </td>
                <td className="py-2">
                  <Button
                    disabled={!trade.isActive}
                    onClick={( e ) => {
                      e.stopPropagation();
                      setExitTrade( trade );
                    }}
                  >
                    EXIT
                  </Button>
                </td>
              </tr>
            ) )}
          </tbody>
        </table>
      </div>

      {/* Conditional rendering of the TradeHistory component as a modal */}
      {selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="retro-panel p-6 shadow-lg w-full max-w-4xl">
            <TradeHistory trade={selectedTrade} closePopup={closePopup} symbol={trades[ 0 ]?.symbol} />
          </div>
        </div>
      )}

      {/* Conditional rendering of the ExitTrade component as a modal */}
      {exitTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="retro-panel p-6 shadow-lg w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Exit?</h3>
            <p className="mb-6">This action is irreversible. Are you sure you want to exit <strong>{exitTrade.symbol}</strong>?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setExitTrade( null )}>No, Cancel</Button>
              <Button
                className="retro-button bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                onClick={async () => {
                  // Add actual exit logic here (e.g., API call)
                  await axiosInstance.post( '/trade', {
                    symbol: exitTrade.symbol,
                    GAP: exitTrade.gap,
                    ECLIPSE_BUFFER: exitTrade.eclipseBuffer,
                    volume: exitTrade.volume,
                    strategy: exitTrade.strategy,
                  } )
                  setExitTrade( null );
                  isExitTrade();
                  onShowNotification( 'Trade closed successfully!', 'success' )
                }}
              >
                yes, Exit!
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
