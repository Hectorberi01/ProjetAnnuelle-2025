import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { NoteGroupe } from '../entities/NoteGroupe';
import { CommentaireGlobal } from '../entities/CommentaireGlobal';
import { NotationFinalisee } from '../entities/NotationFinalisee';
import { GrilleNotation } from '../entities/GrilleNotation';
import { CritereNotation } from '../entities/CritereNotation';

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
    const [notes, commentairesGlobaux, notationFinalisee, grillesValidees] = await Promise.all([
      this.noteRepository.find({
        where: { projectId, groupId }
      }),
      this.commentaireRepository.find({
        where: { projectId, groupId }
      }),
      this.notationFinaliseeRepository.findOne({
        where: { projectId, groupId }
      }),
      this.grilleRepository.find({
        where: { projectId, validee: true },
        relations: ['criteres']
      })
    ]);

    return {
      notes,
      commentairesGlobaux,
      commentaireProjet: notationFinalisee?.commentaireProjet,
      grillesValidees,
      notationFinalisee: !!notationFinalisee
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
    // Calculer la note finale
    const noteFinale = this.calculateNoteFinale(data.notes);

    let notation = await this.notationFinaliseeRepository.findOne({
      where: { projectId, groupId }
    });

    if (notation) {
      notation.commentaireProjet = data.commentaireProjet;
      notation.noteFinale = noteFinale;
      notation.finaliseeBy = userId;
    } else {
      notation = this.notationFinaliseeRepository.create({
        projectId,
        groupId,
        commentaireProjet: data.commentaireProjet,
        noteFinale,
        finaliseeBy: userId
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
  private calculateNoteFinale(notes: any[]): number {
    // Logique de calcul de la note finale basée sur les pondérations
    // À adapter selon vos besoins spécifiques
    return 0;
  }
}