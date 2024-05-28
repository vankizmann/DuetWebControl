/**
 * @fileoverview GCODE Parser
 * Based on https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/GCodeLoader.js
 * @author tentone
 * @author joewalnes
 * @author wakeful-cloud
 */

import
{
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Line
} from 'three';
// import {spawn, Thread, Transfer, BlobWorker} from 'threads';

import GcodeWorker from './gcode.worker2';


//Export
export default (file, transfer, theme, progress) =>
{
  //Observe progress
  GcodeWorker.observeProgress().subscribe(progress);

  //Parse
  const {primaryVertices, secondaryVertices} = GcodeWorker.parse(file);

  //Theming
  const primaryMaterial = new LineBasicMaterial({color: theme.primary});
  const secondaryMaterial = new LineBasicMaterial({color: theme.secondary});

  //Line generation
  const primaryGeometry = new BufferGeometry();
  const secondaryGeometry = new BufferGeometry();

  primaryGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(primaryVertices, 3)
  );
  secondaryGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(secondaryVertices, 3)
  );

  const primaryLine = new Line(primaryGeometry, primaryMaterial);
  const secondaryLine = new Line(secondaryGeometry, secondaryMaterial);

  //Metadata
  primaryLine.metadata = {...primaryLine.metadata, color: 'primary'};
  secondaryLine.metadata = {...secondaryLine.metadata, color: 'secondary'};

  //Cleanup
  primaryGeometry.dispose();
  secondaryGeometry.dispose();
  primaryMaterial.dispose();
  secondaryMaterial.dispose();

  return [primaryLine, secondaryLine];
};