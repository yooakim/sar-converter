/**
 * Coordinate Parser Utility
 * 
 * Supports parsing of coordinate formats:
 * - DD (Decimal Degrees): 40.7128, -74.0060
 * - DMS (Degrees Minutes Seconds): 40°42'46"N, 74°0'21"W
 * - DDM (Degrees Decimal Minutes): 40°42.767'N, 74°0.35'W
 */

export const CoordinateFormat = {
  DD: 'DD',   // Decimal Degrees
  DMS: 'DMS', // Degrees Minutes Seconds
  DDM: 'DDM', // Degrees Decimal Minutes
  UNKNOWN: 'UNKNOWN'
};

/**
 * Regular expressions for different coordinate formats
 */
const REGEX_PATTERNS = {
  // DD: Simple decimal with optional sign and cardinal direction
  DD: /^(-?\d+\.?\d*)[°]?\s*([NSEW]?)$/i,
  
  // DMS: Degrees°Minutes'Seconds"Direction
  DMS: /^(-?\d+)[°]\s*(\d+)['']\s*(\d+(?:\.\d+)?)[""]\s*([NSEW]?)$/i,
  
  // DDM: Degrees°Minutes.decimal'Direction
  DDM: /^(-?\d+)[°]\s*(\d+(?:\.\d+)?)['']\s*([NSEW]?)$/i,
  
  // Alternative DMS format without symbols: 40 42 46 N
  DMS_SPACE: /^(-?\d+)\s+(\d+)\s+(\d+(?:\.\d+)?)\s*([NSEW]?)$/i,
  
  // Alternative DDM format without symbols: 40 42.767 N
  DDM_SPACE: /^(-?\d+)\s+(\d+(?:\.\d+)?)\s*([NSEW]?)$/i
};

/**
 * Detects the format of a coordinate string
 * @param {string} coordinate - The coordinate string to analyze
 * @returns {string} - The detected format (DD, DMS, DDM, or UNKNOWN)
 */
export function detectCoordinateFormat(coordinate) {
  if (!coordinate || typeof coordinate !== 'string') {
    return CoordinateFormat.UNKNOWN;
  }

  const trimmed = coordinate.trim();
  
  // Check for DMS format first (most specific)
  if (REGEX_PATTERNS.DMS.test(trimmed) || REGEX_PATTERNS.DMS_SPACE.test(trimmed)) {
    return CoordinateFormat.DMS;
  }
  
  // Check for DDM format
  if (REGEX_PATTERNS.DDM.test(trimmed) || REGEX_PATTERNS.DDM_SPACE.test(trimmed)) {
    return CoordinateFormat.DDM;
  }
  
  // Check for DD format
  if (REGEX_PATTERNS.DD.test(trimmed)) {
    return CoordinateFormat.DD;
  }
  
  return CoordinateFormat.UNKNOWN;
}

/**
 * Parses a coordinate string and returns its components
 * @param {string} coordinate - The coordinate string to parse
 * @returns {Object} - Parsed coordinate object with format and components
 */
export function parseCoordinate(coordinate) {
  const format = detectCoordinateFormat(coordinate);
  
  if (format === CoordinateFormat.UNKNOWN) {
    return {
      format: CoordinateFormat.UNKNOWN,
      valid: false,
      error: 'Unknown coordinate format'
    };
  }
  
  const trimmed = coordinate.trim();
  
  try {
    switch (format) {
      case CoordinateFormat.DD:
        return parseDD(trimmed);
      case CoordinateFormat.DMS:
        return parseDMS(trimmed);
      case CoordinateFormat.DDM:
        return parseDDM(trimmed);
      default:
        return {
          format: CoordinateFormat.UNKNOWN,
          valid: false,
          error: 'Unsupported format'
        };
    }
  } catch (error) {
    return {
      format,
      valid: false,
      error: error.message
    };
  }
}

/**
 * Parses Decimal Degrees format
 */
function parseDD(coordinate) {
  const match = coordinate.match(REGEX_PATTERNS.DD);
  if (!match) {
    throw new Error('Invalid DD format');
  }
  
  let degrees = parseFloat(match[1]);
  const direction = match[2];
  
  // Apply direction if specified
  if (direction && (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W')) {
    degrees = -Math.abs(degrees);
  }
  
  return {
    format: CoordinateFormat.DD,
    valid: true,
    degrees,
    direction: direction || (degrees < 0 ? (Math.abs(degrees) <= 90 ? 'S' : 'W') : (Math.abs(degrees) <= 90 ? 'N' : 'E')),
    decimalDegrees: degrees
  };
}

/**
 * Parses Degrees Minutes Seconds format
 */
function parseDMS(coordinate) {
  let match = coordinate.match(REGEX_PATTERNS.DMS);
  if (!match) {
    match = coordinate.match(REGEX_PATTERNS.DMS_SPACE);
  }
  
  if (!match) {
    throw new Error('Invalid DMS format');
  }
  
  const degrees = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = parseFloat(match[3]);
  const direction = match[4];
  
  // Validate ranges
  if (minutes >= 60 || seconds >= 60) {
    throw new Error('Invalid minutes or seconds value');
  }
  
  return {
    format: CoordinateFormat.DMS,
    valid: true,
    degrees: Math.abs(degrees),
    minutes,
    seconds,
    direction: direction || (degrees < 0 ? (Math.abs(degrees) <= 90 ? 'S' : 'W') : (Math.abs(degrees) <= 90 ? 'N' : 'E')),
    sign: degrees < 0 || (direction && (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W')) ? -1 : 1
  };
}

/**
 * Parses Degrees Decimal Minutes format
 */
function parseDDM(coordinate) {
  let match = coordinate.match(REGEX_PATTERNS.DDM);
  if (!match) {
    match = coordinate.match(REGEX_PATTERNS.DDM_SPACE);
  }
  
  if (!match) {
    throw new Error('Invalid DDM format');
  }
  
  const degrees = parseInt(match[1]);
  const minutes = parseFloat(match[2]);
  const direction = match[3];
  
  // Validate ranges
  if (minutes >= 60) {
    throw new Error('Invalid minutes value');
  }
  
  return {
    format: CoordinateFormat.DDM,
    valid: true,
    degrees: Math.abs(degrees),
    minutes,
    direction: direction || (degrees < 0 ? (Math.abs(degrees) <= 90 ? 'S' : 'W') : (Math.abs(degrees) <= 90 ? 'N' : 'E')),
    sign: degrees < 0 || (direction && (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W')) ? -1 : 1
  };
}

/**
 * Parses a full coordinate pair (latitude, longitude)
 * @param {string} coordinateString - Full coordinate string like "40.7128, -74.0060"
 * @returns {Object} - Object with latitude and longitude parsing results
 */
export function parseCoordinatePair(coordinateString) {
  if (!coordinateString || typeof coordinateString !== 'string') {
    return {
      valid: false,
      error: 'Invalid input'
    };
  }
  
  // Split by comma, semicolon, or multiple spaces
  const parts = coordinateString.split(/[,;]|\s{2,}/).map(part => part.trim());
  
  if (parts.length !== 2) {
    return {
      valid: false,
      error: 'Expected two coordinate components (latitude, longitude)'
    };
  }
  
  const latResult = parseCoordinate(parts[0]);
  const lngResult = parseCoordinate(parts[1]);
  
  return {
    valid: latResult.valid && lngResult.valid,
    latitude: latResult,
    longitude: lngResult,
    error: (!latResult.valid && latResult.error) || (!lngResult.valid && lngResult.error)
  };
}