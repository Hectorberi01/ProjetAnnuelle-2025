import { AppDataSource } from '../config/database';
import { Deliverable } from '../entities/Deliverable';
import { ValidationRule } from '../entities/ValidationRule';

const deliverableRepo = AppDataSource.getRepository(Deliverable);
const ruleRepo = AppDataSource.getRepository(ValidationRule);

export class DeliverableService {
    constructor() {}

    // Fonction pour créer un livrable
    public createDeliverable = async (data: any) => {
        const { name, description, deadline, allowLate, latePenaltyPerHour, projectId, rules } = data;
        const deliverable = deliverableRepo.create({name, description, deadline, allowLate, latePenaltyPerHour,projectId: projectId});
        // Créer un nouveau livrable
        const savedDeliverable = await deliverableRepo.save(deliverable);

        if (Array.isArray(rules)) {
            for (const rule of rules) {
              const newRule = ruleRepo.create({ ...rule, deliverable: savedDeliverable });
              await ruleRepo.save(newRule);
            }
          }

        return savedDeliverable;
    }

     // Récupérer tous les livrables d'un projet spécifique
    public async getProjectDeliverables(projectId: number) {
        return await deliverableRepo.find({where: { projectId },relations: ['rules','submissions'],});
    }

    // Fonction pour récupérer tous les livrables
    public async getAllDeliverables() {
        return await deliverableRepo.find({ relations: ['rules','submissions'] });
    }

    // Fonction pour récupérer un livrable par son ID
    public async getDeliverableById(id: number) {
        return await deliverableRepo.findOne({ where: { id }, relations: ['rules','submissions'] });
    }

    // Fonction pour mettre à jour un livrable
    public async updateDeliverable(id: number, data: any) {
        const deliverable = await deliverableRepo.findOne({ where: { id } });
        if (!deliverable) {throw new Error('Deliverable not found');}
        Object.assign(deliverable, data); // Mettre à jour les propriétés du livrable
        return await deliverableRepo.save(deliverable);// Enregistrer les modifications
    }

    // Fonction pour supprimer un livrable
    public async deleteDeliverable(id: number) {
        const deliverable = await deliverableRepo.findOne({ where: { id } });
        if (!deliverable) {return null;}
        return await deliverableRepo.remove(deliverable);
    }

    // Get all rules deliverables by specific deliverable ID
    public async getDeliverablesById(id: number) {
        const deliverable = await deliverableRepo.findOne({ where: { id }, relations: ['rules'] });
        // Check if the deliverable exists
        if (!deliverable?.rules) return null;
        return deliverable?.rules;
    }

    /** Création, modification, mise à jour et suppression d'une règles */

    // Fonction pour récupérer les règles de validation d'un livrable
    public async createValidationRule(data: any , deliverableId: number) {
        const { type, value } = data;

        const deliverable = await deliverableRepo.findOne({ where: { id: deliverableId } });
        if (!deliverable) { return null;}

        const rule = ruleRepo.create({ type, value, deliverable });
        return await ruleRepo.save(rule);
    }

    // Fonction pour mettre à jour une règle de validation
    public async updateValidationRule(id: number, data: any) {
        const rule = await ruleRepo.findOne({ where: { id } });
        if (!rule) { return null;}
        Object.assign(rule, data);
        return await ruleRepo.save(rule);
    }
    // Fonction pour supprimer une règle de validation
    public async deleteValidationRule(id: number) {
        const rule = await ruleRepo.findOne({ where: { id } });
        if (!rule) { return null;}
        return await ruleRepo.remove(rule);
    }
    // Fonction pour récupérer une règle de validation par son ID
    public async getValidationRuleById(id: number) {
        return await ruleRepo.findOne({ where: { id } });
    }
}
