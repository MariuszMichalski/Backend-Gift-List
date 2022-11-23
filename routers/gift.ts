import {Router} from "express";
import {GiftRecord} from "../records/gift.record";
import {ValidationError} from "../utils/errors";
import {CreateGiftReq, GiftEntity} from "../types";

export const giftRouter = Router();

giftRouter

    .get('/', async (req, res) => {
        const giftsList = await GiftRecord.listAll();

        res.json( {
            giftsList,
        });
    })

    .delete('/:id', async (req,res) => {
        const gift = await GiftRecord.getOne(req.params.id)

        if (!gift) {
            throw new ValidationError('no such gift')
        }

        if (await gift.countGivenGifts() > 0 ) {
            throw new ValidationError('Cannot remove given gift')
        }

        await gift.delete()

        res.end()
    })

    .post('/', async (req, res) => {

        const newGift = new GiftRecord(req.body as CreateGiftReq);
        await newGift.insert();

        res.json(newGift);
    });

