import base, { file } from 'paths.macro';
import formatActionType from '../../redux/formatActionType';

export const RECEIVE_ENTITIES = formatActionType(
  'RECEIVE_ENTITIES',
  base,
  file
);
