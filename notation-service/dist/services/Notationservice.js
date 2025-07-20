"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotationService = void 0;
const database_1 = require("../config/database");
const NoteGroupe_1 = require("../entities/NoteGroupe");
const CommentaireGlobal_1 = require("../entities/CommentaireGlobal");
const NotationFinalisee_1 = require("../entities/NotationFinalisee");
const GrilleNotation_1 = require("../entities/GrilleNotation");
class NotationService {
    constructor() {
        this.noteRepository = database_1.AppDataSource.getRepository(NoteGroupe_1.NoteGroupe);
        this.commentaireRepository = database_1.AppDataSource.getRepository(CommentaireGlobal_1.CommentaireGlobal);
        this.notationFinaliseeRepository = database_1.AppDataSource.getRepository(NotationFinalisee_1.NotationFinalisee);
        this.grilleRepository = database_1.AppDataSource.getRepository(GrilleNotation_1.GrilleNotation);
    }
    getNotationGroupe(projectId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [notes, commentairesGlobaux, notationFinalisee, grillesValidees] = yield Promise.all([
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
                commentaireProjet: notationFinalisee === null || notationFinalisee === void 0 ? void 0 : notationFinalisee.commentaireProjet,
                grillesValidees,
                notationFinalisee: !!notationFinalisee
            };
        });
    }
    saveNoteCritere(projectId, groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let note = yield this.noteRepository.findOne({
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
            }
            else {
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
            return yield this.noteRepository.save(note);
        });
    }
    saveCommentaireGlobal(projectId, groupId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentaire = yield this.commentaireRepository.findOne({
                where: {
                    projectId,
                    groupId,
                    grilleId: data.grilleId
                }
            });
            if (commentaire) {
                commentaire.commentaire = data.commentaire;
            }
            else {
                commentaire = this.commentaireRepository.create({
                    projectId,
                    groupId,
                    grilleId: data.grilleId,
                    commentaire: data.commentaire
                });
            }
            return yield this.commentaireRepository.save(commentaire);
        });
    }
    finalizeNotation(projectId, groupId, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculer la note finale
            const noteFinale = this.calculateNoteFinale(data.notes);
            let notation = yield this.notationFinaliseeRepository.findOne({
                where: { projectId, groupId }
            });
            if (notation) {
                notation.commentaireProjet = data.commentaireProjet;
                notation.noteFinale = noteFinale;
            }
            else {
                notation = this.notationFinaliseeRepository.create({
                    projectId,
                    groupId,
                    commentaireProjet: data.commentaireProjet,
                    noteFinale
                });
            }
            return yield this.notationFinaliseeRepository.save(notation);
        });
    }
    getGradingGridByProjectAndGroup(projectId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = yield this.noteRepository.find({
                where: { projectId, groupId }
            });
            const commentairesGlobaux = yield this.commentaireRepository.find({
                where: { projectId, groupId }
            });
            const notationFinalisee = yield this.notationFinaliseeRepository.findOne({
                where: { projectId, groupId }
            });
            const grillesValidees = yield this.grilleRepository.find({
                where: { projectId, validee: true },
                relations: ['criteres']
            });
            return {
                notes,
                commentairesGlobaux,
                commentaireProjet: notationFinalisee === null || notationFinalisee === void 0 ? void 0 : notationFinalisee.commentaireProjet,
                grillesValidees,
                notationFinalisee: !!notationFinalisee
            };
        });
    }
    publishProjectGrades(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logique pour publier les notes d'un projet
            // Cela pourrait impliquer de mettre à jour un champ dans la base de données ou d'envoyer des notifications
            return { message: 'Notes publiées avec succès.' };
        });
    }
    validateSpecificGrille(projectId, groupId, grilleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const grille = yield this.grilleRepository.findOne({
                where: { id: grilleId, projectId }
            });
            if (!grille) {
                throw new Error('Grille not found');
            }
            grille.validee = true;
            return yield this.grilleRepository.save(grille);
        });
    }
    calculateNoteFinale(notes) {
        // Logique de calcul de la note finale basée sur les pondérations
        // À adapter selon vos besoins spécifiques
        return 0;
    }
}
exports.NotationService = NotationService;
