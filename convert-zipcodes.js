// Script to convert zipcodes.txt to optimized JSON format
const fs = require('fs');
const readline = require('readline');

const inputFile = 'zipcodes.txt';
const outputFile = 'zipcodes.json';

// Data structures
const zipToCities = {}; // { "01001": ["Vitoria/Gasteiz", ...] }
const cityToZips = {}; // { "vitoria/gasteiz": ["01001", "01002", ...] }
const allCities = new Set(); // All unique city names

console.log('Reading zipcodes.txt...');

const fileStream = fs.createReadStream(inputFile);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

let lineCount = 0;

rl.on('line', (line) => {
    lineCount++;
    
    // Skip empty lines
    if (!line.trim()) return;
    
    // Split by tab
    const parts = line.split('\t');
    if (parts.length < 2) return;
    
    const zip = parts[0].trim();
    const city = parts[1].trim();
    
    // Skip if zip or city is empty
    if (!zip || !city) return;
    
    // Normalize city name (lowercase for searching)
    const cityLower = city.toLowerCase();
    
    // Add to zip -> cities mapping
    if (!zipToCities[zip]) {
        zipToCities[zip] = [];
    }
    if (!zipToCities[zip].includes(city)) {
        zipToCities[zip].push(city);
    }
    
    // Add to city -> zips mapping
    if (!cityToZips[cityLower]) {
        cityToZips[cityLower] = [];
    }
    if (!cityToZips[cityLower].includes(zip)) {
        cityToZips[cityLower].push(zip);
    }
    
    // Add to all cities set
    allCities.add(city);
    
    if (lineCount % 10000 === 0) {
        console.log(`Processed ${lineCount} lines...`);
    }
});

rl.on('close', () => {
    console.log(`\nProcessed ${lineCount} lines`);
    console.log(`Found ${Object.keys(zipToCities).length} unique zip codes`);
    console.log(`Found ${allCities.size} unique cities`);
    
    // Create optimized structure for autocomplete
    const optimizedData = {
        // Zip code to cities (for zip code searches)
        zipToCities: zipToCities,
        
        // City name to zip codes (for city searches)
        cityToZips: cityToZips,
        
        // All unique cities with their original case (for display)
        cities: Array.from(allCities).sort(),
        
        // Metadata
        metadata: {
            totalZips: Object.keys(zipToCities).length,
            totalCities: allCities.size,
            generatedAt: new Date().toISOString()
        }
    };
    
    // Write to JSON file
    console.log('\nWriting to zipcodes.json...');
    fs.writeFileSync(outputFile, JSON.stringify(optimizedData, null, 2), 'utf8');
    
    const stats = fs.statSync(outputFile);
    console.log(`\n✅ Conversion complete!`);
    console.log(`Output file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`File saved as: ${outputFile}`);
});

