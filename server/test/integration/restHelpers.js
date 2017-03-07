import request from 'supertest-as-promised'
import testsConfig from '../.config'

export let endpoints = {
    instagram: {
        processFeed: (userId) => `/instagram/process-feed/${userId}`
    }
};

export default {
    instagram: {
        processFeed: (userId) => {
            return request(testsConfig.host)
                .get(endpoints.instagram.processFeed(userId))
        }
    }
};