import React, { useState, useEffect } from 'react';
import { ItineraryDoc, ItineraryItem, DestinationDoc } from '../types';
import { itineraryApi, destinationApi } from '../lib/dataAccessLayer';
import { tracker } from '../lib/tracker';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Lock,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ItineraryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAttractionId?: string;
  onOpenQuoteModal: (title?: string) => void;
}

export const ItineraryBuilderModal: React.FC<ItineraryBuilderModalProps> = ({
  isOpen,
  onClose,
  initialAttractionId,
  onOpenQuoteModal
}) => {
  const [itineraries, setItineraries] = useState<ItineraryDoc[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryDoc | null>(null);
  const [destinations, setDestinations] = useState<DestinationDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedAddAttraction, setSelectedAddAttraction] = useState<string>('');
  const [addDayNumber, setAddDayNumber] = useState<number>(1);
  const [addNotes, setAddNotes] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Demo active user ID
  const activeUserId = 'usr_traveler_02';

  // Load user itineraries & destinations
  const loadData = async () => {
    setLoading(true);
    try {
      const [userItins, destRes] = await Promise.all([
        itineraryApi.fetchUserItineraries(activeUserId),
        destinationApi.fetchAll()
      ]);
      setItineraries(userItins);
      setDestinations(destRes.data);

      if (userItins.length > 0 && !selectedItinerary) {
        setSelectedItinerary(userItins[0]);
      } else if (userItins.length === 0) {
        setIsCreatingNew(true);
      }
    } catch (err) {
      console.error('Error loading itinerary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Handle initial attraction addition
  useEffect(() => {
    if (isOpen && initialAttractionId && selectedItinerary) {
      const alreadyIn = selectedItinerary.items.some((i) => i.attraction_id === initialAttractionId);
      if (!alreadyIn) {
        handleAddSpot(initialAttractionId);
      }
    }
  }, [isOpen, initialAttractionId, selectedItinerary?.itinerary_id]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateNewItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await itineraryApi.create({
        user_id: activeUserId,
        title: newTitle.trim(),
        is_public: true,
        items: initialAttractionId ? [{ attraction_id: initialAttractionId, day_number: 1, order: 0 }] : []
      });
      setItineraries((prev) => [created, ...prev]);
      setSelectedItinerary(created);
      setNewTitle('');
      setIsCreatingNew(false);
      showToast(`Created new itinerary "${created.title}"`);
      tracker.bookmarkItinerary(created.title);
    } catch (err: any) {
      alert(err.message || 'Failed to create itinerary');
    }
  };

  const handleAddSpot = async (attractionId?: string) => {
    const targetId = attractionId || selectedAddAttraction;
    if (!targetId || !selectedItinerary) return;

    try {
      const updated = await itineraryApi.addAttraction(selectedItinerary.itinerary_id, {
        attraction_id: targetId,
        day_number: addDayNumber,
        notes: addNotes.trim() || undefined
      });
      setSelectedItinerary(updated);
      setItineraries((prev) => prev.map((i) => (i.itinerary_id === updated.itinerary_id ? updated : i)));
      setSelectedAddAttraction('');
      setAddNotes('');
      const dest = destinations.find((d) => d.attraction_id === targetId);
      showToast(`Added ${dest?.name || 'spot'} to Day ${addDayNumber}`);
      tracker.bookmarkItinerary(dest?.name || targetId);
    } catch (err: any) {
      alert(err.message || 'Failed to add attraction');
    }
  };

  const handleRemoveSpot = async (attractionId: string) => {
    if (!selectedItinerary) return;
    try {
      const updated = await itineraryApi.removeAttraction(selectedItinerary.itinerary_id, attractionId);
      setSelectedItinerary(updated);
      setItineraries((prev) => prev.map((i) => (i.itinerary_id === updated.itinerary_id ? updated : i)));
      showToast('Attraction removed from itinerary');
    } catch (err: any) {
      alert(err.message || 'Failed to remove attraction');
    }
  };

  const handleMoveItem = async (index: number, direction: 'up' | 'down') => {
    if (!selectedItinerary) return;
    const newItems = [...selectedItinerary.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-index order
    const reordered: ItineraryItem[] = newItems.map((item, idx) => ({
      ...item,
      order: idx
    }));

    try {
      const updated = await itineraryApi.reorderItems(selectedItinerary.itinerary_id, reordered);
      setSelectedItinerary(updated);
      setItineraries((prev) => prev.map((i) => (i.itinerary_id === updated.itinerary_id ? updated : i)));
    } catch (err: any) {
      alert(err.message || 'Failed to reorder items');
    }
  };

  const handleTogglePublic = async () => {
    if (!selectedItinerary) return;
    try {
      const updated = await itineraryApi.update(selectedItinerary.itinerary_id, {
        is_public: !selectedItinerary.is_public
      });
      setSelectedItinerary(updated);
      setItineraries((prev) => prev.map((i) => (i.itinerary_id === updated.itinerary_id ? updated : i)));
      showToast(`Itinerary is now ${updated.is_public ? 'Public & Shareable' : 'Private'}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility');
    }
  };

  if (!isOpen) return null;

  const getAttractionDetails = (attrId: string) => {
    return destinations.find((d) => d.attraction_id === attrId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#F9F6F0] rounded-sm max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#3A4F41] text-white p-6 flex items-center justify-between border-b border-[#2A3B30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C86D51] text-white rounded-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#E5D7C4] uppercase tracking-widest block">
                Jungle Lane Safaris • Database Itinerary Builder
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Personal Itineraries & Saved Spots
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xs hover:bg-[#2A3B30] text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toast alert */}
        {notification && (
          <div className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Bar: Selector & New Itinerary Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-sm border border-stone-200 shadow-xs">
            <div className="flex items-center gap-3 flex-1">
              <label className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider whitespace-nowrap">
                Select Itinerary:
              </label>
              {itineraries.length > 0 && !isCreatingNew ? (
                <select
                  value={selectedItinerary?.itinerary_id || ''}
                  onChange={(e) => {
                    const found = itineraries.find((i) => i.itinerary_id === e.target.value);
                    if (found) setSelectedItinerary(found);
                  }}
                  className="bg-stone-50 border border-stone-300 text-xs text-[#222222] font-semibold rounded-xs px-3 py-2 focus:outline-none focus:border-[#C86D51] flex-1 max-w-md"
                >
                  {itineraries.map((itin) => (
                    <option key={itin.itinerary_id} value={itin.itinerary_id}>
                      {itin.title} ({itin.items.length} spots)
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-stone-500 italic">No itineraries yet</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCreatingNew ? (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="px-3 py-2 bg-[#3A4F41] hover:bg-[#2A3B30] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Custom Plan</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xs transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* New Itinerary Creation Form */}
          {isCreatingNew && (
            <form
              onSubmit={handleCreateNewItinerary}
              className="bg-white p-5 rounded-sm border-2 border-[#C86D51] shadow-sm space-y-4 animate-fade-in"
            >
              <div className="flex items-center gap-2 text-[#C86D51]">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#3A4F41]">Create New Travel Itinerary</h3>
              </div>
              <p className="text-xs text-stone-600">
                Give your safari or holiday a title. You can save destinations, organize them by day, and request custom quotes directly.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. 6-Day Masai Mara & Rift Valley Honeymoon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xs focus:outline-none focus:border-[#C86D51]"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C86D51] hover:bg-[#b05a41] text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </form>
          )}

          {/* Active Itinerary Details */}
          {selectedItinerary && !isCreatingNew && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#3A4F41]">
                      {selectedItinerary.title}
                    </h3>
                    <button
                      onClick={handleTogglePublic}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs flex items-center gap-1 border ${
                        selectedItinerary.is_public
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                      title="Toggle public visibility"
                    >
                      {selectedItinerary.is_public ? <Globe className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-stone-500" />}
                      <span>{selectedItinerary.is_public ? 'Public / Shareable' : 'Private'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Last updated: {new Date(selectedItinerary.updated_at).toLocaleDateString()} • {selectedItinerary.items.length} spots included
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenQuoteModal(selectedItinerary.title)}
                    className="px-4 py-2 bg-[#C86D51] hover:bg-[#b05a41] text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow transition-colors flex items-center gap-1.5"
                  >
                    <span>Request Safari Quote for this Plan</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#3A4F41] flex items-center gap-2">
                    <span>Day-by-Day Saved Spots</span>
                    <span className="text-xs font-sans text-stone-500 font-normal">
                      (Reorder items or add notes)
                    </span>
                  </h4>
                </div>

                {selectedItinerary.items.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-stone-300 rounded-sm space-y-2">
                    <MapPin className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs font-bold text-stone-700">No destinations added to this plan yet</p>
                    <p className="text-[11px] text-stone-500">
                      Use the quick-add form below or click "Add to Itinerary" from the Destinations Explorer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedItinerary.items.map((item, idx) => {
                      const details = getAttractionDetails(item.attraction_id);
                      return (
                        <div
                          key={`${item.attraction_id}-${idx}`}
                          className="bg-white p-4 rounded-sm border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="px-2.5 py-1 bg-[#3A4F41] text-[#E5D7C4] text-[11px] font-bold uppercase rounded-xs shrink-0">
                              Day {item.day_number}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-serif text-sm font-bold text-[#222222]">
                                  {details?.name || item.attraction_id}
                                </h5>
                                {details?.category && (
                                  <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-xs uppercase font-bold">
                                    {details.category}
                                  </span>
                                )}
                              </div>
                              {details?.location?.city && (
                                <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#C86D51]" />
                                  <span>{details.location.city}, {details.location.country}</span>
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-xs text-stone-700 bg-stone-50 p-2 rounded-xs border border-stone-200 mt-2 italic">
                                  "{item.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                            {/* Move Up */}
                            <button
                              onClick={() => handleMoveItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 hover:bg-stone-100 rounded-xs"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            {/* Move Down */}
                            <button
                              onClick={() => handleMoveItem(idx, 'down')}
                              disabled={idx === selectedItinerary.items.length - 1}
                              className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 hover:bg-stone-100 rounded-xs"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveSpot(item.attraction_id)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs transition-colors"
                              title="Remove Spot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Spot Form */}
              <div className="bg-white p-5 rounded-sm border border-stone-300 shadow-xs space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#3A4F41] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#C86D51]" />
                  <span>Add Destination to this Itinerary</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                      Choose Attraction / Park
                    </label>
                    <select
                      value={selectedAddAttraction}
                      onChange={(e) => setSelectedAddAttraction(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xs focus:outline-none focus:border-[#C86D51]"
                    >
                      <option value="">-- Select an Attraction --</option>
                      {destinations.map((d) => (
                        <option key={d.attraction_id} value={d.attraction_id}>
                          {d.name} ({d.category} - {d.location.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                      Day Number
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={addDayNumber}
                      onChange={(e) => setAddDayNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xs focus:outline-none focus:border-[#C86D51]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-stone-600 uppercase block mb-1">
                      Notes or Special Requests (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Afternoon game drive, sunset sundowner, balloon flight..."
                        value={addNotes}
                        onChange={(e) => setAddNotes(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xs focus:outline-none focus:border-[#C86D51]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSpot()}
                        disabled={!selectedAddAttraction}
                        className="px-4 py-2 bg-[#3A4F41] hover:bg-[#2A3B30] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow transition-colors"
                      >
                        Add Spot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Backed by Jungle Lane Safaris robust data persistence layer.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
