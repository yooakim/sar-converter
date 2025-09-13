# SSRS Coordinate Converter

A React component for parsing and converting geographic coordinates between different formats: Decimal Degrees (DD), Degrees Minutes Seconds (DMS), and Degrees Decimal Minutes (DDM).

## Features

- ✅ **Parse Multiple Formats**: Automatically detects and parses DD, DMS, and DDM coordinate formats
- ✅ **Real-time Conversion**: Shows all format conversions as you type
- ✅ **Flexible Input**: Supports coordinate pairs or single coordinates
- ✅ **Format Detection**: Automatically identifies the input format
- ✅ **Error Handling**: Clear error messages for invalid inputs
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices
- ✅ **Accessibility**: Keyboard navigation and screen reader support

## Supported Formats

### Decimal Degrees (DD)
Simple decimal format with positive/negative values or cardinal directions:
- `40.7128, -74.0060`
- `40.7128N, 74.0060W`
- `-33.8688, 151.2093`

### Degrees Minutes Seconds (DMS)
Traditional format with degrees, minutes, and seconds:
- `40°42'46"N, 74°0'21"W`
- `51°30'26"N, 0°7'39"W`
- `40 42 46 N, 74 0 21 W` (space-separated)

### Degrees Decimal Minutes (DDM)
Degrees with decimal minutes:
- `40°42.767'N, 74°0.35'W`
- `33°52.08'S, 151°12.48'E`
- `40 42.767 N, 74 0.35 W` (space-separated)

## Project Structure

```
ssrs-converter/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CoordinateSearchBox.jsx
│   │   └── CoordinateSearchBox.css
│   ├── utils/
│   │   ├── coordinateParser.js
│   │   └── coordinateConverter.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd /home/yooakim/source/ssrs/ssrs-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

### Basic Usage

```jsx
import CoordinateSearchBox from './components/CoordinateSearchBox';

function MyApp() {
  const handleCoordinateChange = (result) => {
    console.log('Parsed coordinates:', result);
  };

  return (
    <CoordinateSearchBox
      onCoordinateChange={handleCoordinateChange}
      placeholder="Enter coordinates..."
      showConversions={true}
    />
  );
}
```

### Using the Utilities Directly

```javascript
import { parseCoordinatePair, coordinatePairToDecimalDegrees } from './utils/coordinateParser';
import { toDecimalDegrees } from './utils/coordinateConverter';

// Parse coordinate pair
const result = parseCoordinatePair('40.7128, -74.0060');
if (result.valid) {
  const decimal = coordinatePairToDecimalDegrees(result);
  console.log(decimal); // { latitude: 40.7128, longitude: -74.0060, valid: true }
}

// Parse single coordinate
const single = parseCoordinate('40°42\'46"N');
if (single.valid) {
  const decimalValue = toDecimalDegrees(single);
  console.log(decimalValue); // 40.71277777777778
}
```

## Component Props

### CoordinateSearchBox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCoordinateChange` | `function` | `undefined` | Callback fired when coordinate is parsed and converted |
| `placeholder` | `string` | `"Enter coordinates..."` | Input placeholder text |
| `showConversions` | `boolean` | `true` | Whether to show format conversions panel |
| `className` | `string` | `""` | Additional CSS class names |

## Conversion Formulas

The component uses standard geographic coordinate conversion formulas:

### DMS to Decimal Degrees
```
DD = D + M/60 + S/3600
```

### DDM to Decimal Degrees  
```
DD = D + M/60
```

Where:
- `D` = Degrees
- `M` = Minutes (or decimal minutes)
- `S` = Seconds
- Sign is negative for South (latitude) and West (longitude)

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Testing Examples

Try these coordinate examples:

1. **New York City (DD)**: `40.7128, -74.0060`
2. **London (DMS)**: `51°30'26"N, 0°7'39"W`
3. **Sydney (DDM)**: `33°52.08'S, 151°12.48'E`
4. **Mixed formats**: `35.6762, 139°41'30"E`
5. **Single coordinate**: `59.3293` or `40°42'46"N`

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## References

- [Decimal Degrees - Wikipedia](https://en.wikipedia.org/wiki/Decimal_degrees)
- [Geographic Coordinate System](https://en.wikipedia.org/wiki/Geographic_coordinate_system)
- [Latitude and Longitude Formats](https://flyandwire.com/2020/08/10/back-to-basics-latitude-and-longitude-dms-dd-ddm/)