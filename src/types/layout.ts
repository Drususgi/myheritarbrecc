// Types pour le moteur de layout automatique des arbres généalogiques

export interface PersonPosition {
  personId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  from: PersonPosition;
  to: PersonPosition;
  priority: number;
  style: ConnectionStyle;
  points: Point[];
}

export enum ConnectionType {
  PARENT_CHILD = 'parent-child',
  SIBLING = 'sibling',
  MARRIAGE = 'marriage',
  IN_LAW = 'in-law'
}

export interface ConnectionStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Conflict {
  id: string;
  connection1: Connection;
  connection2: Connection;
  intersectionPoint: Point;
  severity: ConflictSeverity;
}

export enum ConflictSeverity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export interface LayoutRule {
  connectionType: ConnectionType;
  priority: number;
  minSpacing: number;
  preferredSpacing: number;
  maxSpacing: number;
  allowCrossing: boolean;
}

export interface LayoutConfig {
  cardWidth: number;
  cardHeight: number;
  minHorizontalSpacing: number;
  minVerticalSpacing: number;
  generationHeight: number;
  rules: LayoutRule[];
}

export interface RelationshipGraph {
  nodes: PersonPosition[];
  edges: Connection[];
  generations: Map<number, PersonPosition[]>;
}

export interface LayoutResult {
  positions: PersonPosition[];
  connections: Connection[];
  conflicts: Conflict[];
  metadata: {
    totalWidth: number;
    totalHeight: number;
    conflictsResolved: number;
    layoutTime: number;
  };
}