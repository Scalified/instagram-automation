import rabbit  from '../../common/jackrabbit';
import {V1 as Client} from 'instagram-private-api';
import path from 'path'

export default function (appConfig) {
    let self = this;
    self.analyzeFeed = async (req, res, next) => {
        let exchange = rabbit.connection.default();
        exchange.queue({name: 'users', durable: true});

        let device = new Client.Device('serg.siryk');
        let storage = new Client.CookieFileStorage(path.resolve('.cookies/cookies.json'));

        // login
        let session = await Client.Session.create(device, storage, appConfig.login, appConfig.pass);
        let account = await Client.Account.searchForUser(session, req.params.id);
        let feed = new Client.Feed.AccountFollowers(session, account.params.id, 1);

        //get just 200 top users
        let followers = (await feed.get()).map((item) => item.params);
        followers.forEach((user) => exchange.publish(user, {key: 'users'}));

        return res.json(followers);
    };
}