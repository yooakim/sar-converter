/**
 * Coordinate Converter Utility
 * 
 * Converts coordinates between different formats:
 * - DMS to DD (Degrees Minutes Seconds to Decimal Degrees)
 * - DDM to DD (Degrees Decimal Minutes to Decimal Degrees) 
 * - DD to DMS (Decimal Degrees to Degrees Minutes Seconds)
 * - DD to DDM (Decimal Degrees to Degrees Decimal Minutes)
 * 
 * Based on the formula from Wikipedia:
 * DD = D + M/60 + S/3600
 */

import { CoordinateFormat } from './coordinateParser.js';

/**
 * Converts DMS (Degrees Minutes Seconds) to Decimal Degrees
 * Formula: DD = D + M/60 + S/3600
 * @param {Object} dmsCoordinate - Parsed DMS coordinate object
 * @returns {number} - Decimal degrees value
 */
export function dmsToDecimalDegrees(dmsCoordinate) {
  if (!dmsCoordinate || dmsCoordinate.format !== CoordinateFormat.DMS) {
    throw new Error('Invalid DMS coordinate object');
  }
  
  const { degrees, minutes, seconds, sign } = dmsCoordinate;
  
  // Apply the conversion formula
  const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
  
  // Apply the sign (negative for South/West)
  return decimalDegrees * (sign || 1);
}

/**
 * Converts DDM (Degrees Decimal Minutes) to Decimal Degrees
 * Formula: DD = D + M/60
 * @param {Object} ddmCoordinate - Parsed DDM coordinate object
 * @returns {number} - Decimal degrees value
 */
export function ddmToDecimalDegrees(ddmCoordinate) {
  if (!ddmCoordinate || ddmCoordinate.format !== CoordinateFormat.DDM) {
    throw new Error('Invalid DDM coordinate object');
  }
  
  const { degrees, minutes, sign } = ddmCoordinate;
  
  // Apply the conversion formula
  const decimalDegrees = degrees + (minutes / 60);
  
  // Apply the sign (negative for South/West)
  return decimalDegrees * (sign || 1);
}

/**
 * Converts Decimal Degrees to DMS (Degrees Minutes Seconds)
 * @param {number} decimalDegrees - Decimal degrees value
 * @param {string} coordinateType - 'lat' or 'lng' for determining direction
 * @returns {Object} - DMS coordinate object
 */
export function decimalDegreesToDms(decimalDegrees, coordinateType = 'lat') {
  if (typeof decimalDegrees !== 'number' || isNaN(decimalDegrees)) {
    throw new Error('Invalid decimal degrees value');
  }
  
  const isNegative = decimalDegrees < 0;
  const absoluteValue = Math.abs(decimalDegrees);
  
  // Extract degrees (whole number part)
  const degrees = Math.floor(absoluteValue);
  
  // Extract minutes
  const minutesDecimal = (absoluteValue - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  
  // Extract seconds
  const seconds = (minutesDecimal - minutes) * 60;
  
  // Determine direction
  let direction;
  if (coordinateType.toLowerCase() === 'lat' || coordinateType.toLowerCase() === 'latitude') {
    direction = isNegative ? 'S' : 'N';
  } else {
    direction = isNegative ? 'W' : 'E';
  }
  
  return {
    format: CoordinateFormat.DMS,
    valid: true,
    degrees,
    minutes,
    seconds: Math.round(seconds * 1000) / 1000, // Round to 3 decimal places
    direction,
    sign: isNegative ? -1 : 1
  };
}

/**
 * Converts Decimal Degrees to DDM (Degrees Decimal Minutes)
 * @param {number} decimalDegrees - Decimal degrees value
 * @param {string} coordinateType - 'lat' or 'lng' for determining direction
 * @returns {Object} - DDM coordinate object
 */
export function decimalDegreesToDdm(decimalDegrees, coordinateType = 'lat') {
  if (typeof decimalDegrees !== 'number' || isNaN(decimalDegrees)) {
    throw new Error('Invalid decimal degrees value');
  }
  
  const isNegative = decimalDegrees < 0;
  const absoluteValue = Math.abs(decimalDegrees);
  
  // Extract degrees (whole number part)
  const degrees = Math.floor(absoluteValue);
  
  // Extract decimal minutes
  const minutes = (absoluteValue - degrees) * 60;
  
  // Determine direction
  let direction;
  if (coordinateType.toLowerCase() === 'lat' || coordinateType.toLowerCase() === 'latitude') {
    direction = isNegative ? 'S' : 'N';
  } else {
    direction = isNegative ? 'W' : 'E';
  }
  
  return {
    format: CoordinateFormat.DDM,
    valid: true,
    degrees,
    minutes: Math.round(minutes * 1000) / 1000, // Round to 3 decimal places
    direction,
    sign: isNegative ? -1 : 1
  };
}

/**
 * Universal converter that converts any coordinate format to Decimal Degrees
 * @param {Object} coordinate - Parsed coordinate object from coordinateParser
 * @returns {number} - Decimal degrees value
 */
export function toDecimalDegrees(coordinate) {
  if (!coordinate || !coordinate.valid) {
    throw new Error('Invalid coordinate object');
  }
  
  switch (coordinate.format) {
    case CoordinateFormat.DD:
      return coordinate.decimalDegrees || coordinate.degrees;
    
    case CoordinateFormat.DMS:
      return dmsToDecimalDegrees(coordinate);
    
    case CoordinateFormat.DDM:
      return ddmToDecimalDegrees(coordinate);
    
    default:
      throw new Error(`Unsupported coordinate format: ${coordinate.format}`);
  }
}

/**
 * Converts a coordinate pair to decimal degrees
 * @param {Object} coordinatePair - Result from parseCoordinatePair
 * @returns {Object} - Object with latitude and longitude in decimal degrees
 */
export function coordinatePairToDecimalDegrees(coordinatePair) {
  if (!coordinatePair || !coordinatePair.valid) {
    throw new Error('Invalid coordinate pair');
  }
  
  return {
    latitude: toDecimalDegrees(coordinatePair.latitude),
    longitude: toDecimalDegrees(coordinatePair.longitude),
    valid: true
  };
}

/**
 * Formats decimal degrees to a string with specified precision
 * @param {number} decimalDegrees - Decimal degrees value
 * @param {number} precision - Number of decimal places (default: 6)
 * @returns {string} - Formatted decimal degrees string
 */
export function formatDecimalDegrees(decimalDegrees, precision = 6) {
  if (typeof decimalDegrees !== 'number' || isNaN(decimalDegrees)) {
    throw new Error('Invalid decimal degrees value');
  }
  
  return decimalDegrees.toFixed(precision);
}

/**
 * Formats DMS coordinates to a string
 * @param {Object} dmsCoordinate - DMS coordinate object
 * @param {boolean} useSymbols - Whether to use degree/minute/second symbols
 * @returns {string} - Formatted DMS string
 */
export function formatDMS(dmsCoordinate, useSymbols = true) {
  if (!dmsCoordinate || dmsCoordinate.format !== CoordinateFormat.DMS) {
    throw new Error('Invalid DMS coordinate object');
  }
  
  const { degrees, minutes, seconds, direction } = dmsCoordinate;
  
  if (useSymbols) {
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  } else {
    return `${degrees} ${minutes} ${seconds} ${direction}`;
  }
}

/**
 * Formats DDM coordinates to a string
 * @param {Object} ddmCoordinate - DDM coordinate object
 * @param {boolean} useSymbols - Whether to use degree/minute symbols
 * @returns {string} - Formatted DDM string
 */
export function formatDDM(ddmCoordinate, useSymbols = true) {
  if (!ddmCoordinate || ddmCoordinate.format !== CoordinateFormat.DDM) {
    throw new Error('Invalid DDM coordinate object');
  }
  
  const { degrees, minutes, direction } = ddmCoordinate;
  
  if (useSymbols) {
    return `${degrees}°${minutes}'${direction}`;
  } else {
    return `${degrees} ${minutes} ${direction}`;
  }
}