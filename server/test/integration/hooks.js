import * as db from '../../common/mongoose'
import testsConfig from '../.config'

before(function (done) {
    db.connect(testsConfig.mongo, done);
});