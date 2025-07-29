import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';

const isDev = process.argv.includes('--dev');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

const baseConfig = {
  entryPoints: ['src/cli.ts', 'src/index.ts', 'src/examples.ts'],
  bundle: true, // Bundle the code
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: isDev,
  minify: !isDev,
  external: ['axios', 'commander', 'ethers'], // Mark dependencies as external
  keepNames: true,
  tsconfig: 'tsconfig.json',
};

async function build() {
  try {
    console.log(`🔨 Building with esbuild (${isDev ? 'development' : 'production'} mode)...`);
    
    const result = await esbuild.build({
      ...baseConfig,
      metafile: true,
      logLevel: 'info',
    });

    // Copy types if needed (esbuild doesn't generate .d.ts files)
    if (!isDev) {
      console.log('📝 Generating TypeScript declarations...');
      try {
        execSync('tsc --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  TypeScript declaration generation failed:', error.message);
      }
    }

    console.log('✅ Build completed successfully!');
    
    if (isDev) {
      console.log('👀 Watching for changes...');
      const context = await esbuild.context(baseConfig);
      await context.watch();
    }

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
