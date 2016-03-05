'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var WishItemSchema = new Schema({
	thing: { type: Schema.Types.ObjectId, ref: 'Thing' },
	requestUsers: 
	[
		{
			userId : { type: Schema.Types.ObjectId, ref: 'User' }, 
			requireQuantity : Number
		}
	],
	hasBrought: Boolean,
	requireQuantity: Number,
});

module.exports = mongoose.model('WishItem', WishItemSchema);