import express from "express";
import { prisma } from "../../utils/prisma";
import { documentsValidation, documentsPatchValidation } from "../validators/document-validator";

export const initDocuments = (app: express.Express) => {
    app.get("/documents", async (req, res) => {
        try {
            const allDocuments = await prisma.documents.findMany({select: {
                    id: true,
                    description: true,
                    title: true,
                    path: true,
                    updatedAt: true
                }});
            allDocuments.forEach((document) => {

            })
            res.json(allDocuments);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/documents/:id", async (req, res) => {
        try {
            const document = await prisma.documents.findUnique({
                where: { id: Number(req.params.id) },
            });
            if (!document){
                throw new Error("Document not found");
            }
            res.json({document, file : Buffer.from(document.file).toString()});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/documents/organization/:id", async (req, res) => {
        try {
            const allDocuments = await prisma.documents.findMany({
                where: {
                    organizationId: Number(req.params.id),
                },
                select: {
                    id: true,
                    description: true,
                    title: true,
                    path: true,
                    updatedAt: true
                }});
            allDocuments.forEach((document) => {

            })
            res.json(allDocuments);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/documents", async (req, res) => {
        console.log('req' , req)
        const validation = documentsValidation.validate(req.body);

        if (validation.error) {
            console.log(validation)
            res.status(400).send({ error: validation.error });
            return;
        }

        const documentsRequest = validation.value;
        console.log(documentsRequest)
        try {
            const document = await prisma.documents.create({
                data: {
                    title: documentsRequest.title,
                    description: documentsRequest.description,
                    path: documentsRequest.path,
                    file: documentsRequest.fileData,
                    organizationId: documentsRequest.organizationId,
                },
            });
            console.log(documentsRequest)
            res.json(document);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/documents/:id", async (req, res) => {
        const validation = documentsPatchValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const documentsRequest = validation.value;
        try {
            const document = await prisma.documents.update({
                where: {
                    id: Number(req.params.id),
                },
                data: documentsRequest,
            });
            res.json(document);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/documents/:id", async (req, res) => {
        try {
            const deletedDocument = await prisma.documents.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedDocument);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
