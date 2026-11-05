import React from 'react';
import { LeatherArmchairModel, type ModelCustomizationProps } from './LeatherArmchairModel';
import { LeatherSofaModel } from './LeatherSofaModel';
import { BoucleSofaModel } from './BoucleSofaModel';
import { VelvetAccentChairModel } from './VelvetAccentChairModel';
import { OvalDiningSetModel } from './OvalDiningSetModel';
import { CoffeeTableModel } from './CoffeeTableModel';
import { SideTableModel } from './SideTableModel';
import { CurtainCreamModel } from './CurtainCreamModel';
import { CurtainTaupeModel } from './CurtainTaupeModel';

export type ProceduralModelKey =
  | 'leather-armchair'
  | 'leather-sofa'
  | 'boucle-sofa'
  | 'velvet-accent-chair'
  | 'oval-dining-set'
  | 'coffee-table'
  | 'side-table'
  | 'curtain-cream'
  | 'curtain-taupe';

export const PROCEDURAL_MODELS: Record<string, React.FC<ModelCustomizationProps>> = {
  'leather-armchair': LeatherArmchairModel,
  'leather-sofa': LeatherSofaModel,
  'boucle-sofa': BoucleSofaModel,
  'velvet-accent-chair': VelvetAccentChairModel,
  'oval-dining-set': OvalDiningSetModel,
  'coffee-table': CoffeeTableModel,
  'side-table': SideTableModel,
  'curtain-cream': CurtainCreamModel,
  'curtain-taupe': CurtainTaupeModel,
};

export function getProceduralModel(idOrKey: string): React.FC<ModelCustomizationProps> {
  return PROCEDURAL_MODELS[idOrKey] || LeatherArmchairModel;
}

export {
  LeatherArmchairModel,
  LeatherSofaModel,
  BoucleSofaModel,
  VelvetAccentChairModel,
  OvalDiningSetModel,
  CoffeeTableModel,
  SideTableModel,
  CurtainCreamModel,
  CurtainTaupeModel,
};
