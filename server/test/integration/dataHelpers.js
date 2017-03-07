import mongoose from 'mongoose';

export let db = {};

export default {
    generateObjectId: () => new mongoose.Types.ObjectId(),
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}