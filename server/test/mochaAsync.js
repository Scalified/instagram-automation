export default (fn) => {
    return async(done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};
