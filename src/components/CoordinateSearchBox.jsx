import React, { useState, useCallback, useMemo } from 'react';
import { 
  parseCoordinatePair, 
  parseCoordinate, 
  detectCoordinateFormat,
  CoordinateFormat 
} from '../utils/coordinateParser.js';
import { 
  coordinatePairToDecimalDegrees, 
  toDecimalDegrees,
  formatDecimalDegrees,
  formatDMS,
  formatDDM,
  decimalDegreesToDms,
  decimalDegreesToDdm
} from '../utils/coordinateConverter.js';
import './CoordinateSearchBox.css';

/**
 * CoordinateSearchBox Component
 * 
 * A React component that accepts coordinate input in various formats (DD, DMS, DDM)
 * and provides parsing, validation, and conversion functionality.
 */
const CoordinateSearchBox = ({ 
  onCoordinateChange, 
  placeholder = "Ange koordinater (t.ex. 59.3039747, 18.0628513)",
  showConversions = true,
  className = ""
}) => {
  const [input, setInput] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState('');

  // Parse and validate input whenever it changes
  const handleInputChange = useCallback((event) => {
    const value = event.target.value;
    setInput(value);
    
    if (!value.trim()) {
      setParseResult(null);
      setError('');
      onCoordinateChange && onCoordinateChange(null);
      return;
    }

    try {
      // Try to parse as coordinate pair first
      const pairResult = parseCoordinatePair(value);
      
      if (pairResult.valid) {
        const decimalResult = coordinatePairToDecimalDegrees(pairResult);
        setParseResult({
          type: 'pair',
          original: pairResult,
          decimal: decimalResult,
          input: value.trim()
        });
        setError('');
        onCoordinateChange && onCoordinateChange(decimalResult);
      } else {
        // Try to parse as single coordinate
        const singleResult = parseCoordinate(value);
        
        if (singleResult.valid) {
          const decimalValue = toDecimalDegrees(singleResult);
          setParseResult({
            type: 'single',
            original: singleResult,
            decimal: decimalValue,
            input: value.trim()
          });
          setError('');
          onCoordinateChange && onCoordinateChange({ 
            single: decimalValue, 
            format: singleResult.format 
          });
        } else {
          setParseResult(null);
          setError(pairResult.error || singleResult.error || 'Ogiltigt koordinatformat');
          onCoordinateChange && onCoordinateChange(null);
        }
      }
    } catch (err) {
      setParseResult(null);
      setError(err.message);
      onCoordinateChange && onCoordinateChange(null);
    }
  }, [onCoordinateChange]);

  // Generate format conversions for display
  const conversions = useMemo(() => {
    if (!parseResult || !showConversions) return null;

    const conversions = [];

    if (parseResult.type === 'pair') {
      const { latitude, longitude } = parseResult.decimal;
      
      // DD format
      conversions.push({
        format: 'Decimalgrader (DD)',
        value: `${formatDecimalDegrees(latitude, 6)}, ${formatDecimalDegrees(longitude, 6)}`
      });

      // DMS format
      try {
        const latDMS = decimalDegreesToDms(latitude, 'lat');
        const lngDMS = decimalDegreesToDms(longitude, 'lng');
        conversions.push({
          format: 'Grader Minuter Sekunder (GMS)',
          value: `${formatDMS(latDMS)}, ${formatDMS(lngDMS)}`
        });
      } catch (e) {
        // Skip if conversion fails
      }

      // DDM format
      try {
        const latDDM = decimalDegreesToDdm(latitude, 'lat');
        const lngDDM = decimalDegreesToDdm(longitude, 'lng');
        conversions.push({
          format: 'Grader Decimalminuter (GDM)',
          value: `${formatDDM(latDDM)}, ${formatDDM(lngDDM)}`
        });
      } catch (e) {
        // Skip if conversion fails
      }
    } else if (parseResult.type === 'single') {
      const { decimal: decimalValue, original } = parseResult;
      
      // DD format
      conversions.push({
        format: 'Decimalgrader (DD)',
        value: formatDecimalDegrees(decimalValue, 6)
      });

      // DMS format (if not already DMS)
      if (original.format !== CoordinateFormat.DMS) {
        try {
          const dmsResult = decimalDegreesToDms(decimalValue);
          conversions.push({
            format: 'Grader Minuter Sekunder (GMS)',
            value: formatDMS(dmsResult)
          });
        } catch (e) {
          // Skip if conversion fails
        }
      }

      // DDM format (if not already DDM)
      if (original.format !== CoordinateFormat.DDM) {
        try {
          const ddmResult = decimalDegreesToDdm(decimalValue);
          conversions.push({
            format: 'Grader Decimalminuter (GDM)',
            value: formatDDM(ddmResult)
          });
        } catch (e) {
          // Skip if conversion fails
        }
      }
    }

    return conversions;
  }, [parseResult, showConversions]);

  const getStatusInfo = () => {
    if (!input.trim()) return null;
    
    if (error) {
      return { type: 'error', message: error };
    }
    
    if (parseResult) {
      const formatName = parseResult.type === 'pair' 
        ? `${parseResult.original.latitude.format}/${parseResult.original.longitude.format}`
        : parseResult.original.format;
      
      return { 
        type: 'success', 
        message: `Upptäckt format: ${formatName}` 
      };
    }
    
    return null;
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`coordinate-search-box ${className}`}>
      <div className="search-input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`coordinate-input ${statusInfo?.type || ''}`}
          aria-label="Koordinatinmatning"
        />
        
        {statusInfo && (
          <div className={`status-indicator ${statusInfo.type}`}>
            <span className="status-icon">
              {statusInfo.type === 'success' ? '✓' : '✗'}
            </span>
            <span className="status-message">{statusInfo.message}</span>
          </div>
        )}
      </div>

      {conversions && conversions.length > 0 && (
        <div className="conversions-panel">
          <h4>Formatkonverteringar:</h4>
          <div className="conversion-list">
            {conversions.map((conversion, index) => (
              <div key={index} className="conversion-item">
                <div className="conversion-format">{conversion.format}</div>
                <div className="conversion-value">{conversion.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {parseResult && (
        <div className="coordinate-info">
          <h4>Parsad information:</h4>
          {parseResult.type === 'pair' ? (
            <div className="coordinate-details">
              <div>
                <strong>Latitud:</strong> {formatDecimalDegrees(parseResult.decimal.latitude, 6)}° 
                (Format: {parseResult.original.latitude.format})
              </div>
              <div>
                <strong>Longitud:</strong> {formatDecimalDegrees(parseResult.decimal.longitude, 6)}° 
                (Format: {parseResult.original.longitude.format})
              </div>
            </div>
          ) : (
            <div className="coordinate-details">
              <div>
                <strong>Värde:</strong> {formatDecimalDegrees(parseResult.decimal, 6)}° 
                (Format: {parseResult.original.format})
              </div>
              <div>
                <strong>Riktning:</strong> {parseResult.original.direction}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoordinateSearchBox;