import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { NoteGroupe } from '../entities/NoteGroupe';
import { CommentaireGlobal } from '../entities/CommentaireGlobal';
import { NotationFinalisee } from '../entities/NotationFinalisee';
import { GrilleNotation } from '../entities/GrilleNotation';
import { CritereNotation } from '../entities/CritereNotation';
interface Critere {
  id: number;
  nom: string;
  poids: number; // Ex: 50 pour 50%
  description?: string;
  typeEvaluation: 'groupe' | 'individuel';
  grilleId: string;
}
interface Grille {
  id: string;
  titre: string;
  type: 'livrable' | 'rapport' | 'soutenance';
  criteres: Critere[];
  ponderationGlobale: number; // Ex: 0.5 pour 50%
  validee: boolean;
  description?: string;
}
export class NotationService {
  private noteRepository: Repository<NoteGroupe>;
  private commentaireRepository: Repository<CommentaireGlobal>;
  private notationFinaliseeRepository: Repository<NotationFinalisee>;
  private grilleRepository: Repository<GrilleNotation>;

  constructor() {
    this.noteRepository = AppDataSource.getRepository(NoteGroupe);
    this.commentaireRepository = AppDataSource.getRepository(CommentaireGlobal);
    this.notationFinaliseeRepository = AppDataSource.getRepository(NotationFinalisee);
    this.grilleRepository = AppDataSource.getRepository(GrilleNotation);
  }

  async getNotationGroupe(projectId: string, groupId: string) {
    const [notes, commentairesGlobaux, notationFinalisee] = await Promise.all([
      this.noteRepository.find({
        where: { projectId, groupId }
      }),
      this.commentaireRepository.find({
        where: { projectId, groupId }
      }),
      this.notationFinaliseeRepository.findOne({
        where: { projectId, groupId }
      }),
      
    ]);
 
    return {
      notes,
      commentairesGlobaux,
      commentaireProjet: notationFinalisee?.commentaireProjet,
      noteFinale: notationFinalisee?.noteFinale,
      notationFinalisee: notationFinalisee
    };
  }

  async saveNoteCritere(projectId: string, groupId: string, data: any): Promise<NoteGroupe> {
    let note = await this.noteRepository.findOne({
      where: {
        projectId,
        groupId,
        grilleId: data.grilleId,
        critereId: data.critereId,
        studentId: data.studentId || null
      }
    });

    if (note) {
      note.note = data.note;
      note.commentaire = data.commentaire;
    } else {
      note = this.noteRepository.create({
        projectId,
        groupId,
        grilleId: data.grilleId,
        critereId: data.critereId,
        studentId: data.studentId,
        note: data.note,
        commentaire: data.commentaire
      });
    }

    return await this.noteRepository.save(note);
  }

  async saveCommentaireGlobal(projectId: string, groupId: string, data: any): Promise<CommentaireGlobal> {
    let commentaire = await this.commentaireRepository.findOne({
      where: {
        projectId,
        groupId,
        grilleId: data.grilleId
      }
    });

    if (commentaire) {
      commentaire.commentaire = data.commentaire;
    } else {
      commentaire = this.commentaireRepository.create({
        projectId,
        groupId,
        grilleId: data.grilleId,
        commentaire: data.commentaire
      });
    }

    return await this.commentaireRepository.save(commentaire);
  }

 async finalizeNotation(projectId: string, groupId: string, data: any, userId: string): Promise<NotationFinalisee> {
  // Récupérer les grilles de notation (à implémenter selon votre système)
  const grilles = await this.getGrillesForProject(projectId); 
  
  const noteFinale = this.calculateNoteFinale(data.notes, grilles);

  let notation = await this.notationFinaliseeRepository.findOne({
    where: { projectId, groupId }
  });

  if (notation) {
    notation.commentaireProjet = data.commentaireProjet;
    notation.noteFinale = noteFinale;
  } else {
    notation = this.notationFinaliseeRepository.create({
      projectId,
      groupId,
      commentaireProjet: data.commentaireProjet,
      noteFinale,
    });
  }

  return await this.notationFinaliseeRepository.save(notation);
}
  async getGradingGridByProjectAndGroup (projectId: string, groupId: string): Promise<any>  {
    const notes = await this.noteRepository.find({
      where: { projectId, groupId }
    });
    const commentairesGlobaux = await this.commentaireRepository.find({
      where: { projectId, groupId }
    });
    const notationFinalisee = await this.notationFinaliseeRepository.findOne({
      where: { projectId, groupId }
    });
    const grillesValidees = await this.grilleRepository.find({
      where: { projectId, validee: true },
      relations: ['criteres']
    });

    return {
      notes,
      commentairesGlobaux,
      commentaireProjet: notationFinalisee?.commentaireProjet,
      grillesValidees,
      notationFinalisee: !!notationFinalisee
    };
  }

  async publishProjectGrades(projectId: string): Promise<any> {
    
    // Logique pour publier les notes d'un projet
    // Cela pourrait impliquer de mettre à jour un champ dans la base de données ou d'envoyer des notifications
    return { message: 'Notes publiées avec succès.' };
  }
  async validateSpecificGrille(projectId: string, groupId: string, grilleId: string): Promise<any> {
    const grille = await this.grilleRepository.findOne({
      where: { id: grilleId, projectId }
    });

    if (!grille) {
      throw new Error('Grille not found');
    }

    grille.validee = true;
    return await this.grilleRepository.save(grille);
  }
private calculateNoteFinale(notes: any[], grilles: Grille[]): number {
  if (!notes || notes.length === 0) return 0;

  // Étape 1: Organiser les notes par critère
  const notesParCritere: Record<string, {
    notes: any[],
    type: 'groupe' | 'individuel',
    poids: number
  }> = {};

  notes.forEach(note => {
    const grille = grilles.find(g => g.id === note.grilleId);
    const critere = grille?.criteres.find(c => c.id === note.critereId);
    
    const key = `${note.grilleId}-${note.critereId}`;
    
    if (!notesParCritere[key]) {
      notesParCritere[key] = {
        notes: [],
        type: critere?.typeEvaluation || 'groupe',
        poids: critere?.poids || 1
      };
    }
    
    notesParCritere[key].notes.push(note);
  });

  // Étape 2: Calculer les moyennes par critère
  let totalPonderation = 0;
  let sommeNotesPonderees = 0;

  Object.values(notesParCritere).forEach(({notes, type, poids}) => {
    if (notes.length === 0) return;

    let moyenneCritere = 0;

    if (type === 'individuel') {
      // Calculer la moyenne des notes individuelles
      const sum = notes.reduce((acc, n) => acc + parseFloat(n.note), 0);
      moyenneCritere = sum / notes.length;
    } else {
      // Prendre directement la note de groupe (normalement une seule note)
      moyenneCritere = parseFloat(notes[0].note);
    }

    sommeNotesPonderees += moyenneCritere * (poids / 100);
    totalPonderation += poids / 100;
  });

  // Étape 3: Calculer la note finale pondérée
  return totalPonderation > 0 ? (sommeNotesPonderees / totalPonderation) * 20 : 0;
}
async getGrillesForProject(projectId: string): Promise<Grille[]> {
  try {
    // 1. Récupérer les grilles associées au projet
    const grilles = await this.grilleRepository.find({
      where: { projectId },
      relations: ['criteres']
    });

    // 2. Vérifier le format et compléter si nécessaire
    return grilles.map(grille => ({
      id: grille.id,
      titre: grille.titre,
      type: grille.type,
      criteres: grille.criteres.map(critere => ({
        id: critere.id,
        nom: critere.nom,
        poids: critere.poids || 100, // Valeur par défaut
        description: critere.description,
        typeEvaluation: critere.typeEvaluation || 'groupe', // Valeur par défaut
        grilleId: critere.grilleId
      })),
      ponderationGlobale: grille.ponderationGlobale || 1, // Valeur par défaut
      validee: grille.validee || false,
      description: grille.description
    }));
    
  } catch (error) {
    console.error('Erreur lors de la récupération des grilles:', error);
    throw new Error('Impossible de charger les grilles de notation');
  }



  // POST /api/notation
 


}

async saveNotation(projectId: string, groupId: string, data: any): Promise<any> {
    const repo = AppDataSource.getRepository(NotationFinalisee);
    const notation = repo.create({ projectId, groupId, ...data });
    await repo.save(notation);
    return notation;
  }

  async updateNoteCritere(projectId: string, groupId: string, data: any): Promise<NoteGroupe> {
    let note = await this.noteRepository.findOne({
      where: {
        projectId,
        groupId,
        grilleId: data.grilleId,
        critereId: data.critereId,
        studentId: data.studentId || null
      }
    });

    if (note) {
      // Mise à jour de la note existante
      note.note = data.note;
      note.commentaire = data.commentaire;
      note.updatedAt = new Date(); // Si vous avez un champ updatedAt
    } else {
      // Création d'une nouvelle note
      note = this.noteRepository.create({
        projectId,
        groupId,
        grilleId: data.grilleId,
        critereId: data.critereId,
        studentId: data.studentId || null, // Assurer la cohérence avec null
        note: data.note,
        commentaire: data.commentaire
      });
    }

    return await this.noteRepository.save(note);
  }

}
