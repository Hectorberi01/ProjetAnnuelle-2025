import express from "express";
import { prisma } from "../../utils/prisma";
import { javaVersionValidation } from "../validators/java-version-validator";

const getDownloadLink = (req: any, versionName: string) => {
    return {downloadLink: `${req.protocol}://${req.get('host')}/java-client/${versionName}/download`}
}

export const initJavaVersions = (app: express.Express) => {
    app.get("/java-client/latest", async (req, res) => {
        try {
            const latestJavaVersion = await prisma.javaVersions.findFirst({
                where: {
                    experimental: false
                },
                orderBy: {
                    uploadDate: 'desc'
                },
                select:{
                    versionName: true,
                    experimental: true,
                    uploadDate: true,
                }
            });

            if (!latestJavaVersion){
                res.status(404).json({error: "No Version Found"});
                return;
            }
            res.json({...latestJavaVersion, ...getDownloadLink(req, latestJavaVersion.versionName)});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/java-client/:version", async (req, res) => {
        try {
            const javaVersion = await prisma.javaVersions.findUnique({
                where: { versionName: req.params.version },
                select: {
                    versionName: true,
                    experimental: true,
                    file: false
                }
            });
            if (!javaVersion){
                res.status(404).json({error: "No Version Found"});
                return;
            }
            res.json({...javaVersion, ...getDownloadLink(req, javaVersion.versionName)});
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/java-client/latest/download", async (req, res) => {
        try {
            const latestJavaVersion = await prisma.javaVersions.findFirst({
                where: {
                    experimental: false
                },
                orderBy: {
                    uploadDate: 'desc'
                }
            });

            if (!latestJavaVersion){
                res.status(404).json({error: "No Version Found"});
                return;
            }
            res.json(latestJavaVersion);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.get("/javaVersions/:version/download", async (req, res) => {
        try {
            const javaVersion = await prisma.javaVersions.findUnique({
                where: { versionName: req.params.version }
            });
            if (!javaVersion){
                res.status(404).json({error: "No Version Found"});
                return;
            }
            res.json(javaVersion);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.post("/javaVersions", async (req, res) => {
        const validation = javaVersionValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send({ error: validation.error });
            return;
        }

        const javaVersionsRequest = validation.value;
        try {
            const javaVersion = await prisma.javaVersions.create({
                data: {
                    versionName: javaVersionsRequest.versionName,
                    experimental: javaVersionsRequest.experimental,
                    file: javaVersionsRequest.file,
                },
            });
            res.json(javaVersion);
        } catch (e) {
            res.status(500).send({ error: e });
            return;
        }
    });

    app.patch("/javaVersions/:id", async (req, res) => {
        const validation = javaVersionValidation.validate(req.body);

        if (validation.error) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const javaVersionsRequest = validation.value;
        try {
            const javaVersion = await prisma.javaVersions.update({
                where: {
                    id: Number(req.params.id),
                },
                data: javaVersionsRequest,
            });
            res.json(javaVersion);
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    });

    app.delete("/javaVersions/:id", async (req, res) => {
        try {
            const deletedJavaVersion = await prisma.javaVersions.delete({
                where: { id: Number(req.params.id) },
            });
            res.status(200).json(deletedJavaVersion);
        } catch (e) {
            res.status(500).send({ error: e });
        }
    });
};
