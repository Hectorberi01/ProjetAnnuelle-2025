import { AppDataSource } from "../config/database";
import { Deliverable } from "../entities/Deliverable";
import { ValidationRule } from '../entities/ValidationRule';


const ruleRepo = AppDataSource.getRepository(ValidationRule);
const deliverableRepo = AppDataSource.getRepository(Deliverable);

export class ValidationRuleService {
    constructor(){}
    
    public async addRuleToDeliverable(deliverableId: number, ruleData: any) {
        const deliverable = await deliverableRepo.findOne({ where: { id: deliverableId } });
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        const rule = ruleRepo.create({ ...ruleData, deliverable });
        return await ruleRepo.save(rule);
    }

    public async getRulesByDeliverableId(deliverableId: number) {
        return await ruleRepo.find({ where: { deliverable: { id: deliverableId } } });
    }

    public async updateRule(id: number, ruleData: any) {
        const rule = await ruleRepo.findOne({ where: { id } });
        if (!rule) {
            throw new Error('Rule not found');
        }

        Object.assign(rule, ruleData);
        return await ruleRepo.save(rule);
    }

    public async deleteRule(id: number) {
        const rule = await ruleRepo.findOne({ where: { id } });
        if (!rule) {
            return null;
        }
        return await ruleRepo.remove(rule);
    }

    public async getAllRules() {return await ruleRepo.find();}

    public async getRuleById(id: number) {
        return await ruleRepo.findOne({ where: { id } });
    }

    public async getRulesByType(type: 'maxSize' | 'requiredFile' | 'structure' | 'regex') {
        return await ruleRepo.find({ where: { type } });
    }
    
    public async getRulesByProjectId(projectId: number) {
        const deliverable = await deliverableRepo.findOne({ where: { projectId } });
        if (!deliverable) {
            throw new Error('Project not found');
        }
        // Récupérer les livrables associés au projet
        const deliverables = await deliverableRepo.find({ where: { projectId } });

        const rules: ValidationRule[] = [];
        // Récupérer les règles associées à ces livrables
        for (const deliverable of deliverables) {
            const rules = await ruleRepo.find({ where: { deliverable: { id: deliverable.id } } });
            rules.push(...rules);
        }
       
        return rules;
    }
}