/**
 * Utility for handling image paths in the application
 */

// Function to get the correct path for an asset
export const getAssetPath = (imageName) => {
  return `/assets/${imageName}`;
};

// Function to handle image loading errors
export const handleImageError = (e) => {
  e.target.src = '/assets/placeholder.jpg'; // Fallback image
};