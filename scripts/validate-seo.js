import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const ROBOTS_PATH = path.join(DIST_DIR, 'robots.txt');

console.log('🔍 Starting Programmatic Local SEO Audit...');

// Helper to recursively find all HTML files
function getHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

// 1. Robots.txt check
function auditRobotsTxt() {
  console.log('\n🤖 Checking Robots Exclusions...');
  if (!fs.existsSync(ROBOTS_PATH)) {
    console.warn('⚠️ Warning: robots.txt not found in build output.');
    return true;
  }
  const content = fs.readFileSync(ROBOTS_PATH, 'utf-8');
  if (content.includes('Disallow: /locations/')) {
    console.error('❌ Error: robots.txt blocks search engine indexing of the /locations/ directory!');
    return false;
  }
  console.log('✅ Robots Exclusions: OK (Not blocking locations).');
  return true;
}

// 2. HTML Audits (Canonical, Schema, Noindex)
function auditHtmlFiles() {
  const htmlFiles = getHtmlFiles(DIST_DIR);
  if (htmlFiles.length === 0) {
    console.error('❌ Error: No HTML files found in build output. Did you run `npm run build`?');
    return false;
  }

  console.log(`\n📄 Auditing ${htmlFiles.length} HTML files...`);
  let errors = 0;
  let warnings = 0;

  htmlFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(DIST_DIR, file).replace(/\\/g, '/');

    // Skip non-location files for strict location rules
    const isLocationFile = relativePath.startsWith('locations/');

    // A. Canonical Tag Check
    const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
    if (!canonicalMatch) {
      console.error(`❌ Error in ${relativePath}: Missing canonical tag.`);
      errors++;
    } else {
      const canonicalUrl = canonicalMatch[1];
      const expectedPath = relativePath.replace('index.html', '');
      if (!canonicalUrl.includes(expectedPath)) {
        console.warn(`⚠️ Warning in ${relativePath}: Canonical URL "${canonicalUrl}" might not match path "${expectedPath}".`);
        warnings++;
      }
    }

    // B. Noindex Check
    if (isLocationFile) {
      if (content.includes('noindex') || content.includes('nofollow')) {
        console.error(`❌ Error in ${relativePath}: Found rogue noindex/nofollow meta tag!`);
        errors++;
      }
    }

    // C. Schema Structural Validity Check
    if (isLocationFile && relativePath.split('/').length === 4) {
      // It's a spoke page (locations/city/service/index.html)
      const schemaMatch = content.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
      if (!schemaMatch) {
        console.error(`❌ Error in ${relativePath}: Missing LocalBusiness JSON-LD schema.`);
        errors++;
      } else {
        try {
          const schemaObj = JSON.parse(schemaMatch[1].trim());
          if (schemaObj['@type'] !== 'LocalBusiness') {
            console.error(`❌ Error in ${relativePath}: Schema is not type 'LocalBusiness'.`);
            errors++;
          }
          if (!schemaObj.geo || typeof schemaObj.geo.latitude !== 'number' || typeof schemaObj.geo.longitude !== 'number') {
            console.error(`❌ Error in ${relativePath}: Schema is missing or has invalid Geo Coordinates.`);
            errors++;
          }
        } catch (e) {
          console.error(`❌ Error in ${relativePath}: Schema JSON is malformed!`, e.message);
          errors++;
        }
      }
    }
  });

  console.log(`\n📊 Audit Summary: ${errors} Errors, ${warnings} Warnings.`);
  return errors === 0;
}

// Executing audits
const robotsOk = auditRobotsTxt();
const htmlOk = auditHtmlFiles();

if (robotsOk && htmlOk) {
  console.log('\n🌟 Programmatic Local SEO Audit: PASSED SUCCESSFULLY! 🎉');
  process.exit(0);
} else {
  console.log('\n❌ Programmatic Local SEO Audit: FAILED. Please review the errors above.');
  process.exit(1);
}
