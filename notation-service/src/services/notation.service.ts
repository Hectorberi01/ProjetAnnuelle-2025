import { AppDataSource } from "../config/database";
import { Notation } from "../entities/Notation";
import { Criterion } from "../entities/Critere";

export class NotationService {
   notationRepo = AppDataSource.getRepository(Notation);
   criterionRepo = AppDataSource.getRepository(Criterion);

  // Créer une grille d'évaluation
   async create(data: Partial<Notation>) {
    const notation = this.notationRepo.create(data);
    return await this.notationRepo.save(notation);
  }

  // Récupérer toutes les grilles
   async getAll() {
    return await this.notationRepo.find({ relations: ["criteria"] });
  }

  // Récupérer une grille par ID
   async getById(id: number) {
    return await this.notationRepo.findOne({
      where: { id },
      relations: ["criteria"],
    });
  }

  // Supprimer une grille
   async delete(id: number) {
    await this.notationRepo.delete(id);
  }

  // Mettre à jour une grille d'évaluation et ses critères
   async update(id: number, data: Partial<Notation>) {
    const notation = await this.notationRepo.findOne({
      where: { id },
      relations: ["criteria"],
    });

    if (!notation) throw new Error("Notation introuvable");

   
    Object.assign(notation, data);


    if (data.criteria) {
      
      await this.criterionRepo.delete({ grid: { id } as Notation });

    
      const newCriteria = data.criteria.map((crit) =>
        this.criterionRepo.create({ ...crit, grid: notation })
      );

      notation.criteria = await this.criterionRepo.save(newCriteria);
    }

    return await this.notationRepo.save(notation);
  }
}
