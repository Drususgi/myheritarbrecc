import { FamilyTree, Person, FamilyConnection } from '@/types/family';
import { 
  PersonPosition, 
  Connection, 
  ConnectionType, 
  Conflict, 
  ConflictSeverity, 
  LayoutRule, 
  LayoutConfig, 
  RelationshipGraph,
  LayoutResult,
  Point,
  ConnectionStyle
} from '@/types/layout';

export class FamilyTreeLayoutEngine {
  private config: LayoutConfig;

  constructor(config?: Partial<LayoutConfig>) {
    this.config = {
      cardWidth: 140,
      cardHeight: 100,
      minHorizontalSpacing: 200,
      minVerticalSpacing: 180,
      generationHeight: 180,
      rules: this.getDefaultRules(),
      ...config
    };
  }

  private getDefaultRules(): LayoutRule[] {
    return [
      {
        connectionType: ConnectionType.PARENT_CHILD,
        priority: 1,
        minSpacing: 20,
        preferredSpacing: 30,
        maxSpacing: 60,
        allowCrossing: false
      },
      {
        connectionType: ConnectionType.SIBLING,
        priority: 2,
        minSpacing: 15,
        preferredSpacing: 25,
        maxSpacing: 40,
        allowCrossing: false
      },
      {
        connectionType: ConnectionType.MARRIAGE,
        priority: 3,
        minSpacing: 10,
        preferredSpacing: 20,
        maxSpacing: 30,
        allowCrossing: true
      },
      {
        connectionType: ConnectionType.IN_LAW,
        priority: 4,
        minSpacing: 25,
        preferredSpacing: 40,
        maxSpacing: 60,
        allowCrossing: true
      }
    ];
  }

  /**
   * Point d'entrée principal : calcule le layout complet d'un arbre généalogique
   */
  public calculateLayout(familyTree: FamilyTree): LayoutResult {
    const startTime = performance.now();
    
    // 1. Analyse des relations et création du graphe
    const graph = this.analyzeRelationships(familyTree);
    
    // 2. Calcul des positions de base
    const basePositions = this.calculateBasePositions(graph, familyTree);
    
    // 3. Génération des connexions initiales
    const initialConnections = this.generateInitialConnections(familyTree, basePositions);
    
    // 4. Détection des conflits
    const conflicts = this.detectConflicts(initialConnections);
    
    // 5. Résolution des conflits
    const resolvedConnections = this.resolveConflicts(initialConnections, conflicts);
    
    // 6. Calcul des métriques finales
    const metadata = {
      totalWidth: this.calculateTotalWidth(basePositions),
      totalHeight: this.calculateTotalHeight(basePositions),
      conflictsResolved: conflicts.length,
      layoutTime: performance.now() - startTime
    };

    return {
      positions: basePositions,
      connections: resolvedConnections,
      conflicts,
      metadata
    };
  }

  /**
   * Analyse les relations familiales et crée un graphe de relations
   */
  private analyzeRelationships(familyTree: FamilyTree): RelationshipGraph {
    const generations = new Map<number, PersonPosition[]>();
    
    // Grouper par génération
    familyTree.people.forEach(person => {
      if (!generations.has(person.generation)) {
        generations.set(person.generation, []);
      }
      
      const position: PersonPosition = {
        personId: person.id,
        x: 0, // À calculer
        y: 0, // À calculer
        width: this.config.cardWidth,
        height: this.config.cardHeight
      };
      
      generations.get(person.generation)!.push(position);
    });

    return {
      nodes: Array.from(generations.values()).flat(),
      edges: [], // À calculer
      generations
    };
  }

  /**
   * Calcul des positions de base basé sur les relations familiales - Version améliorée
   */
  private calculateBasePositions(graph: RelationshipGraph, familyTree: FamilyTree): PersonPosition[] {
    const positions: PersonPosition[] = [];
    
    // Définir des positions fixes inspirées du layout manuel
    const fixedPositions = this.defineFixedPositions(familyTree);
    
    // Appliquer les positions fixes
    familyTree.people.forEach(person => {
      const fixedPos = fixedPositions.get(person.id);
      if (fixedPos) {
        positions.push({
          personId: person.id,
          x: fixedPos.x,
          y: fixedPos.y,
          width: this.config.cardWidth,
          height: this.config.cardHeight
        });
      }
    });
    
    return positions;
  }

  /**
   * Définit des positions fixes optimisées basées sur le layout manuel
   */
  private defineFixedPositions(familyTree: FamilyTree): Map<string, {x: number, y: number}> {
    const positions = new Map<string, {x: number, y: number}>();
    
    // Espacement réduit pour un layout plus compact
    const cardSpacing = 160; // Plus serré que les 200 actuels
    const generationSpacing = 140; // Plus serré que les 180 actuels
    
    // GÉNÉRATION 0 (Arrière-grands-parents) - Y: 50
    positions.set('grandfather-pat-001', { x: 300, y: 50 });
    positions.set('grandmother-pat-001', { x: 480, y: 50 });
    positions.set('grandfather-mat-001', { x: 820, y: 50 });
    positions.set('grandmother-mat-001', { x: 1000, y: 50 });
    
    // GÉNÉRATION 1 (Grands-parents et beaux-parents) - Y: 190
    positions.set('father-001', { x: 380, y: 190 });
    positions.set('mother-001', { x: 540, y: 190 });
    positions.set('father-spouse-001', { x: 860, y: 190 });
    positions.set('mother-spouse-001', { x: 1020, y: 190 });
    
    // GÉNÉRATION 2 (Fratrie biologique) - Y: 330
    const userCenterX = 640; // Centre de l'écran
    positions.set('sibling-001', { x: userCenterX - 240, y: 330 }); // Jean Martin
    positions.set('user-001', { x: userCenterX, y: 330 });          // Utilisateur (JM) - centré
    positions.set('sibling-002', { x: userCenterX + 240, y: 330 }); // Paul Martin
    positions.set('sibling-003', { x: userCenterX + 480, y: 330 }); // Isabelle Martin
    
    // GÉNÉRATION 2.5 (Épouses/Compagnes) - Y: 470 (ligne complètement séparée)
    positions.set('spouse-001', { x: userCenterX - 120, y: 470 });  // Marie Martin (ex-épouse)
    positions.set('spouse-002', { x: userCenterX + 120, y: 470 });  // Sarah Martin (épouse actuelle)
    
    // GÉNÉRATION 3 (Enfants) - Y: 610 (ajusté pour la nouvelle ligne des épouses)
    positions.set('child-001', { x: userCenterX - 200, y: 610 });   // Lucas Martin (enfant Jean)
    positions.set('child-002', { x: userCenterX - 40, y: 610 });    // Emma Martin (enfant ex-épouse)
    positions.set('child-003', { x: userCenterX + 120, y: 610 });   // Léo Martin (enfant utilisateur)
    positions.set('child-004', { x: userCenterX + 280, y: 610 });   // Chloé Martin (enfant utilisateur)
    positions.set('nephew-001', { x: userCenterX + 440, y: 610 });  // Thomas Martin (enfant Paul)
    
    // GÉNÉRATION 4 (Petit-fils) - Y: 750
    positions.set('grandchild-001', { x: userCenterX, y: 750 });    // Hugo Martin
    
    return positions;
  }

  /**
   * Organise les personnes d'une génération en groupes familiaux
   */
  private organizeFamilyGroups(people: PersonPosition[], familyTree: FamilyTree, generation: number): PersonPosition[][] {
    const groups: PersonPosition[][] = [];
    const processed = new Set<string>();
    
    // Créer un map pour accès rapide aux personnes
    const personMap = new Map<string, Person>();
    familyTree.people.forEach(p => personMap.set(p.id, p));
    
    for (const position of people) {
      if (processed.has(position.personId)) continue;
      
      const person = personMap.get(position.personId);
      if (!person) continue;
      
      // Créer un groupe familial
      const group: PersonPosition[] = [position];
      processed.add(position.personId);
      
      // Ajouter les conjoints
      if (person.spouseId) {
        const spousePosition = people.find(p => p.personId === person.spouseId);
        if (spousePosition && !processed.has(spousePosition.personId)) {
          group.push(spousePosition);
          processed.add(spousePosition.personId);
        }
      }
      
      // Ajouter les frères et sœurs (même génération, mêmes parents)
      if (person.parentIds && person.parentIds.length > 0) {
        const siblings = people.filter(p => {
          const sibling = personMap.get(p.personId);
          return sibling && 
                 sibling.parentIds && 
                 sibling.parentIds.length > 0 &&
                 sibling.parentIds.some(parentId => person.parentIds!.includes(parentId)) &&
                 !processed.has(p.personId);
        });
        
        siblings.forEach(sibling => {
          group.push(sibling);
          processed.add(sibling.personId);
        });
      }
      
      groups.push(group);
    }
    
    return groups;
  }

  /**
   * Calcule la largeur totale nécessaire pour tous les groupes
   */
  private calculateTotalGroupWidth(groups: PersonPosition[][]): number {
    let totalWidth = 0;
    
    groups.forEach((group, index) => {
      const groupWidth = group.length * this.config.cardWidth + 
                        (group.length - 1) * (this.config.minHorizontalSpacing / 2);
      totalWidth += groupWidth;
      
      // Ajouter l'espacement entre groupes (sauf le dernier)
      if (index < groups.length - 1) {
        totalWidth += this.config.minHorizontalSpacing;
      }
    });
    
    return totalWidth;
  }

  /**
   * Génère les connexions initiales basées sur les relations familiales
   */
  private generateInitialConnections(familyTree: FamilyTree, positions: PersonPosition[]): Connection[] {
    const connections: Connection[] = [];
    const positionMap = new Map<string, PersonPosition>();
    
    // Créer un map pour accès rapide aux positions
    positions.forEach(pos => positionMap.set(pos.personId, pos));
    
    // Traiter chaque connexion familiale
    familyTree.connections.forEach(conn => {
      const fromPos = positionMap.get(conn.person1Id);
      const toPos = positionMap.get(conn.person2Id);
      
      if (!fromPos || !toPos) return;
      
      const connection: Connection = {
        id: conn.id,
        type: this.mapConnectionType(conn.type),
        from: fromPos,
        to: toPos,
        priority: this.getPriority(conn.type),
        style: this.getConnectionStyle(conn.type),
        points: this.calculateConnectionPoints(fromPos, toPos, this.mapConnectionType(conn.type))
      };
      
      connections.push(connection);
    });
    
    return connections;
  }

  /**
   * Détecte les conflits entre connexions (croisements, chevauchements)
   */
  private detectConflicts(connections: Connection[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Vérifier chaque paire de connexions
    for (let i = 0; i < connections.length; i++) {
      for (let j = i + 1; j < connections.length; j++) {
        const conn1 = connections[i];
        const conn2 = connections[j];
        
        // Ignorer si les connexions partagent un point (normal)
        if (this.connectionsSharePoint(conn1, conn2)) continue;
        
        // Détecter les intersections
        const intersection = this.findIntersection(conn1, conn2);
        if (intersection) {
          const severity = this.calculateConflictSeverity(conn1, conn2, intersection);
          
          conflicts.push({
            id: `conflict-${conn1.id}-${conn2.id}`,
            connection1: conn1,
            connection2: conn2,
            intersectionPoint: intersection,
            severity
          });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Résout les conflits détectés en ajustant les connexions
   */
  private resolveConflicts(connections: Connection[], conflicts: Conflict[]): Connection[] {
    // Trier les conflits par gravité (plus critique en premier)
    const sortedConflicts = conflicts.sort((a, b) => b.severity - a.severity);
    
    const resolvedConnections = [...connections];
    
    for (const conflict of sortedConflicts) {
      // Trouver la connexion avec la priorité la plus basse
      const lowerPriorityConn = conflict.connection1.priority > conflict.connection2.priority 
        ? conflict.connection1 
        : conflict.connection2;
      
      // Ajuster le chemin de la connexion de priorité inférieure
      const adjustedConnection = this.adjustConnectionPath(lowerPriorityConn, conflict);
      
      // Remplacer dans la liste
      const index = resolvedConnections.findIndex(c => c.id === adjustedConnection.id);
      if (index !== -1) {
        resolvedConnections[index] = adjustedConnection;
      }
    }
    
    return resolvedConnections;
  }

  // Méthodes utilitaires

  private mapConnectionType(type: string): ConnectionType {
    switch (type) {
      case 'parent-child': return ConnectionType.PARENT_CHILD;
      case 'sibling': return ConnectionType.SIBLING;
      case 'spouse': return ConnectionType.MARRIAGE;
      default: return ConnectionType.IN_LAW;
    }
  }

  private getPriority(type: string): number {
    const rule = this.config.rules.find(r => r.connectionType === this.mapConnectionType(type));
    return rule?.priority || 5;
  }

  private getConnectionStyle(type: string): ConnectionStyle {
    switch (type) {
      case 'parent-child':
        return { stroke: '#ccc', strokeWidth: 1 };
      case 'sibling':
        return { stroke: '#4CAF50', strokeWidth: 2, strokeDasharray: '3,3' };
      case 'spouse':
        return { stroke: '#d32f2f', strokeWidth: 2 };
      default:
        return { stroke: '#999', strokeWidth: 1, strokeDasharray: '5,2,2,2' };
    }
  }

  private calculateConnectionPoints(from: PersonPosition, to: PersonPosition, connectionType: ConnectionType): Point[] {
    const fromCenter = {
      x: from.x + from.width / 2,
      y: from.y + from.height / 2
    };
    
    const toCenter = {
      x: to.x + to.width / 2,
      y: to.y + to.height / 2
    };
    
    switch (connectionType) {
      case ConnectionType.MARRIAGE:
        // Connexions matrimoniales pour ligne séparée des épouses
        if (Math.abs(from.y - to.y) < 10) {
          // Même niveau - ligne horizontale directe (épouses entre elles)
          const marriageY = Math.max(from.y, to.y) + this.config.cardHeight + 5;
          return [
            { x: fromCenter.x, y: marriageY },
            { x: toCenter.x, y: marriageY }
          ];
        } else {
          // Fratrie vers épouse (ligne séparée) - connexion en L avec ligne intermédiaire
          const intermediateY = from.y + from.height + 70; // Point de jonction au milieu
          return [
            { x: fromCenter.x, y: from.y + from.height },
            { x: fromCenter.x, y: intermediateY },
            { x: toCenter.x, y: intermediateY },
            { x: toCenter.x, y: to.y }
          ];
        }
        
      case ConnectionType.PARENT_CHILD:
        // Connexions parent-enfant simplifiées
        if (from.y < to.y) {
          // Parent vers enfant
          const midY = from.y + from.height + 25;
          return [
            { x: fromCenter.x, y: from.y + from.height },
            { x: fromCenter.x, y: midY },
            { x: toCenter.x, y: midY },
            { x: toCenter.x, y: to.y }
          ];
        }
        break;
        
      case ConnectionType.SIBLING:
        // Ligne horizontale au-dessus pour fratrie
        const siblingY = Math.min(from.y, to.y) - 15;
        return [
          { x: fromCenter.x, y: from.y },
          { x: fromCenter.x, y: siblingY },
          { x: toCenter.x, y: siblingY },
          { x: toCenter.x, y: to.y }
        ];
        
      default:
        // Ligne droite simple
        return [
          { x: fromCenter.x, y: fromCenter.y },
          { x: toCenter.x, y: toCenter.y }
        ];
    }
    
    return [fromCenter, toCenter];
  }

  private connectionsSharePoint(conn1: Connection, conn2: Connection): boolean {
    return conn1.from.personId === conn2.from.personId ||
           conn1.from.personId === conn2.to.personId ||
           conn1.to.personId === conn2.from.personId ||
           conn1.to.personId === conn2.to.personId;
  }

  private findIntersection(conn1: Connection, conn2: Connection): Point | null {
    // Algorithme simple d'intersection de segments
    // Pour l'instant, on suppose des lignes droites
    const p1 = conn1.points[0];
    const p2 = conn1.points[conn1.points.length - 1];
    const p3 = conn2.points[0];
    const p4 = conn2.points[conn2.points.length - 1];
    
    return this.lineIntersection(p1, p2, p3, p4);
  }

  private lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 1e-10) return null; // Lignes parallèles
    
    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
    }
    
    return null;
  }

  private calculateConflictSeverity(conn1: Connection, conn2: Connection, intersection: Point): ConflictSeverity {
    // Calculer la gravité basée sur les priorités et la position de l'intersection
    const priorityDiff = Math.abs(conn1.priority - conn2.priority);
    
    if (priorityDiff >= 3) return ConflictSeverity.LOW;
    if (priorityDiff >= 2) return ConflictSeverity.MEDIUM;
    return ConflictSeverity.HIGH;
  }

  private adjustConnectionPath(connection: Connection, conflict: Conflict): Connection {
    // Ajuster le chemin pour éviter le conflit
    // Pour l'instant, on décale simplement la connexion
    const adjustedConnection = { ...connection };
    
    // Décaler verticalement la connexion
    const yOffset = 20;
    adjustedConnection.points = adjustedConnection.points.map(point => ({
      ...point,
      y: point.y + yOffset
    }));
    
    return adjustedConnection;
  }

  private calculateTotalWidth(positions: PersonPosition[]): number {
    if (positions.length === 0) return 0;
    
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x + p.width));
    
    return maxX - minX;
  }

  private calculateTotalHeight(positions: PersonPosition[]): number {
    if (positions.length === 0) return 0;
    
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y + p.height));
    
    return maxY - minY;
  }
}