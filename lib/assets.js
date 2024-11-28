import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

export async function compileAssets(watchMode) {
  const options = {
    entryPoints: [
      'app/assets/javascripts/application.js',
      'app/assets/stylesheets/application.scss'
    ],
    entryNames: '[name]',
    bundle: true,
    legalComments: 'none',
    minify: true,
    outdir: 'assets',
    plugins: [
      sassPlugin({
        loadPaths: ['.', 'node_modules'],
        silenceDeprecations: ['import', 'mixed-decls'],
        quietDeps: true
      })
    ],
    sourcemap: true
  }

  try {
    if (watchMode) {
      const ctx = await esbuild.context(options)
      await ctx.watch()
    } else {
      await esbuild.build(options)
    }
  } catch (error) {
    console.error(error)
  }
}
