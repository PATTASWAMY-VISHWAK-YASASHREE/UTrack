# UTrack Standalone Pages

This directory contains standalone HTML pages that demonstrate the UTrack bill scanning functionality. These pages can be deployed to any static hosting service like GitHub Pages, Netlify, or Vercel.

## 📁 Files

### `index.html`
- **Purpose**: Landing page for the demo
- **Features**: 
  - Overview of UTrack functionality
  - Navigation to scanner and results pages
  - Technology stack information
  - Responsive design

### `scan.html`
- **Purpose**: Bill scanning interface
- **Features**:
  - File upload functionality
  - Camera capture support
  - Image preview
  - AI OCR processing integration
  - Error handling

### `scan-result.html`
- **Purpose**: Display processed bill results
- **Features**:
  - Bill data visualization
  - Item breakdown and totals
  - Data export (JSON, HTML)
  - Copy/share functionality
  - Raw data viewing

## 🚀 Deployment

These pages are designed to work as static files and can be deployed to:

### GitHub Pages
1. Copy the `standalone-pages` folder to your repository
2. Enable GitHub Pages in repository settings
3. Point to the folder containing these files

### Netlify
1. Drag and drop the folder to Netlify
2. Or connect your GitHub repository

### Vercel
1. Import your repository to Vercel
2. Set the build output directory to `standalone-pages`

### Local Testing
```bash
# Serve locally with Python
cd standalone-pages
python -m http.server 8000

# Or with Node.js
npx serve .
```

## 🛠️ Features

### AI OCR Integration
- Uses external OCR service for bill processing
- Supports JPG and PNG image formats
- Extracts structured data (items, prices, totals)

### Data Export
- JSON format for programmatic use
- HTML format for human-readable receipts
- Copy to clipboard functionality
- Native sharing on supported devices

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Works on all screen sizes

### Progressive Enhancement
- Works without JavaScript (basic functionality)
- Enhanced features with JavaScript enabled
- Graceful fallbacks for unsupported features

## 🔧 Customization

### Styling
- All CSS is embedded in the HTML files
- Uses CSS custom properties for easy theming
- Mobile-responsive grid layouts

### API Integration
- Currently uses `https://bill-generator-m5du.onrender.com/process-bill`
- Can be changed to any compatible OCR service
- Supports FormData with 'bill_image' field

### Data Storage
- Uses localStorage for demo purposes
- Can be extended to work with any backend
- No sensitive data stored permanently

## 📱 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (basic functionality only)

## 🔒 Privacy & Security

- No data is stored permanently
- Images are processed via secure HTTPS
- LocalStorage data is cleared on navigation
- No tracking or analytics included

## 🎯 Use Cases

1. **Demo/Portfolio**: Showcase bill scanning capabilities
2. **Prototype**: Test OCR functionality before full implementation
3. **MVP**: Minimum viable product for bill scanning
4. **Educational**: Learn about web-based OCR integration

## 🔗 Integration with Main App

These standalone pages can be integrated back into the main UTrack React application:

1. **Components**: Convert HTML/CSS to React components
2. **Routing**: Add routes in React Router
3. **State Management**: Integrate with main app state
4. **Authentication**: Add user authentication
5. **Database**: Connect to Firebase/backend for persistence

## 📝 Notes

- The OCR service URL may need updating if the external service changes
- Some features (like "Save to Account") are placeholder implementations
- Error handling includes fallbacks for network issues
- Images are processed client-side before sending to OCR service

---

For the full UTrack application with authentication, database integration, and additional features, see the main React application in the parent directory.