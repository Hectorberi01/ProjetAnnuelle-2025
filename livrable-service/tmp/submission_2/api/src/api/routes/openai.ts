import express from "express";
import OpenAI from "openai";
import {
    continueConversationValidator,
    newConversationValidator
} from "../validators/openai-validator";
import {prisma} from "../../utils/prisma";

const openai = new OpenAI()

const assistant_id = String(process.env.ASST_ID)

export const initAI = (app: express.Express) => {

    app.post('/chatbot/open', async (req, res) => {
        try {
            const validation = newConversationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).send({error: validation.error})
                return;
            }

            const initialMessage = validation.value.message
            const organization = await prisma.organizations.findUnique({
                where: {
                    id: validation.value.organizationId
                }
            })
            const ags = await prisma.aGs.findMany({
                where: {
                    organizationId: validation.value.organizationId
                }
            })
            if (!organization){
                res.json(400).send({error: validation.error})
                return;
            }
            const thread = await openai.beta.threads.create({
                messages: [
                    {"role":"user", "content":initialMessage}
                ]
            })
            const run = await openai.beta.threads.runs.createAndPoll(thread.id,
                {
                    assistant_id: assistant_id,
                    instructions: "Essaye de repondre à la requete de l'utilisateur avec les données suivantes : " +
                        `Données de l'organisation : ${JSON.stringify(organization)}` +
                        `Données des AGs : ${JSON.stringify(ags)}`,
                }
            )
            let messages: any;
            if (run.status === 'completed') {
                messages = await openai.beta.threads.messages.list(
                    run.thread_id
                );
            } else {
                console.log(run.status);
            }
            if (!messages) return;
            //messages = messages.data[0].content[0].text
            console.log(messages)
            res.status(200).json({response: messages.data[0].content[0].text.value, threadId: thread.id});
        } catch (err) {
            res.status(500).send({error: err});
        }
    })

    app.post('/chatbot/continue', async (req, res) => {
        try {
            const validation = continueConversationValidator.validate(req.body);

            if (validation.error) {
                res.status(400).send({error: validation.error})
                return;
            }

            const newMessage = validation.value.message
            const message = await openai.beta.threads.messages.create(validation.value.threadId,{"role":"user", "content":newMessage})
            const run = await openai.beta.threads.runs.createAndPoll(validation.value.threadId,
                {
                    assistant_id: assistant_id,
                    instructions: "repondre à la requete de l'utilisateur"
                }
            )
            let messages: any;
            if (run.status === 'completed') {
                messages = await openai.beta.threads.messages.list(
                    run.thread_id
                );
            }
            res.status(200).json({response: messages.data[0].content[0].text.value});
        } catch (err) {
            res.status(500).send({error: err});
        }
    })
}