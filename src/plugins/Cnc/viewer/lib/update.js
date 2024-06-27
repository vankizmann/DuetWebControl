/**
 * @fileoverview State Updater
 */

//Imports
import parser from '../parsers/index';
import state from './state';

export const file = async (file, progress) =>
{
  //Remove existing meshes
  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      state.scene.remove(mesh);
    }
  }

  //Parse and load
  const meshes = await parser(file, progress);

  //Save for later manipulation
  state.meshes = meshes;

  //Add to scene
  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      state.scene.add(mesh);
    }
  }
};

export const plane = ({X, Y}) =>
{
  state.plane.scale.set(X, Y, 1);
};

export const position = ({X, Y, Z}) =>
{
  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      mesh.position.set(X, Y, Z);
    }
  }
};

export const drill = ({X, Y, Z}) =>
{
  state.drill.material.transparent = true;
  state.drill.material.opacity = 0.7;

  state.drill.position.x = X * 0.1;
  state.drill.position.y = (Z * 0.1) + 1;
  state.drill.position.z = Y * 0.1;
};

export const rotation = ({X, Y, Z}) =>
{
  //Convert to radians
  const scalar = Math.PI / 180;
  X *= scalar;
  Y *= scalar;
  Z *= scalar;

  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      mesh.rotation.set(X, Y, Z);
    }
  }
};

export const scale = ({X, Y, Z}) =>
{
  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      mesh.scale.set(X, Y, Z);
    }
  }
};
export const theme = theme =>
{
  //Update background
  state.scene.background.set(theme.background);

  //Update plane
  state.plane.material.color.set(theme.plane);

  //Update meshes
  if (state.meshes != null)
  {
    for (const mesh of state.meshes)
    {
      //If the mesh lacks the color metadata property or the color doesn't exist, use the primary color
      if (mesh.metadata.color == null || !Object.keys(theme).includes(mesh.metadata.color))
      {
        mesh.material.color.set(theme.primary);
      }
      //Otherwise set the mesh color to the primary color
      else
      {
        mesh.material.color.set(theme[mesh.metadata.color]);
      }
    }
  }
};

export const camera = (X = 0, Y = -50, Z = 50) =>
{
    state.controls.reset();
    state.camera.position.set(X, Z, Y);
    state.controls.update();
}
