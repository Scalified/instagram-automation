import express from 'express'
import InstagramCtrl from './instagram.ctrl'

import appConfig from '../../config'

import {async} from '../../common/errorHandler'

export default function () {
    let router = express.Router({mergeParams: true});

    let anonymousCtrl = new InstagramCtrl(appConfig);

    router.get('/process-feed/:id', async(anonymousCtrl.analyzeFeed));

    return router;
};