import { FileSystem } from "@davidsouther/jiffies/lib/esm/fs.js";
import {
  asyncUsing,
  Enter,
  Exit,
} from "@davidsouther/jiffies/lib/esm/context.js";

import * as project_01 from "./project_01/index.js";
import * as project_02 from "./project_02/index.js";
import * as project_03 from "./project_03/index.js";
import * as project_05 from "./project_05/index.js";
import * as project_06 from "./project_06/index.js";
import * as samples from "./samples/index.js";

export const CHIP_PROJECTS: Record<"01" | "02" | "03" | "05", string[]> = {
  "01": [
    "Not",
    "And",
    "Or",
    "XOr",
    "Mux",
    "DMux",
    "Not16",
    "And16",
    "Or16",
    "Mux16",
    "Mux4Way16",
    "Mux8Way16",
    "DMux4Way",
    "DMux8Way",
    "Or8Way",
  ],
  "02": ["HalfAdder", "FullAdder", "Add16", "Inc16", "AluNoStat", "ALU"],
  "03": ["Bit", "Register", "PC", "RAM8", "RAM64", "RAM512", "RAM4k", "RAM16k"],
  "05": ["Memory", "CPU", "Computer"],
};

export const ChipProjects = {
  "01": project_01,
  "02": project_02,
  "03": project_03,
  "05": project_05,
};

export const ASM_PROJECTS: Record<"06", string[]> = {
  "06": ["Add", "Max", "Rectangle", "Pong"],
};

export const AsmProjects = {
  "06": project_06,
};

let reset = false;
export const resetFiles = async (fs: FileSystem) => {
  if (reset) return; // React will double-render a call to resetFiles in useEffect.
  reset = true;
  await project_01.resetFiles(fs);
  await project_02.resetFiles(fs);
  await project_03.resetFiles(fs);
  await project_05.resetFiles(fs);
  reset = false;
};

export const loadSolutions = async (fs: FileSystem) => {
  if (reset) return; // React will double-render a call to resetFiles in useEffect.
  asyncUsing(
    {
      [Enter]() {
        reset = true;
      },
      [Exit]() {
        reset = false;
      },
    },
    async () => {
      await project_01.loadSolutions(fs);
      await project_02.loadSolutions(fs);
      await project_03.loadSolutions(fs);
      await project_05.loadSolutions(fs);
    }
  );
};

export const loadSamples = async (fs: FileSystem) => {
  await samples.loadSamples(fs);
};

export const loaders = {
  resetFiles,
  loadSolutions,
  loadSamples,
};

export default loaders;