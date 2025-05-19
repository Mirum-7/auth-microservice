import { build, BuildConfig } from 'bun';
import { join } from 'path';

const start = performance.now();

const { default: config }: { default: BuildConfig } = await import(
  join(process.cwd(), 'build.config.ts')
);

await build(config);

const end = performance.now();
const diff = end - start;

console.log(`App is builded for ${diff}ms`);
