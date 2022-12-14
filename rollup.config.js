import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import process from "node:process";

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    file: "main.js",
    exports: "default",
    sourcemap: false,
  },
  external: ["obsidian", "fs", "os", "path"],
  plugins: [
    typescript({
        tsconfig: "./tsconfig.json",
    }),
    resolve({
      browser: true,
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    babel({
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
      babelHelpers: 'bundled'
    }),
    commonjs(),
  ],
};
