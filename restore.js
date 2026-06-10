const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function restore() {
  const logPath = '/Users/evgenijgrinenko/.gemini/antigravity/brain/f056cbc4-749f-4904-8da7-eca92e6f9542/.system_generated/logs/transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const parts = {
    3625: '',
    3629: '',
    3633: ''
  };

  let stepIdx = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    const idx = obj.step_index || stepIdx;
    if (idx in parts) {
      parts[idx] = obj.content || '';
    }
    stepIdx++;
  }

  // Parse and assemble lines
  const linesMap = new Map();

  function parsePart(partText) {
    const lines = partText.split('\n');
    for (const l of lines) {
      const match = l.match(/^(\d+): (.*)$/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        const content = match[2];
        linesMap.set(lineNum, content);
      } else {
        // Some empty lines or lines with just the line number might match slightly differently,
        // e.g. "123: "
        const matchEmpty = l.match(/^(\d+):$/);
        if (matchEmpty) {
          const lineNum = parseInt(matchEmpty[1], 10);
          linesMap.set(lineNum, '');
        }
      }
    }
  }

  parsePart(parts[3625]);
  parsePart(parts[3629]);
  parsePart(parts[3633]);

  // Sort by line number
  const sortedLineNums = Array.from(linesMap.keys()).sort((a, b) => a - b);
  const codeLines = [];
  
  if (sortedLineNums.length === 0) {
    console.error('Failed to parse any lines!');
    process.exit(1);
  }

  const minNum = sortedLineNums[0];
  const maxNum = sortedLineNums[sortedLineNums.length - 1];
  console.log(`Parsed ${sortedLineNums.length} lines from line ${minNum} to ${maxNum}.`);

  for (let i = 1; i <= maxNum; i++) {
    if (linesMap.has(i)) {
      codeLines.push(linesMap.get(i));
    } else {
      console.warn(`Warning: Missing line ${i}`);
      codeLines.push('');
    }
  }

  const finalCode = codeLines.join('\n');
  const targetPath = '/Users/evgenijgrinenko/NOVA-STELYA/src/components/sections/Calculator/Calculator.tsx';
  fs.writeFileSync(targetPath, finalCode, 'utf8');
  console.log('Successfully restored file to:', targetPath);
}

restore().catch(console.error);
