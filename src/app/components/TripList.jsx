import React, { useMemo, useState } from "react";
const TripList = ({
  trips,
  onTripClick,
  sortCriteria,
  setSortCriteria,
  sortDirection,
  setSortDirection,
}) => {
  const [activeTripId, setActiveTripId] = useState(null);
  // Create a mapping object for sorting
  const sortFunctions = {
    fare: (a, b) => (parseFloat(a.fare) || 0) - (parseFloat(b.fare) || 0),
    distance: (a, b) =>
      (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0),
    time: (a, b) => (a.estimatedTime || 0) - (b.estimatedTime || 0),
  };

  // Memoize the sorted trips to prevent unnecessary recalculations
  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      const comparison = sortFunctions[sortCriteria](a, b);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [trips, sortCriteria, sortDirection]);

  const handleSortChange = (criteria) => {
    // Set the sort criteria and toggle direction only if the criteria has changed
    if (criteria !== sortCriteria) {
      setSortCriteria(criteria);
      setSortDirection("asc"); // Reset to ascending when criteria changes
    } else {
      // Toggle the direction if the same criteria is selected
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };
  let handleTripClick = (trip) => {
    setActiveTripId(trip.id);
    onTripClick(trip);
  };
  return (
    <div className="p-4 bg-gradient-to-br from-indigo-500 from-10% via-sky-500 via-30% to-purple-900 to-80% text-white overflow-y-auto mx-auto shadow-xl shadow-indigo-900/50">
      <h1 className="text-[16x] lg:text-xl font-bold text-center mb-3 p-2 border-b tracking-widest">SKY TAXI TRIP</h1>
      <h2 className="text-sm text-center lg:text-lg font-semibold mb-4 drop-shadow-md">
        Sort By:
      </h2>
      <div className="mb-4 flex flex-wrap gap-3 text-center justify-center">
        <button
          className={`text-xs lg:text-[16px] px-4 lg:px-6 py-2 rounded shadow ${
            sortCriteria === "fare"
              ? "bg-white text-indigo-700 shadow-md shadow-indigo-300/50"
              : "text-white border border-white shadow-sm shadow-white/50"
          }`}
          onClick={() => handleSortChange("fare")}
        >
          Fare{" "}
          {sortCriteria === "fare" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>
        <button
          className={`text-xs lg:text-[16px] px-4 lg:px-6 py-2 rounded shadow ${
            sortCriteria === "distance"
              ? "bg-white text-indigo-700 shadow-md shadow-indigo-300/50"
              : "text-white border border-white shadow-sm shadow-white/50"
          }`}
          onClick={() => handleSortChange("distance")}
        >
          Distance{" "}
          {sortCriteria === "distance"
            ? sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </button>
        <button
          className={`text-xs lg:text-[16px] px-4 lg:px-6 py-2 rounded shadow ${
            sortCriteria === "time"
              ? "bg-white text-indigo-700 shadow-md shadow-indigo-300/50"
              : "text-white border border-white shadow-sm shadow-white/50"
          }`}
          onClick={() => handleSortChange("time")}
        >
          Estimated Time{" "}
          {sortCriteria === "time" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>
      </div>

      {sortedTrips.length > 0 ? (
        <div>
          <h2 className="text-sm lg:text-lg font-semibold mb-2 drop-shadow-md">
            Trips:
          </h2>
          {sortedTrips.map((trip) => (
            <div
              key={trip.id}
              className={`mb-3 p-3 space-y-1 text-xs lg:text-[16px] border border-white rounded-md cursor-pointer shadow-lg ${
                activeTripId === trip.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => handleTripClick(trip)}
            >
              <p className="font-semibold drop-shadow-sm">Trip {trip.id}</p>
              {trip.distance && <p>Distance: {trip.distance} km</p>}
              {trip.fare && <p>Fare: ${trip.fare}</p>}
              {trip.estimatedTime && (
                <p>Estimated Time: {trip.estimatedTime} minutes</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm lg:text-[14px] text-white text-center mt-5">
          No trips available
        </p>
      )}
    </div>
  );
};

export default TripList;
