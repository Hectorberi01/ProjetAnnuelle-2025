import express from "express";
import { prisma } from "../../utils/prisma";
import {
  votesPatchValidation,
  votesValidation,
} from "../validators/vote-validator";

export const initVotes = (app: express.Express) => {
  app.get("/votes", async (req, res) => {
    try {
      const allVotes = await prisma.votes.findMany();
      res.json(allVotes);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.get("/votes/:id", async (req, res) => {
    try {
      const vote = await prisma.votes.findUnique({
        where: { id: Number(req.params.id) },
      });
      res.json(vote);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.post("/votes", async (req, res) => {
    const validation = votesValidation.validate(req.body);

    if (validation.error) {
      res.status(400).send({ error: validation.error });
      return;
    }

    const votesRequest = validation.value;
    try {
      const vote = await prisma.votes.create({
        data: {
          choice: votesRequest.choice,
          agId: votesRequest.agId,
          userId: votesRequest.userId,
        },
      });
      res.json(vote);
    } catch (e) {
      res.status(500).send({ error: e });
      return;
    }
  });

  app.patch("/votes/:id", async (req, res) => {
    const validation = votesPatchValidation.validate(req.body);

    if (validation.error) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const votesRequest = validation.value;
    try {
      const vote = await prisma.votes.update({
        where: {
          id: Number(req.params.id),
        },
        data: votesRequest,
      });
      res.json(vote);
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

  app.delete("/votes/:id", async (req, res) => {
    try {
      const deletedVote = await prisma.votes.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedVote);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  });
};
