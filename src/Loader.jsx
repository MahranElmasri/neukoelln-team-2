import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <span className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"></span>
    </div>
  );
}
