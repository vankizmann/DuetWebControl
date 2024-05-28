/**
 * @fileoverview File Parsers
 */

//Imports
import {FileFormats} from 'unified-3d-loader';
import gcodeParser from './gcode';
// import unifiedParser from './unified';

//Export
export default async (file, extension, transfer, theme, progress) =>
{
  return gcodeParser(file, transfer, theme, progress);
};