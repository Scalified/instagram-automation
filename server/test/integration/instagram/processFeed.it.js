import REST, {endpoints} from "../restHelpers";
import mochaAsync from "../../mochaAsync";

describe(`GET ${endpoints.instagram.processFeed(':userId')}`, function () {
    it.only('should return count of items to be processed', mochaAsync(async() => {
        //arrange
        //act
        let response = await REST.instagram.processFeed('someId');
        //assert
        response.status.should.equal(200);
    }));
});