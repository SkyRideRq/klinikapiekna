const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TEMPLATE_FILE = path.join(SRC_DIR, 'index.html');
const OUTPUT_DIR = path.join(ROOT_DIR, 'produkcja');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

/**
 * Rekurencyjnie podmienia znaczniki <!-- @include sciezka/do/pliku.html -->
 */
function resolveIncludes(content, currentDir, visited = new Set()) {
  const includeRegex = /<!--\s*@include\s+([^\s]+)\s*-->/g;

  return content.replace(includeRegex, (match, relPath) => {
    const targetPath = path.resolve(currentDir, relPath);

    if (visited.has(targetPath)) {
      console.warn(`[OSTRZEŻENIE] Wykryto cykliczne dołączenie: ${targetPath}`);
      return `<!-- BŁĄD: Cykliczne dołączenie ${relPath} -->`;
    }

    if (!fs.existsSync(targetPath)) {
      console.error(`[BŁĄD] Nie znaleziono komponentu: ${targetPath}`);
      return `<!-- BŁĄD: Brak pliku ${relPath} -->`;
    }

    const fileContent = fs.readFileSync(targetPath, 'utf8');
    const nextVisited = new Set(visited);
    nextVisited.add(targetPath);

    return resolveIncludes(fileContent, path.dirname(targetPath), nextVisited);
  });
}

function build() {
  const startTime = Date.now();
  try {
    if (!fs.existsSync(TEMPLATE_FILE)) {
      console.error(`[BŁĄD] Brak pliku szablonu: ${TEMPLATE_FILE}`);
      return false;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    const compiledContent = resolveIncludes(templateContent, SRC_DIR);

    fs.writeFileSync(OUTPUT_FILE, compiledContent, 'utf8');

    const duration = Date.now() - startTime;
    const timeStr = new Date().toLocaleTimeString('pl-PL');
    console.log(`[${timeStr}] ✔ Pomyślnie zbudowano: produkcja/index.html (${duration} ms)`);
    return true;
  } catch (error) {
    console.error(`[BŁĄD] Wystąpił problem podczas budowania:`, error.message);
    return false;
  }
}

// Sprawdzenie flagi --watch
const isWatchMode = process.argv.includes('--watch') || process.argv.includes('-w');

if (isWatchMode) {
  console.log(`\n======================================================`);
  console.log(`  Klinika Kalina - Watcher komponentów aktywny`);
  console.log(`  Folder źródłowy:  src/`);
  console.log(`  Plik wynikowy:    produkcja/index.html`);
  console.log(`  (Naciśnij Ctrl+C, aby zakończyć)`);
  console.log(`======================================================\n`);

  build();

  let debounceTimer = null;
  fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\nZmieniono plik: src/${filename}`);
      build();
    }, 100);
  });
} else {
  build();
}
