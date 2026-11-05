import {readdir,readFile} from 'node:fs/promises';import {execFileSync} from 'node:child_process';
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await walk(p);else if(p.endsWith('.js'))execFileSync(process.execPath,['--check',p]);}}
await walk('public');await walk('src');console.log('Alle JavaScript-bestanden hebben geldige syntax.');
