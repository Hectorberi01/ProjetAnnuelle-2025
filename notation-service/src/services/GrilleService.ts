import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { GrilleNotation } from '../entities/GrilleNotation';
import { CritereNotation } from '../entities/CritereNotation';

export class GrilleService {
  private grilleRepository: Repository<GrilleNotation>;
  private critereRepository: Repository<CritereNotation>;

  constructor() {
    this.grilleRepository = AppDataSource.getRepository(GrilleNotation);
    this.critereRepository = AppDataSource.getRepository(CritereNotation);
  }

  async getGrillesByProject(projectId: string): Promise<GrilleNotation[]> {
    return await this.grilleRepository.find({
      where: { projectId },
      relations: ['criteres'],
      order: { createdAt: 'DESC' }
    });
  }
 async deleteCritere(grilleId: string, critereId: string): Promise<void> {
  const grille = await this.grilleRepository.findOne({
    where: { id: grilleId },
    relations: ['criteres']
  });

  if (!grille) {
    throw new Error(`La grille avec l'ID ${grilleId} n'existe pas`);
  }

  const critere = await this.critereRepository.findOne({
   where: {
      id: Number(critereId),
      grilleId: grilleId  // si grilleId est un string dans l'entité, sinon mettre Number(grilleId)
    }
  });

  if (!critere) {
    throw new Error(`Le critère avec l'ID ${critereId} n'existe pas dans la grille ${grilleId}`);
  }

  await this.critereRepository.remove(critere);
}


  async createCritere(projectId: string, groupId: string, critereData: any): Promise<CritereNotation> {
    try {
      // 1. Vérifier que la grille existe
      const grille = await this.grilleRepository.findOne({
                where: { id: critereData.grille_id }
            });

            if (!grille) {
                throw new Error(`La grille avec l'ID ${critereData.grille_id} n'existe pas`);
            }

            // 2. Validation des données
            if (!critereData.nom || critereData.nom.trim() === '') {
                throw new Error('Le nom du critère est requis');
            }

            if (critereData.poids === undefined || critereData.poids === null || critereData.poids < 0) {
                throw new Error('Le poids du critère doit être un nombre positif');
            }

            if (!['groupe', 'individuel'].includes(critereData.typeEvaluation)) {
                throw new Error('Le type d\'évaluation doit être "groupe" ou "individuel"');
            }

            // 3. Créer le critère
            const critere = new CritereNotation();
            critere.grilleId = critereData.grille_id;
            critere.nom = critereData.nom.trim();
            critere.poids = critereData.poids;
            critere.description = critereData.description || null;
            critere.typeEvaluation = critereData.typeEvaluation;

            // 4. Sauvegarder en base
            const savedCritere = await this.critereRepository.save(critere);

            return savedCritere;

        } catch (error) {
            console.error('Erreur lors de la création du critère:', error);
            throw new Error(error instanceof Error ? error.message : 'Erreur inconnue lors de la création du critère');
        }
    }

     async getCriteresByGrille(grilleId: string): Promise<CritereNotation[]> {
        try {
            const criteres = await this.critereRepository.find({
                where: { grilleId: grilleId },
                order: { id: 'ASC' }
            });
            return criteres;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des critères');
        }
    }
  async createGrille(projectId: string, data: any): Promise<GrilleNotation> {
    const grille = this.grilleRepository.create({
      projectId,
      titre: data.titre,
      type: data.type,
      ponderationGlobale: data.ponderationGlobale,
      description: data.description
    });

    const savedGrille = await this.grilleRepository.save(grille);

    if (data.criteres && data.criteres.length > 0) {
      const criteres = data.criteres.map((critere: any) => 
        this.critereRepository.create({
          grilleId: savedGrille.id,
          nom: critere.nom,
          poids: critere.poids,
          description: critere.description,
          typeEvaluation: critere.typeEvaluation || 'groupe'
        })
      );

      await this.critereRepository.save(criteres);
    }

    const result = await this.grilleRepository.findOne({
      where: { id: savedGrille.id },
      relations: ['criteres']
    });
    if (!result) {
      throw new Error('Grille non trouvée après création');
    }
    return result;
  }

  async updateGrille(grilleId: string, data: any): Promise<GrilleNotation> {
    const grille = await this.grilleRepository.findOne({
      where: { id: grilleId },
      relations: ['criteres']
    });

    if (!grille) {
      throw new Error('Grille non trouvée');
    }

  

    // Mise à jour des propriétés de la grille
    grille.titre = data.titre;
    grille.type = data.type;
    grille.ponderationGlobale = data.ponderationGlobale;
    grille.description = data.description;

    await this.grilleRepository.save(grille);

    // Supprimer les anciens critères
    await this.critereRepository.delete({ grilleId });

    // Ajouter les nouveaux critères
    if (data.criteres && data.criteres.length > 0) {
      const criteres = data.criteres.map((critere: any) => 
        this.critereRepository.create({
          grilleId: grille.id,
          nom: critere.nom,
          poids: critere.poids,
          description: critere.description,
          typeEvaluation: critere.typeEvaluation || 'groupe'
        })
      );

      await this.critereRepository.save(criteres);
    }

    const updatedGrille = await this.grilleRepository.findOne({
      where: { id: grilleId },
      relations: ['criteres']
    });
    if (!updatedGrille) {
      throw new Error('Grille non trouvée après mise à jour');
    }
    return updatedGrille;
  }

  async deleteGrille(grilleId: string): Promise<void> {
    const grille = await this.grilleRepository.findOne({ where: { id: grilleId } });
    
    if (!grille) {
      throw new Error('Grille non trouvée');
    }

  

    await this.grilleRepository.remove(grille);
  }

  async validateGrille(grilleId: string): Promise<GrilleNotation> {
    const grille = await this.grilleRepository.findOne({ where: { id: grilleId } });
    
    if (!grille) {
      throw new Error('Grille non trouvée');
    }

    grille.validee = true;
    return await this.grilleRepository.save(grille);
  }

async updateCritere(grilleId: string, critereId: number, data: any): Promise<CritereNotation> {
  const critere = await this.critereRepository.findOneBy({ id: critereId, grilleId });

  if (!critere) {
    throw new Error(`Le critère ${critereId} n'existe pas dans la grille ${grilleId}`);
  }

  // Mise à jour des champs autorisés
  critere.nom = data.nom ?? critere.nom;
  critere.poids = data.poids ?? critere.poids;
  critere.description = data.description ?? critere.description;
  critere.typeEvaluation = data.typeEvaluation ?? critere.typeEvaluation;

  return await this.critereRepository.save(critere);
}



}