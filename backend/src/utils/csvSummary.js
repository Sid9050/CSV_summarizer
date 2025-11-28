const csv = require('csv-parser');
const stream = require('stream');

function detectType(values){
  // simple heuristic: if all int -> integer, if all numeric -> float, else string
  const nonEmpty = values.filter(v=>v!==null && v!==undefined && String(v).trim()!=='');
  if(nonEmpty.length===0) return 'empty';
  const allInt = nonEmpty.every(v=> /^-?\d+$/.test(String(v)));
  if(allInt) return 'integer';
  const allNum = nonEmpty.every(v=> /^-?\d+(\.\d+)?$/.test(String(v)));
  if(allNum) return 'float';
  return 'string';
}

function summarizeCSVBuffer(buffer){
  return new Promise((resolve, reject)=>{
    const rows = [];
    const read = new stream.PassThrough();
    read.end(buffer);
    read.pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        if(rows.length===0) return resolve({ rows:0, columns:0, columnsInfo: {} });
        const columns = Object.keys(rows[0]);
        const columnsInfo = {};
        columns.forEach(col=>{
          const vals = rows.map(r=>r[col]);
          const missing = vals.filter(v=> v===undefined || v===null || String(v).trim()==='').length;
          columnsInfo[col] = {
            missing,
            detectedType: detectType(vals),
            sampleValues: vals.slice(0,5)
          };
        });
        resolve({ rows: rows.length, columns: columns.length, columnsInfo });
      })
      .on('error', reject);
  });
}

module.exports = { summarizeCSVBuffer, detectType };
